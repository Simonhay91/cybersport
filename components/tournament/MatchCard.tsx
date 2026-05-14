import Link from 'next/link'
import Image from 'next/image'

interface MatchTeam {
  _id: string
  name: string
  slug: string
  logo?: string
  tag: string
}

interface MatchCardProps {
  match: {
    _id: string
    teamA?: MatchTeam
    teamB?: MatchTeam
    scoreA: number
    scoreB: number
    format: string
    status: string
    stage: string
    scheduledAt?: string
    winner?: { _id: string }
  }
}

const statusBadge: Record<string, { label: string; color: string; bg: string; border: string }> = {
  upcoming: { label: 'Upcoming', color: '#aaaaaa', bg: 'transparent', border: '#444444' },
  live: { label: 'Live', color: '#39d353', bg: 'rgba(57,211,83,0.1)', border: '#39d353' },
  finished: { label: 'Finished', color: '#555555', bg: 'var(--bg-tertiary)', border: 'transparent' },
}

function TeamSide({ team, score, isWinner, status }: { team?: MatchTeam; score: number; isWinner: boolean; status: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
      <div style={{ width: '40px', height: '40px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {team?.logo
          ? <Image src={team.logo} alt={team.name} width={40} height={40} style={{ objectFit: 'contain' }} />
          : <span style={{ fontFamily: 'Rajdhani', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>{team?.tag?.slice(0, 3) || 'TBD'}</span>
        }
      </div>
      <p style={{ fontFamily: 'Rajdhani', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: status === 'finished' && !isWinner ? 'var(--text-muted)' : 'var(--text-primary)', textAlign: 'center' }}>
        {team?.name || 'TBD'}
      </p>
    </div>
  )
}

export default function MatchCard({ match }: MatchCardProps) {
  const s = statusBadge[match.status] || statusBadge.upcoming
  const isFinished = match.status === 'finished'
  const winnerA = isFinished && match.winner?._id === match.teamA?._id
  const winnerB = isFinished && match.winner?._id === match.teamB?._id
  const date = match.scheduledAt ? new Date(match.scheduledAt) : null

  return (
    <Link href={`/match/${match._id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        className="match-card"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: '8px',
          padding: '16px',
          transition: 'border-color 0.2s, transform 0.2s',
          cursor: 'pointer',
        }}
      >
        {/* Teams & score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <TeamSide team={match.teamA} score={match.scoreA} isWinner={winnerA} status={match.status} />
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            {isFinished ? (
              <p style={{ fontFamily: 'Rajdhani', fontSize: '28px', fontWeight: 700, color: 'var(--accent-yellow)', lineHeight: 1 }}>
                {match.scoreA} : {match.scoreB}
              </p>
            ) : (
              <p style={{ fontFamily: 'Rajdhani', fontSize: '20px', fontWeight: 700, color: 'var(--text-muted)', lineHeight: 1 }}>VS</p>
            )}
          </div>
          <TeamSide team={match.teamB} score={match.scoreB} isWinner={winnerB} status={match.status} />
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-default)' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {date && (
              <span style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)' }}>
                {date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })} {date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <span style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '2px 6px' }}>
              {match.format}
            </span>
            <span style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {match.stage}
            </span>
          </div>
          <span style={{ padding: '2px 8px', fontSize: '10px', fontFamily: 'Inter', fontWeight: 600, textTransform: 'uppercase', color: s.color, border: `1px solid ${s.border}`, background: s.bg }}>
            {match.status === 'live' && <span className="live-dot" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#39d353', marginRight: '4px' }} />}
            {s.label}
          </span>
        </div>
      </div>
    </Link>
  )
}
