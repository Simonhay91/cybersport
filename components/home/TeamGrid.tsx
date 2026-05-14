import Link from 'next/link'
import Image from 'next/image'

interface Team {
  _id: string
  name: string
  slug: string
  logo?: string
  tag: string
  status: string
  wins: number
  losses: number
}

interface TeamGridProps {
  teams: Team[]
}

export default function TeamGrid({ teams }: TeamGridProps) {
  return (
    <section style={{ padding: '80px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-default)' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }} className="px-4 md:px-12">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--accent-yellow)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
              Участники лиги
            </p>
            <h2 style={{ fontFamily: 'Rajdhani', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              Команды SPL
            </h2>
          </div>
          <Link
            href="/teams"
            style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 600, color: 'var(--accent-yellow)', textDecoration: 'none', textTransform: 'uppercase' }}
          >
            Посмотреть все команды →
          </Link>
        </div>

        {teams.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p style={{ fontFamily: 'Inter', fontSize: '16px', color: 'var(--text-muted)' }}>
              Список команд обновляется после подтверждения заявок.
            </p>
            <p style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Ожидается: 64–128 команд.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '16px',
            }}
          >
            {teams.map((team) => (
              <Link
                key={team._id}
                href={`/teams/${team.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="team-card"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '8px',
                    padding: '20px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'border-color 0.2s, transform 0.2s',
                    cursor: 'pointer',
                  }}
                >
                  {/* Logo */}
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {team.logo ? (
                      <Image src={team.logo} alt={team.name} width={64} height={64} style={{ objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontFamily: 'Rajdhani', fontSize: '20px', fontWeight: 700, color: 'var(--text-muted)' }}>
                        {team.tag?.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <p style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)', textAlign: 'center' }}>
                    {team.name}
                  </p>

                  {/* Status */}
                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'Inter',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '2px 8px',
                      background: team.status === 'confirmed' ? 'rgba(200,255,0,0.1)' : 'rgba(255,153,0,0.1)',
                      color: team.status === 'confirmed' ? 'var(--accent-yellow)' : '#ff9900',
                      border: `1px solid ${team.status === 'confirmed' ? 'rgba(200,255,0,0.3)' : 'rgba(255,153,0,0.3)'}`,
                    }}
                  >
                    {team.status === 'confirmed' ? 'Подтверждена' : 'На проверке'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
