export const dynamic = 'force-dynamic'
import connectDB from '@/lib/mongodb'
import Tournament from '@/models/Tournament'
import Match from '@/models/Match'
import '@/models/Team'
import MatchCard from '@/components/tournament/MatchCard'
import TournamentLayout from '@/components/tournament/TournamentLayout'
import { notFound } from 'next/navigation'

async function getData(slug: string, statusFilter?: string) {
  await connectDB()
  const tournament = await Tournament.findOne({ slug }).lean()
  if (!tournament) return null
  const t = JSON.parse(JSON.stringify(tournament))

  const query: Record<string, unknown> = { tournament: t._id }
  if (statusFilter && statusFilter !== 'all') query.status = statusFilter

  const matches = await Match.find(query)
    .populate('teamA', 'name slug logo tag')
    .populate('teamB', 'name slug logo tag')
    .populate('winner', '_id')
    .sort({ scheduledAt: 1 })
    .lean()

  return { tournament: t, matches: JSON.parse(JSON.stringify(matches)) }
}

export default async function MatchesPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ status?: string }> }) {
  const { slug } = await params
  const { status } = await searchParams
  const data = await getData(slug, status)
  if (!data) notFound()
  const { tournament, matches } = data

  const filters = [
    { label: 'Все', value: 'all' },
    { label: 'Live', value: 'live' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Finished', value: 'finished' },
  ]

  return (
    <TournamentLayout tournament={tournament} activeTab="matches">
      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {filters.map(f => (
          <a
            key={f.value}
            href={f.value === 'all' ? `/tournament/${slug}/matches` : `/tournament/${slug}/matches?status=${f.value}`}
            style={{
              padding: '6px 16px',
              fontFamily: 'Inter',
              fontSize: '13px',
              textDecoration: 'none',
              border: '1px solid',
              borderColor: (status || 'all') === f.value ? 'var(--accent-yellow)' : 'var(--border-default)',
              color: (status || 'all') === f.value ? 'var(--accent-yellow)' : 'var(--text-muted)',
              background: (status || 'all') === f.value ? 'rgba(200,255,0,0.05)' : 'transparent',
            }}
          >
            {f.label}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {matches.length === 0 ? (
          <p style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-muted)', padding: '48px 0', textAlign: 'center' }}>
            Матчей не найдено
          </p>
        ) : (
          matches.map((m: Parameters<typeof MatchCard>[0]['match']) => <MatchCard key={m._id} match={m} />)
        )}
      </div>
    </TournamentLayout>
  )
}
