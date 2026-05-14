export const dynamic = 'force-dynamic'
import connectDB from '@/lib/mongodb'
import Tournament from '@/models/Tournament'
import Match from '@/models/Match'
import Team from '@/models/Team'
import Link from 'next/link'
import Image from 'next/image'
import MatchCard from '@/components/tournament/MatchCard'
import Footer from '@/components/home/Footer'
import { notFound } from 'next/navigation'

async function getData(slug: string) {
  await connectDB()
  const tournament = await Tournament.findOne({ slug })
    .populate('teams', 'name slug logo tag status')
    .lean()
  if (!tournament) return null

  const t = JSON.parse(JSON.stringify(tournament))
  const tId = t._id

  const [upcoming, results] = await Promise.all([
    Match.find({ tournament: tId, status: { $in: ['upcoming', 'live'] } })
      .populate('teamA', 'name slug logo tag')
      .populate('teamB', 'name slug logo tag')
      .populate('winner', '_id')
      .sort({ scheduledAt: 1 })
      .limit(4)
      .lean(),
    Match.find({ tournament: tId, status: 'finished' })
      .populate('teamA', 'name slug logo tag')
      .populate('teamB', 'name slug logo tag')
      .populate('winner', '_id')
      .sort({ scheduledAt: -1 })
      .limit(4)
      .lean(),
  ])

  return { tournament: t, upcoming: JSON.parse(JSON.stringify(upcoming)), results: JSON.parse(JSON.stringify(results)) }
}

const statusMap: Record<string, { label: string; color: string; dot?: boolean }> = {
  upcoming: { label: 'Upcoming', color: '#aaaaaa' },
  live: { label: 'Live', color: '#39d353', dot: true },
  finished: { label: 'Finished', color: '#555555' },
}

export default async function TournamentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getData(slug)
  if (!data) notFound()

  const { tournament: t, upcoming, results } = data
  const s = statusMap[t.status] || statusMap.upcoming
  const tabs = [
    { label: 'Обзор', href: `/tournament/${slug}` },
    { label: 'Матчи', href: `/tournament/${slug}/matches` },
    { label: 'Сетка', href: `/tournament/${slug}/bracket` },
    { label: 'Результаты', href: `/tournament/${slug}/results` },
    { label: 'Команды', href: `/tournament/${slug}/teams` },
  ]

  interface TeamDoc { _id: string; name: string; slug: string; logo?: string; tag: string; status: string }
  interface MatchDoc {
    _id: string
    teamA?: { _id: string; name: string; slug: string; logo?: string; tag: string }
    teamB?: { _id: string; name: string; slug: string; logo?: string; tag: string }
    scoreA: number
    scoreB: number
    format: string
    status: string
    stage: string
    scheduledAt?: string
    winner?: { _id: string }
  }

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', padding: '60px 0 0', background: 'var(--bg-primary)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 0, top: 0, width: '45%', height: '100%', background: 'radial-gradient(ellipse at right center, rgba(57,211,83,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <svg style={{ position: 'absolute', right: '4%', top: '40%', transform: 'translateY(-50%)', opacity: 0.1 }} width="300" height="360" viewBox="0 0 420 520" className="hidden lg:block">
          <polygon points="210,20 390,120 390,320 210,500 30,320 30,120" fill="none" stroke="#c8ff00" strokeWidth="1.5" />
          <polygon points="210,60 360,145 360,305 210,460 60,305 60,145" fill="none" stroke="#39d353" strokeWidth="0.5" />
        </svg>

        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }} className="px-4 md:px-12">
          <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--accent-yellow)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Текущий турнир</p>
          <h1 style={{ fontFamily: 'Rajdhani', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', lineHeight: 1.05, marginBottom: '16px' }}>
            {t.name}
          </h1>

          {/* Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: s.dot ? 'rgba(57,211,83,0.1)' : 'transparent', border: `1px solid ${s.color}`, color: s.color, padding: '4px 12px', fontSize: '12px', fontFamily: 'Inter', fontWeight: 600, textTransform: 'uppercase' }}>
              {s.dot && <span className="live-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#39d353', display: 'inline-block' }} />}
              {s.label}
            </span>
            <span style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)' }}>Статус турнира</span>
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', marginBottom: '32px' }}>
            {t.startDate && t.endDate && (
              <div>
                <p style={{ fontFamily: 'Rajdhani', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {new Date(t.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} — {new Date(t.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                </p>
                <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Даты проведения</p>
              </div>
            )}
            <div>
              <p style={{ fontFamily: 'Rajdhani', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {new Intl.NumberFormat('ru-RU').format(t.prizePool)} ₽
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Призовой фонд</p>
            </div>
            <div>
              <p style={{ fontFamily: 'Rajdhani', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {t.teams?.length || 0} / {t.maxTeams || 128}
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Команд</p>
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {t.registrationOpen && (
              <Link href="/register" style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: '#000', background: 'var(--accent-yellow)', padding: '12px 28px', textDecoration: 'none' }}>
                Зарегистрировать команду
              </Link>
            )}
            <Link href={`/tournament/${slug}/matches`} style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', border: '1px solid var(--border-accent)', padding: '12px 28px', textDecoration: 'none' }}>
              Подробнее о турнире
            </Link>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-default)', gap: '0', overflowX: 'auto' }}>
            {tabs.map((tab, i) => (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  fontFamily: 'Rajdhani',
                  fontSize: '14px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: i === 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  padding: '12px 20px',
                  borderBottom: i === 0 ? '2px solid var(--accent-yellow)' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Overview content */}
      <section style={{ background: 'var(--bg-primary)', padding: '40px 0 80px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }} className="px-4 md:px-12">
          {/* 3-column info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}>
            {/* О турнире */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', padding: '24px' }}>
              <h3 style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '12px' }}>О турнире</h3>
              {t.description && <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>{t.description}</p>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Формат', value: t.format || 'BO1 / BO3' },
                  { label: 'Система', value: 'GSL Группы + Плей-офф' },
                  { label: 'Платформа', value: 'Online' },
                  { label: 'Организатор', value: 'SPL' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-default)' }}>
                    <span style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{row.label}</span>
                    <span style={{ fontFamily: 'Rajdhani', fontSize: '14px', color: 'var(--accent-yellow)', fontWeight: 600 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Призовой фонд */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', padding: '24px' }}>
              <h3 style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '12px' }}>Призовой фонд</h3>
              <p style={{ fontFamily: 'Rajdhani', fontSize: '48px', fontWeight: 700, color: 'var(--accent-yellow)', lineHeight: 1, marginBottom: '20px' }}>
                {new Intl.NumberFormat('ru-RU').format(t.prizePool)} ₽
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(t.prizeDistribution || [{ place: 1, amount: 100000 }, { place: 2, amount: 60000 }, { place: 3, amount: 40000 }]).map((p: { place: number; amount: number }) => (
                  <div key={p.place} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-default)' }}>
                    <span style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {p.place === 1 ? '🥇' : p.place === 2 ? '🥈' : '🥉'} {p.place} место
                    </span>
                    <span style={{ fontFamily: 'Rajdhani', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {new Intl.NumberFormat('ru-RU').format(p.amount)} ₽
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Стадии */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', padding: '24px' }}>
              <h3 style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '16px' }}>Стадии турнира</h3>
              {[
                { name: 'Open Qualifier', sub: 'Открытая квалификация' },
                { name: 'Closed Qualifier', sub: 'Закрытая квалификация' },
                { name: 'Main Stage', sub: 'Основная стадия' },
              ].map((stage, i, arr) => (
                <div key={stage.name} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: i < arr.length - 1 ? '0' : '0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '0' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(200,255,0,0.1)', border: '1px solid var(--accent-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '12px', color: 'var(--accent-yellow)' }}>{i + 1}</span>
                    </div>
                    {i < arr.length - 1 && <div style={{ width: '1px', height: '24px', background: 'var(--border-default)', margin: '4px 0' }} />}
                  </div>
                  <div style={{ paddingBottom: i < arr.length - 1 ? '8px' : '0' }}>
                    <p style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)' }}>{stage.name}</p>
                    <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)' }}>{stage.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Teams */}
          {t.teams?.length > 0 && (
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontFamily: 'Rajdhani', fontSize: '20px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)' }}>Участники турнира</h2>
                <Link href={`/tournament/${slug}/teams`} style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--accent-yellow)', textDecoration: 'none' }}>Посмотреть все команды →</Link>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {(t.teams as TeamDoc[]).slice(0, 8).map((team) => (
                  <Link key={team._id} href={`/teams/${team.slug}`} style={{ textDecoration: 'none' }}>
                    <div
                      className="hover-yellow-border"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'border-color 0.2s' }}
                    >
                      <div style={{ width: '32px', height: '32px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {team.logo ? <Image src={team.logo} alt={team.name} width={32} height={32} style={{ objectFit: 'contain' }} /> : <span style={{ fontFamily: 'Rajdhani', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>{team.tag?.slice(0, 3)}</span>}
                      </div>
                      <span style={{ fontFamily: 'Rajdhani', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)' }}>{team.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming + Results 2-col */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="grid-cols-1 md:grid-cols-2">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontFamily: 'Rajdhani', fontSize: '18px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)' }}>Ближайшие матчи</h2>
                <Link href={`/tournament/${slug}/matches`} style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--accent-yellow)', textDecoration: 'none' }}>Все матчи →</Link>
              </div>
              {upcoming.length === 0 ? (
                <p style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-muted)' }}>Нет предстоящих матчей</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(upcoming as MatchDoc[]).map(m => <MatchCard key={m._id} match={m} />)}
                </div>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontFamily: 'Rajdhani', fontSize: '18px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)' }}>Последние результаты</h2>
                <Link href={`/tournament/${slug}/results`} style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--accent-yellow)', textDecoration: 'none' }}>Все результаты →</Link>
              </div>
              {results.length === 0 ? (
                <p style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-muted)' }}>Результатов пока нет</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(results as MatchDoc[]).map(m => <MatchCard key={m._id} match={m} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
