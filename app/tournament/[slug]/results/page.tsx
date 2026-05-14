export const dynamic = 'force-dynamic'
import connectDB from '@/lib/mongodb'
import Tournament from '@/models/Tournament'
import Match from '@/models/Match'
import '@/models/Team'
import MatchCard from '@/components/tournament/MatchCard'
import TournamentLayout from '@/components/tournament/TournamentLayout'
import { notFound } from 'next/navigation'

export default async function ResultsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await connectDB()
  const tournament = await Tournament.findOne({ slug }).lean()
  if (!tournament) notFound()
  const t = JSON.parse(JSON.stringify(tournament))

  const matches = await Match.find({ tournament: t._id, status: 'finished' })
    .populate('teamA', 'name slug logo tag')
    .populate('teamB', 'name slug logo tag')
    .populate('winner', '_id')
    .sort({ scheduledAt: -1 })
    .lean()

  const results = JSON.parse(JSON.stringify(matches))

  return (
    <TournamentLayout tournament={t} activeTab="results">
      <h2 style={{ fontFamily: 'Rajdhani', fontSize: '24px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '24px' }}>
        Результаты
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {results.length === 0 ? (
          <p style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center', padding: '48px 0' }}>Результатов пока нет</p>
        ) : (
          results.map((m: Parameters<typeof MatchCard>[0]['match']) => <MatchCard key={m._id} match={m} />)
        )}
      </div>
    </TournamentLayout>
  )
}
