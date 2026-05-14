import connectDB from '@/lib/mongodb'
import Team from '@/models/Team'
import '@/models/Player'
import Link from 'next/link'
import Image from 'next/image'

const statusMap: Record<string, { label: string; color: string }> = {
  confirmed: { label: 'Подтверждена', color: '#c8ff00' },
  pending: { label: 'На проверке', color: '#ff9900' },
  rejected: { label: 'Отклонена', color: '#e63946' },
}

async function getTeams() {
  await connectDB()
  const teams = await Team.find().populate('captain', 'nickname').sort({ createdAt: -1 }).lean()
  return JSON.parse(JSON.stringify(teams))
}

export default async function AdminTeamsPage() {
  const teams = await getTeams()

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Rajdhani', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
          Команды ({teams.length})
        </h1>
      </div>

      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
              {['Команда', 'Тег', 'Капитан', 'Статус', 'W', 'L', 'Win%', ''].map((h) => (
                <th key={h} style={{ padding: '12px 16px', fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'left', fontWeight: 500 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teams.map((team: { _id: string; name: string; slug: string; logo?: string; tag: string; captain?: { nickname: string }; status: string; wins: number; losses: number }) => {
              const s = statusMap[team.status] || statusMap.pending
              const played = team.wins + team.losses
              const wr = played > 0 ? Math.round((team.wins / played) * 100) : 0
              return (
                <tr key={team._id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', background: 'var(--bg-tertiary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {team.logo
                          ? <Image src={team.logo} alt={team.name} width={36} height={36} style={{ objectFit: 'contain' }} />
                          : <span style={{ fontFamily: 'Rajdhani', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>{team.tag?.slice(0, 2)}</span>
                        }
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Rajdhani', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{team.name}</p>
                        <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)' }}>{team.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)' }}>{team.tag}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-secondary)' }}>{team.captain?.nickname || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', fontSize: '11px', fontFamily: 'Inter', fontWeight: 600, color: s.color, border: `1px solid ${s.color}40`, background: `${s.color}15` }}>
                      {s.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'Rajdhani', fontSize: '16px', color: 'var(--accent-green)' }}>{team.wins}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'Rajdhani', fontSize: '16px', color: 'var(--accent-red)' }}>{team.losses}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'Rajdhani', fontSize: '16px', color: 'var(--accent-yellow)' }}>{wr}%</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/admin/teams/${team._id}`} style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--accent-yellow)', textDecoration: 'none' }}>
                      Ред. →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {teams.length === 0 && (
          <p style={{ textAlign: 'center', padding: '48px', fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-muted)' }}>
            Команд нет. Подтвердите заявку, чтобы создать команду.
          </p>
        )}
      </div>
    </div>
  )
}
