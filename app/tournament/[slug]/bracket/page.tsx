import connectDB from '@/lib/mongodb'
import Tournament from '@/models/Tournament'
import Group from '@/models/Group'
import Match from '@/models/Match'
import '@/models/Team'
import TournamentLayout from '@/components/tournament/TournamentLayout'
import BracketView from '@/components/tournament/BracketView'
import { notFound } from 'next/navigation'

export default async function BracketPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ view?: string; group?: string }> }) {
  const { slug } = await params
  const { view, group: groupFilter } = await searchParams
  const activeView = view || 'gsl'

  await connectDB()
  const tournament = await Tournament.findOne({ slug }).lean()
  if (!tournament) notFound()
  const t = JSON.parse(JSON.stringify(tournament))

  const [groups, playoffMatches] = await Promise.all([
    Group.find({ tournament: t._id })
      .populate('teams', 'name slug logo tag wins losses roundsFor roundsAgainst')
      .populate({ path: 'matches', populate: [{ path: 'teamA', select: 'name slug logo tag' }, { path: 'teamB', select: 'name slug logo tag' }, { path: 'winner', select: '_id' }] })
      .populate('first', 'name slug logo tag')
      .populate('second', 'name slug logo tag')
      .lean(),
    Match.find({ tournament: t._id, group: { $exists: false } })
      .populate('teamA', 'name slug logo tag')
      .populate('teamB', 'name slug logo tag')
      .populate('winner', '_id name')
      .sort({ round: 1 })
      .lean(),
  ])

  // Compute form (last 3 W/L) per team in each group, and sort teams by place
  const groupsRaw = JSON.parse(JSON.stringify(groups)) as Array<{
    _id: string
    name: string
    status: string
    format?: 'gsl-4' | 'de-8' | 'round-robin'
    teams: Array<{ _id: string; name: string; slug: string; logo?: string; tag: string; wins: number; losses: number; roundsFor: number; roundsAgainst: number }>
    matches: Array<{
      _id: string
      teamA?: { _id: string; name: string; slug: string; logo?: string; tag: string }
      teamB?: { _id: string; name: string; slug: string; logo?: string; tag: string }
      winner?: { _id: string }
      scoreA: number
      scoreB: number
      status: string
      stage: string
      round?: number
      bracket?: 'WB' | 'LB' | 'GF'
      scheduledAt?: string
    }>
    first?: { _id: string; name: string; slug: string; logo?: string; tag: string }
    second?: { _id: string; name: string; slug: string; logo?: string; tag: string }
  }>
  const groupsEnriched = groupsRaw.map(g => {
    const teamsWithForm = g.teams.map(team => {
      const teamMatches = g.matches
        .filter(m => m.status === 'finished' && m.winner && (m.teamA?._id === team._id || m.teamB?._id === team._id))
        .sort((a, b) => new Date(a.scheduledAt || 0).getTime() - new Date(b.scheduledAt || 0).getTime())
      const form: ('W' | 'L')[] = teamMatches.map(m =>
        m.winner?._id === team._id ? 'W' : 'L'
      )
      const place = g.first?._id === team._id ? 1 : g.second?._id === team._id ? 2 : null
      return { ...team, form, place }
    })
    teamsWithForm.sort((a, b) => {
      if (a.place && b.place) return a.place - b.place
      if (a.place) return -1
      if (b.place) return 1
      const diffA = (a.roundsFor || 0) - (a.roundsAgainst || 0)
      const diffB = (b.roundsFor || 0) - (b.roundsAgainst || 0)
      if (b.wins !== a.wins) return b.wins - a.wins
      return diffB - diffA
    })
    return { ...g, teams: teamsWithForm }
  })

  const data = {
    groups: groupsEnriched,
    playoffMatches: JSON.parse(JSON.stringify(playoffMatches)),
  }

  return (
    <TournamentLayout tournament={t} activeTab="bracket">
      <BracketView {...data} activeView={activeView} groupFilter={groupFilter} tournamentSlug={slug} />
    </TournamentLayout>
  )
}
