import connectDB from '@/lib/mongodb'
import Match from '@/models/Match'
import '@/models/Team'
import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/home/Footer'
import { notFound } from 'next/navigation'

async function getMatch(id: string) {
  await connectDB()
  const match = await Match.findById(id)
    .populate('teamA', 'name slug logo tag city')
    .populate('teamB', 'name slug logo tag city')
    .populate('winner', '_id name slug')
    .populate('loser', '_id')
    .populate('tournament', 'name slug')
    .populate('group', 'name')
    .lean()
  if (!match) return null
  return JSON.parse(JSON.stringify(match))
}

interface MatchTeam { _id: string; name: string; slug: string; logo?: string; tag: string }

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const match = await getMatch(id)
  if (!match) notFound()

  const teamA = match.teamA as MatchTeam | undefined
  const teamB = match.teamB as MatchTeam | undefined
  const isFinished = match.status === 'finished'
  const winnerId = match.winner?._id
  const winnerA = winnerId && teamA && winnerId === teamA._id
  const winnerB = winnerId && teamB && winnerId === teamB._id

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', padding: '60px 0 40px', background: 'var(--bg-primary)', overflow: 'hidden' }}>
        {/* Center glow */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '300px', background: 'radial-gradient(ellipse, rgba(200,255,0,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }} className="px-4 md:px-12">
          {/* Breadcrumb */}
          <p style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '32px' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Главная</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            {match.tournament && <><Link href={`/tournament/${match.tournament.slug}/matches`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{match.tournament.name}</Link><span style={{ margin: '0 8px' }}>›</span></>}
            <span style={{ color: 'var(--text-primary)' }}>Матч</span>
          </p>

          {/* Match hero */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
            {/* Team A */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1, minWidth: '160px' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {teamA?.logo ? <Image src={teamA.logo} alt={teamA.name} width={80} height={80} style={{ objectFit: 'contain' }} /> : <span style={{ fontFamily: 'Rajdhani', fontSize: '20px', fontWeight: 700, color: 'var(--text-muted)' }}>{teamA?.tag?.slice(0, 3) || 'TBD'}</span>}
              </div>
              {teamA ? (
                <Link href={`/teams/${teamA.slug}`} style={{ textDecoration: 'none' }}>
                  <p style={{ fontFamily: 'Rajdhani', fontSize: '28px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', textAlign: 'center' }}>{teamA.name}</p>
                </Link>
              ) : (
                <p style={{ fontFamily: 'Rajdhani', fontSize: '28px', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>TBD</p>
              )}
              {isFinished && winnerA && (
                <span style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700, color: 'var(--accent-yellow)' }}>ПОБЕДА</span>
              )}
            </div>

            {/* Score */}
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <p style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                {match.format}
              </p>
              {isFinished ? (
                <p style={{ fontFamily: 'Rajdhani', fontSize: '72px', fontWeight: 700, color: 'var(--accent-yellow)', lineHeight: 1 }}>
                  {match.scoreA} : {match.scoreB}
                </p>
              ) : (
                <p style={{ fontFamily: 'Rajdhani', fontSize: '48px', fontWeight: 700, color: 'var(--text-muted)', lineHeight: 1 }}>
                  VS
                </p>
              )}
              <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                {isFinished ? 'Завершён' : match.status === 'live' ? '🔴 В эфире' : 'Upcoming'}
                {match.scheduledAt && ` · ${new Date(match.scheduledAt).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}`}
              </p>
            </div>

            {/* Team B */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1, minWidth: '160px' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {teamB?.logo ? <Image src={teamB.logo} alt={teamB.name} width={80} height={80} style={{ objectFit: 'contain' }} /> : <span style={{ fontFamily: 'Rajdhani', fontSize: '20px', fontWeight: 700, color: 'var(--text-muted)' }}>{teamB?.tag?.slice(0, 3) || 'TBD'}</span>}
              </div>
              {teamB ? (
                <Link href={`/teams/${teamB.slug}`} style={{ textDecoration: 'none' }}>
                  <p style={{ fontFamily: 'Rajdhani', fontSize: '28px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', textAlign: 'center' }}>{teamB.name}</p>
                </Link>
              ) : (
                <p style={{ fontFamily: 'Rajdhani', fontSize: '28px', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>TBD</p>
              )}
              {isFinished && winnerB && (
                <span style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700, color: 'var(--accent-yellow)' }}>ПОБЕДА</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Match info */}
      <section style={{ padding: '40px 0 80px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }} className="px-4 md:px-12">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="grid-cols-1 md:grid-cols-2">
            {/* Maps */}
            {match.maps && match.maps.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'Rajdhani', fontSize: '20px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '16px' }}>Карты</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {match.maps.map((map: { name: string; scoreA: number; scoreB: number }, i: number) => (
                    <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'Rajdhani', fontSize: '20px', fontWeight: 700, color: map.scoreA > map.scoreB ? 'var(--accent-yellow)' : 'var(--text-muted)' }}>{map.scoreA}</span>
                      <span style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{map.name}</span>
                      <span style={{ fontFamily: 'Rajdhani', fontSize: '20px', fontWeight: 700, color: map.scoreB > map.scoreA ? 'var(--accent-yellow)' : 'var(--text-muted)' }}>{map.scoreB}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info */}
            <div>
              <h2 style={{ fontFamily: 'Rajdhani', fontSize: '20px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '16px' }}>Информация о матче</h2>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', padding: '20px' }}>
                {[
                  { label: 'Дата', value: match.scheduledAt ? new Date(match.scheduledAt).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—' },
                  { label: 'Турнир', value: match.tournament?.name || '—' },
                  { label: 'Стадия', value: match.stage || '—' },
                  { label: 'Формат', value: match.format },
                  { label: 'Статус', value: match.status === 'finished' ? 'Завершён' : match.status === 'live' ? 'В эфире' : 'Предстоящий' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-default)' }}>
                    <span style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{row.label}</span>
                    <span style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-primary)', textAlign: 'right' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {match.adminNote && (
                <div style={{ marginTop: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', padding: '16px' }}>
                  <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-secondary)' }}>{match.adminNote}</p>
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
