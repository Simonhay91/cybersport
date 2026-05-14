import connectDB from '@/lib/mongodb'
import Tournament from '@/models/Tournament'
import Link from 'next/link'
import { formatDate, formatMoney } from '@/lib/utils'

const statusLabels: Record<string, { label: string; color: string }> = {
  upcoming: { label: 'Upcoming', color: '#aaaaaa' },
  live: { label: 'Live', color: '#39d353' },
  finished: { label: 'Finished', color: '#555555' },
}

async function getTournaments() {
  await connectDB()
  const tournaments = await Tournament.find().sort({ createdAt: -1 }).lean()
  return JSON.parse(JSON.stringify(tournaments))
}

export default async function TournamentsPage() {
  const tournaments = await getTournaments()

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Rajdhani', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
          Турниры
        </h1>
        <Link
          href="/admin/tournaments/new"
          style={{ padding: '10px 24px', background: 'var(--accent-yellow)', color: '#000', fontFamily: 'Rajdhani', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', textDecoration: 'none' }}
        >
          + Создать
        </Link>
      </div>

      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
              {['Название', 'Статус', 'Призовой фонд', 'Начало', 'Конец', 'Команды', ''].map((h) => (
                <th key={h} style={{ padding: '12px 16px', fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'left', fontWeight: 500 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tournaments.map((t: { _id: string; name: string; slug: string; status: string; prizePool: number; startDate?: string; endDate?: string; teams: string[] }) => {
              const s = statusLabels[t.status] || statusLabels.upcoming
              return (
                <tr key={t._id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <p style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</p>
                    <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)' }}>{t.slug}</p>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 10px', fontSize: '11px', fontFamily: 'Inter', fontWeight: 600, color: s.color, border: `1px solid ${s.color}50`, background: `${s.color}10` }}>
                      {s.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'Rajdhani', fontSize: '16px', color: 'var(--accent-yellow)' }}>
                    {formatMoney(t.prizePool)}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {t.startDate ? formatDate(t.startDate) : '—'}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {t.endDate ? formatDate(t.endDate) : '—'}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {t.teams?.length || 0}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Link href={`/admin/tournaments/${t._id}`} style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--accent-yellow)', textDecoration: 'none' }}>
                      Ред. →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {tournaments.length === 0 && (
          <p style={{ textAlign: 'center', padding: '48px', fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-muted)' }}>
            Турниров нет. <Link href="/admin/tournaments/new" style={{ color: 'var(--accent-yellow)' }}>Создать первый</Link>
          </p>
        )}
      </div>
    </div>
  )
}
