import connectDB from '@/lib/mongodb'
import Team from '@/models/Team'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/home/Footer'

async function getTeams(search?: string, status?: string, sort?: string) {
  try {
    await connectDB()
    const query: Record<string, unknown> = {}
    if (search) query.name = { $regex: search, $options: 'i' }
    if (status && status !== 'all') query.status = status

    type SortOption = [string, 1 | -1][]
    const sortMap: Record<string, SortOption> = {
      name: [['name', 1]],
      wins: [['wins', -1]],
      matches: [['wins', -1]],
    }

    const teams = await Team.find(query)
      .select('name slug logo tag city status wins losses')
      .sort(sortMap[sort || 'name'] || [['name', 1]])
      .lean()
    return JSON.parse(JSON.stringify(teams))
  } catch {
    return []
  }
}

const statusMap: Record<string, { label: string; color: string }> = {
  confirmed: { label: 'Подтверждена', color: '#c8ff00' },
  pending: { label: 'На проверке', color: '#ff9900' },
  rejected: { label: 'Отклонена', color: '#e63946' },
}

export default async function TeamsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; sort?: string }>
}) {
  const { search, status, sort } = await searchParams
  const teams = await getTeams(search, status, sort)

  return (
    <>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          padding: '80px 0 60px',
          background: 'var(--bg-primary)',
          overflow: 'hidden',
        }}
      >
        {/* Glow */}
        <div style={{ position: 'absolute', right: 0, top: 0, width: '45%', height: '100%', background: 'radial-gradient(ellipse at right center, rgba(57,211,83,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <svg style={{ position: 'absolute', right: '4%', top: '50%', transform: 'translateY(-50%)', opacity: 0.1, filter: 'drop-shadow(0 0 40px rgba(200,255,0,0.3))' }} width="320" height="400" viewBox="0 0 420 520" className="hidden lg:block">
          <polygon points="210,20 390,120 390,320 210,500 30,320 30,120" fill="none" stroke="#c8ff00" strokeWidth="1.5" />
          <polygon points="210,60 360,145 360,305 210,460 60,305 60,145" fill="none" stroke="#39d353" strokeWidth="0.5" />
        </svg>

        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }} className="px-4 md:px-12">
          <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--accent-yellow)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            Все участники лиги
          </p>
          <h1 style={{ fontFamily: 'Rajdhani', fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '16px' }}>
            Команды SPL
          </h1>
          <p style={{ fontFamily: 'Inter', fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '500px' }}>
            Лучшие команды СНГ соревнуются за чемпионство и призовой фонд <span style={{ color: 'var(--accent-yellow)', fontWeight: 600 }}>200,000 ₽</span> в SPL Winter Season 1
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            {[
              { value: '64–128', label: 'Команд' },
              { value: 'СНГ', label: 'Регион' },
              { value: '200,000 ₽', label: 'Призовой фонд' },
            ].map(item => (
              <div key={item.label}>
                <p style={{ fontFamily: 'Rajdhani', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</p>
                <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '32px 0 80px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }} className="px-4 md:px-12">
          {/* Filters */}
          <form method="GET" style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
              <input
                name="search"
                defaultValue={search}
                placeholder="Поиск команды..."
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <select
              name="status"
              defaultValue={status || 'all'}
              style={{ padding: '10px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', fontFamily: 'Inter', fontSize: '14px', outline: 'none' }}
            >
              <option value="all">Статус: Все</option>
              <option value="confirmed">Подтверждены</option>
              <option value="pending">На проверке</option>
            </select>
            <select
              name="sort"
              defaultValue={sort || 'name'}
              style={{ padding: '10px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', fontFamily: 'Inter', fontSize: '14px', outline: 'none' }}
            >
              <option value="name">Сортировка: А–Я</option>
              <option value="wins">По победам</option>
              <option value="matches">По матчам</option>
            </select>
            <button type="submit" style={{ padding: '10px 20px', background: 'var(--accent-yellow)', color: '#000', fontFamily: 'Rajdhani', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
              Найти
            </button>
          </form>

          {/* Count */}
          <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {teams.length} команд{teams.length === 1 ? 'а' : teams.length < 5 ? 'ы' : ''}
          </p>

          {/* Grid */}
          {teams.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontFamily: 'Inter', fontSize: '16px', color: 'var(--text-muted)' }}>Команды не найдены</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
              {teams.map((team: { _id: string; name: string; slug: string; logo?: string; tag: string; city?: string; status: string; wins: number; losses: number }) => {
                const s = statusMap[team.status] || statusMap.pending
                const played = team.wins + team.losses
                return (
                  <Link key={team._id} href={`/teams/${team.slug}`} style={{ textDecoration: 'none' }}>
                    <div
                      className="team-card"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-default)',
                        borderRadius: '12px',
                        padding: '20px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'border-color 0.2s, transform 0.2s',
                      }}
                    >
                      <div style={{ width: '80px', height: '80px', background: 'var(--bg-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {team.logo
                          ? <Image src={team.logo} alt={team.name} width={80} height={80} style={{ objectFit: 'contain' }} />
                          : <span style={{ fontFamily: 'Rajdhani', fontSize: '24px', fontWeight: 700, color: 'var(--text-muted)' }}>{team.tag?.slice(0, 3).toUpperCase()}</span>
                        }
                      </div>
                      <p style={{ fontFamily: 'Rajdhani', fontSize: '15px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)', textAlign: 'center' }}>{team.name}</p>
                      <span style={{ fontSize: '10px', fontFamily: 'Inter', fontWeight: 600, textTransform: 'uppercase', padding: '2px 8px', color: s.color, border: `1px solid ${s.color}40`, background: `${s.color}15` }}>
                        {s.label}
                      </span>
                      <div style={{ width: '100%', borderTop: '1px solid var(--border-default)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)' }}>{played} матчей</span>
                        <span style={{ fontFamily: 'Rajdhani', fontSize: '13px', color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--accent-green)' }}>{team.wins}</span>
                          <span style={{ color: 'var(--text-muted)' }}>–</span>
                          <span style={{ color: 'var(--accent-red)' }}>{team.losses}</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
