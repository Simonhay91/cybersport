export const dynamic = 'force-dynamic'
import connectDB from '@/lib/mongodb'
import Match from '@/models/Match'
import '@/models/Team'
import '@/models/Tournament'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

const statusMap: Record<string, { label: string; color: string }> = {
  upcoming: { label: 'Upcoming', color: '#aaaaaa' },
  live: { label: 'Live', color: '#39d353' },
  finished: { label: 'Finished', color: '#555555' },
}

async function getMatches() {
  await connectDB()
  const matches = await Match.find()
    .populate('teamA', 'name tag logo')
    .populate('teamB', 'name tag logo')
    .populate('tournament', 'name slug')
    .sort({ scheduledAt: -1 })
    .lean()
  return JSON.parse(JSON.stringify(matches))
}

export default async function AdminMatchesPage() {
  const matches = await getMatches()

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Rajdhani', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
          Матчи ({matches.length})
        </h1>
        <Link href="/admin/matches/new" style={{ padding: '10px 24px', background: 'var(--accent-yellow)', color: '#000', fontFamily: 'Rajdhani', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', textDecoration: 'none' }}>
          + Добавить
        </Link>
      </div>

      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
              {['Матч', 'Турнир', 'Стадия', 'Счёт', 'Формат', 'Статус', 'Дата', ''].map((h) => (
                <th key={h} style={{ padding: '12px 16px', fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'left', fontWeight: 500 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matches.map((m: {
              _id: string
              teamA?: { name: string; tag: string }
              teamB?: { name: string; tag: string }
              tournament?: { name: string }
              stage: string
              scoreA: number
              scoreB: number
              format: string
              status: string
              scheduledAt?: string
            }) => {
              const s = statusMap[m.status] || statusMap.upcoming
              return (
                <tr key={m._id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <p style={{ fontFamily: 'Rajdhani', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {m.teamA?.name || 'TBD'} vs {m.teamB?.name || 'TBD'}
                    </p>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {m.tournament?.name || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {m.stage}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'Rajdhani', fontSize: '18px', fontWeight: 700, color: 'var(--accent-yellow)' }}>
                    {m.status === 'finished' ? `${m.scoreA} : ${m.scoreB}` : '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)' }}>{m.format}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', fontSize: '11px', fontFamily: 'Inter', fontWeight: 600, color: s.color, border: `1px solid ${s.color}50`, background: `${s.color}10` }}>
                      {s.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {m.scheduledAt ? formatDate(m.scheduledAt) : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/admin/matches/${m._id}`} style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--accent-yellow)', textDecoration: 'none' }}>
                      Ред. →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {matches.length === 0 && (
          <p style={{ textAlign: 'center', padding: '48px', fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-muted)' }}>
            Матчей нет. <Link href="/admin/matches/new" style={{ color: 'var(--accent-yellow)' }}>Добавить первый</Link>
          </p>
        )}
      </div>
    </div>
  )
}
