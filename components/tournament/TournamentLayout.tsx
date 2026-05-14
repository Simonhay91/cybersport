import Link from 'next/link'
import Footer from '@/components/home/Footer'

interface TournamentLayoutProps {
  tournament: {
    name: string
    slug: string
    status: string
    prizePool: number
    startDate?: string
    endDate?: string
    maxTeams?: number
    teams?: unknown[]
  }
  activeTab: 'overview' | 'matches' | 'bracket' | 'results' | 'teams'
  children: React.ReactNode
}

const statusMap: Record<string, { label: string; color: string; dot?: boolean }> = {
  upcoming: { label: 'Upcoming', color: '#aaaaaa' },
  live: { label: 'Live', color: '#39d353', dot: true },
  finished: { label: 'Finished', color: '#555555' },
}

export default function TournamentLayout({ tournament: t, activeTab, children }: TournamentLayoutProps) {
  const s = statusMap[t.status] || statusMap.upcoming
  const tabs = [
    { key: 'overview', label: 'Обзор', href: `/tournament/${t.slug}` },
    { key: 'matches', label: 'Матчи', href: `/tournament/${t.slug}/matches` },
    { key: 'bracket', label: 'Сетка', href: `/tournament/${t.slug}/bracket` },
    { key: 'results', label: 'Результаты', href: `/tournament/${t.slug}/results` },
    { key: 'teams', label: 'Команды', href: `/tournament/${t.slug}/teams` },
  ]

  return (
    <>
      {/* Header */}
      <section style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-default)', padding: '32px 0 0' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }} className="px-4 md:px-12">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Главная</Link>
                <span style={{ margin: '0 8px' }}>›</span>
                <span>Турниры</span>
                <span style={{ margin: '0 8px' }}>›</span>
                <span style={{ color: 'var(--text-primary)' }}>{t.name}</span>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: 'Rajdhani', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                  {t.name}
                </h1>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: s.dot ? 'rgba(57,211,83,0.1)' : 'transparent', border: `1px solid ${s.color}`, color: s.color, padding: '3px 10px', fontSize: '11px', fontFamily: 'Inter', fontWeight: 600 }}>
                  {s.dot && <span className="live-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#39d353', display: 'inline-block' }} />}
                  {s.label}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {t.startDate && t.endDate && (
                <div>
                  <p style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {new Date(t.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} — {new Date(t.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  </p>
                  <p style={{ fontFamily: 'Inter', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Даты</p>
                </div>
              )}
              <div>
                <p style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 700, color: 'var(--accent-yellow)' }}>
                  {new Intl.NumberFormat('ru-RU').format(t.prizePool)} ₽
                </p>
                <p style={{ fontFamily: 'Inter', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Призовой фонд</p>
              </div>
              <div>
                <p style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {t.teams?.length || 0} / {t.maxTeams || 128}
                </p>
                <p style={{ fontFamily: 'Inter', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Команд</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: 'none', gap: '0', overflowX: 'auto' }}>
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                href={tab.href}
                style={{
                  fontFamily: 'Rajdhani',
                  fontSize: '14px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: tab.key === activeTab ? 'var(--text-primary)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  padding: '12px 20px',
                  borderBottom: tab.key === activeTab ? '2px solid var(--accent-yellow)' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: 'var(--bg-primary)', padding: '32px 0 80px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }} className="px-4 md:px-12">
          {children}
        </div>
      </section>

      <Footer />
    </>
  )
}
