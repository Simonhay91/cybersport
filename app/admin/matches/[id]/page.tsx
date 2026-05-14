import connectDB from '@/lib/mongodb'
import Match from '@/models/Match'
import Tournament from '@/models/Tournament'
import Team from '@/models/Team'
import MatchForm from '@/components/admin/MatchForm'
import { notFound } from 'next/navigation'

export default async function EditMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await connectDB()
  const [match, tournaments, teams, allMatches] = await Promise.all([
    Match.findById(id).lean(),
    Tournament.find().select('name _id').lean(),
    Team.find({ status: 'confirmed' }).select('name tag _id').lean(),
    Match.find().select('_id stage teamA teamB').populate('teamA', 'name').populate('teamB', 'name').lean(),
  ])
  if (!match) notFound()

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      <h1 style={{ fontFamily: 'Rajdhani', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '32px' }}>
        Редактировать матч
      </h1>
      <MatchForm
        initial={JSON.parse(JSON.stringify(match))}
        tournaments={JSON.parse(JSON.stringify(tournaments))}
        teams={JSON.parse(JSON.stringify(teams))}
        allMatches={JSON.parse(JSON.stringify(allMatches))}
      />
    </div>
  )
}
