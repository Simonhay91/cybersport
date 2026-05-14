import connectDB from '@/lib/mongodb'
import Group from '@/models/Group'
import '@/models/Tournament'
import '@/models/Team'
import Link from 'next/link'

async function getGroups() {
  await connectDB()
  const groups = await Group.find()
    .populate('tournament', 'name')
    .populate('teams', 'name tag')
    .sort({ createdAt: -1 })
    .lean()
  return JSON.parse(JSON.stringify(groups))
}

export default async function AdminGroupsPage() {
  const groups = await getGroups()

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Rajdhani', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
          GSL Группы ({groups.length})
        </h1>
        <Link href="/admin/groups/new" style={{ padding: '10px 24px', background: 'var(--accent-yellow)', color: '#000', fontFamily: 'Rajdhani', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', textDecoration: 'none' }}>
          + Создать
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {groups.map((g: { _id: string; name: string; tournament?: { name: string }; status: string; teams: { name: string; tag: string }[] }) => (
          <div key={g._id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <p style={{ fontFamily: 'Rajdhani', fontSize: '18px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)' }}>{g.name}</p>
                <p style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)' }}>{g.tournament?.name || '—'}</p>
              </div>
              <span style={{
                padding: '3px 10px',
                fontSize: '11px',
                fontFamily: 'Inter',
                fontWeight: 600,
                color: g.status === 'live' ? 'var(--accent-green)' : g.status === 'finished' ? 'var(--text-muted)' : 'var(--text-muted)',
                border: `1px solid ${g.status === 'live' ? 'var(--accent-green)' : 'var(--border-default)'}50`,
                background: g.status === 'live' ? 'rgba(57,211,83,0.1)' : 'transparent',
              }}>
                {g.status === 'live' ? 'Играется' : g.status === 'finished' ? 'Завершена' : 'Скоро'}
              </span>
            </div>
            <div style={{ marginBottom: '16px' }}>
              {g.teams?.map((t: { name: string; tag: string }, i: number) => (
                <p key={i} style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  {i + 1}. {t.name} <span style={{ color: 'var(--text-muted)' }}>[{t.tag}]</span>
                </p>
              ))}
              {(!g.teams || g.teams.length === 0) && (
                <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)' }}>Команды не назначены</p>
              )}
            </div>
            <Link href={`/admin/groups/${g._id}`} style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--accent-yellow)', textDecoration: 'none' }}>
              Редактировать →
            </Link>
          </div>
        ))}
        {groups.length === 0 && (
          <p style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-muted)' }}>
            Групп нет. <Link href="/admin/groups/new" style={{ color: 'var(--accent-yellow)' }}>Создать первую</Link>
          </p>
        )}
      </div>
    </div>
  )
}
