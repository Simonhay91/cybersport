export const dynamic = 'force-dynamic'
import connectDB from '@/lib/mongodb'
import Tournament from '@/models/Tournament'
import Team from '@/models/Team'
import Match from '@/models/Match'
import MatchForm from '@/components/admin/MatchForm'

async function getData() {
  await connectDB()
  const [tournaments, teams, matches] = await Promise.all([
    Tournament.find().select('name _id').lean(),
    Team.find({ status: 'confirmed' }).select('name tag _id').lean(),
    Match.find().select('_id stage teamA teamB').lean(),
  ])
  return {
    tournaments: JSON.parse(JSON.stringify(tournaments)),
    teams: JSON.parse(JSON.stringify(teams)),
    matches: JSON.parse(JSON.stringify(matches)),
  }
}

export default async function NewMatchPage() {
  const { tournaments, teams, matches } = await getData()

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      <h1 style={{ fontFamily: 'Rajdhani', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '32px' }}>
        Новый матч
      </h1>
      <MatchForm tournaments={tournaments} teams={teams} allMatches={matches} />
    </div>
  )
}
