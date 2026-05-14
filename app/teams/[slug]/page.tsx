import connectDB from '@/lib/mongodb'
import Team from '@/models/Team'
import Match from '@/models/Match'
import '@/models/Player'
import '@/models/Tournament'
import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/home/Footer'
import { notFound } from 'next/navigation'

async function getTeam(slug: string) {
  await connectDB()
  const team = await Team.findOne({ slug })
    .populate('captain')
    .populate('players')
    .lean()
  if (!team) return null
  return JSON.parse(JSON.stringify(team))
}

async function getMatches(teamId: string) {
  await connectDB()
  const matches = await Match.find({
    $or: [{ teamA: teamId }, { teamB: teamId }],
    status: 'finished',
  })
    .populate('teamA', 'name slug logo tag')
    .populate('teamB', 'name slug logo tag')
    .populate('tournament', 'name slug')
    .populate('winner', '_id')
    .sort({ scheduledAt: -1 })
    .limit(10)
    .lean()
  return JSON.parse(JSON.stringify(matches))
}

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  confirmed: { label: 'Подтверждена', color: '#c8ff00', bg: 'rgba(200,255,0,0.1)' },
  pending: { label: 'На проверке', color: '#ff9900', bg: 'rgba(255,153,0,0.1)' },
}

export default async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const team = await getTeam(slug)
  if (!team) notFound()

  const matches = await getMatches(team._id)
  const played = team.wins + team.losses
  const winRate = played > 0 ? Math.round((team.wins / played) * 100) : 0
  const s = statusMap[team.status] || statusMap.pending

  interface PlayerDoc {
    _id: string
    nickname: string
    fullName?: string
    role?: string
    steam?: string
    faceit?: string
    status: string
  }
  interface MatchTeam { _id: string; name: string; slug: string; logo?: string; tag: string }
  interface MatchDoc {
    _id: string
    teamA?: MatchTeam
    teamB?: MatchTeam
    scoreA: number
    scoreB: number
    format: string
    stage: string
    tournament?: { name: string; slug: string }
    winner?: { _id: string }
    scheduledAt?: string
  }

  const mainPlayers = (team.players as PlayerDoc[]).filter((p) => p.status === 'main')
  const reserve = (team.players as PlayerDoc[]).find((p) => p.status === 'reserve')

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', padding: '60px 0 40px', background: 'var(--bg-primary)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 0, top: 0, width: '45%', height: '100%', background: 'radial-gradient(ellipse at right center, rgba(57,211,83,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <svg style={{ position: 'absolute', right: '4%', top: '50%', transform: 'translateY(-50%)', opacity: 0.1, filter: 'drop-shadow(0 0 40px rgba(200,255,0,0.3))' }} width="280" height="340" viewBox="0 0 420 520" className="hidden lg:block">
          <polygon points="210,20 390,120 390,320 210,500 30,320 30,120" fill="none" stroke="#c8ff00" strokeWidth="1.5" />
        </svg>

        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }} className="px-4 md:px-12">
          {/* Breadcrumb */}
          <p style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Главная</Link>
            <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>›</span>
            <Link href="/teams" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Команды</Link>
            <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>›</span>
            <span style={{ color: 'var(--text-primary)' }}>{team.name.toUpperCase()}</span>
          </p>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px', flexWrap: 'wrap' }}>
            {/* Logo */}
            <div style={{ width: '140px', height: '140px', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {team.logo
                ? <Image src={team.logo} alt={team.name} width={140} height={140} style={{ objectFit: 'contain' }} />
                : <span style={{ fontFamily: 'Rajdhani', fontSize: '36px', fontWeight: 700, color: 'var(--text-muted)' }}>{team.tag?.slice(0, 3).toUpperCase()}</span>
              }
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: 'Rajdhani', fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', lineHeight: 1 }}>
                  {team.name}
                </h1>
                <span style={{ padding: '4px 12px', fontSize: '12px', fontFamily: 'Inter', fontWeight: 600, textTransform: 'uppercase', color: s.color, border: `1px solid ${s.color}40`, background: s.bg }}>
                  {s.label}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {team.city && <span style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-secondary)' }}>📍 {team.city}</span>}
                <span style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-secondary)' }}>🏷 {team.tag}</span>
                {(team.captain as PlayerDoc) && <span style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-secondary)' }}>👤 Капитан: {(team.captain as PlayerDoc).nickname}</span>}
              </div>

              {/* Socials */}
              {team.socialLinks && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  {team.socialLinks.telegram && <a href={team.socialLinks.telegram} target="_blank" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', fontFamily: 'Inter' }}>TG</a>}
                  {team.socialLinks.vk && <a href={team.socialLinks.vk} target="_blank" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', fontFamily: 'Inter' }}>VK</a>}
                  {team.socialLinks.twitch && <a href={team.socialLinks.twitch} target="_blank" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', fontFamily: 'Inter' }}>Twitch</a>}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 48px' }} className="px-4 md:px-12">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
            {[
              { label: 'Матчей', value: played, color: 'var(--text-primary)' },
              { label: 'Побед', value: team.wins, color: 'var(--accent-green)' },
              { label: 'Поражений', value: team.losses, color: 'var(--accent-red)' },
              { label: 'Winrate', value: `${winRate}%`, color: 'var(--accent-yellow)' },
            ].map(item => (
              <div key={item.label}>
                <p style={{ fontFamily: 'Rajdhani', fontSize: '36px', fontWeight: 700, color: item.color, lineHeight: 1 }}>{item.value}</p>
                <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px 48px 80px' }} className="px-4 md:px-12">
        {/* О команде */}
        {team.description && (
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'Rajdhani', fontSize: '20px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '12px' }}>О команде</h2>
            <p style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '700px' }}>{team.description}</p>
          </section>
        )}

        {/* Состав */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'Rajdhani', fontSize: '20px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '20px' }}>Состав команды</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
            {mainPlayers.map((player) => (
              <div
                key={player._id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-default)',
                  padding: '16px',
                  position: 'relative',
                }}
              >
                {team.captain && (team.captain as PlayerDoc)._id === player._id && (
                  <span style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--accent-yellow)', color: '#000', fontFamily: 'Inter', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', padding: '2px 6px' }}>
                    Капитан
                  </span>
                )}
                <div style={{ width: '100%', aspectRatio: '3/4', background: 'var(--bg-tertiary)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Rajdhani', fontSize: '32px', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {player.nickname.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <p style={{ fontFamily: 'Rajdhani', fontSize: '15px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {player.nickname}
                </p>
                {player.role && <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>{player.role}</p>}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {player.steam && <a href={player.steam} target="_blank" style={{ fontFamily: 'Inter', fontSize: '10px', color: 'var(--text-muted)', border: '1px solid var(--border-default)', padding: '3px 6px', textDecoration: 'none' }}>Steam</a>}
                  {player.faceit && <a href={player.faceit} target="_blank" style={{ fontFamily: 'Inter', fontSize: '10px', color: 'var(--text-muted)', border: '1px solid var(--border-default)', padding: '3px 6px', textDecoration: 'none' }}>FACEIT</a>}
                </div>
              </div>
            ))}
          </div>

          {/* Reserve */}
          {reserve && (
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Запасной</p>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '280px' }}>
                <div style={{ width: '48px', height: '48px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 700, color: 'var(--text-muted)' }}>{reserve.nickname.slice(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <p style={{ fontFamily: 'Rajdhani', fontSize: '15px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)' }}>{reserve.nickname}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)' }}>Запасной</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Последние матчи */}
        {matches.length > 0 && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'Rajdhani', fontSize: '20px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)' }}>Последние матчи</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
              {(matches as MatchDoc[]).map((match) => {
                const isTeamA = match.teamA?._id === team._id
                const opponent = isTeamA ? match.teamB : match.teamA
                const myScore = isTeamA ? match.scoreA : match.scoreB
                const oppScore = isTeamA ? match.scoreB : match.scoreA
                const isWin = match.winner?._id === team._id
                const date = match.scheduledAt ? new Date(match.scheduledAt) : null

                return (
                  <div
                    key={match._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                      padding: '16px 20px',
                      borderBottom: '1px solid var(--border-default)',
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Date */}
                    {date && (
                      <div style={{ textAlign: 'center', minWidth: '40px' }}>
                        <p style={{ fontFamily: 'Rajdhani', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{date.getDate()}</p>
                        <p style={{ fontFamily: 'Inter', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          {date.toLocaleDateString('ru-RU', { month: 'short' })}
                        </p>
                      </div>
                    )}

                    {/* Tournament + stage */}
                    <div style={{ minWidth: '120px' }}>
                      <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{match.tournament?.name || '—'}</p>
                      <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)' }}>{match.stage}</p>
                    </div>

                    {/* Matchup */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      {opponent?.logo
                        ? <Image src={opponent.logo} alt={opponent.name} width={24} height={24} style={{ objectFit: 'contain' }} />
                        : <div style={{ width: '24px', height: '24px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>{opponent?.tag?.slice(0, 2)}</span></div>
                      }
                      <span style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{opponent?.name || 'TBD'}</span>
                      <span style={{ fontFamily: 'Rajdhani', fontSize: '20px', fontWeight: 700, color: 'var(--accent-yellow)' }}>{myScore} : {oppScore}</span>
                    </div>

                    {/* Format */}
                    <span style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '3px 8px' }}>{match.format}</span>

                    {/* Result */}
                    <span style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700, color: isWin ? 'var(--accent-yellow)' : 'var(--accent-red)' }}>
                      {isWin ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ'}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </>
  )
}
