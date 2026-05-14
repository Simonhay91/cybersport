import Link from 'next/link'

export default function PrizeSection() {
  const prizes = [
    { place: '1 место', amount: '100,000 ₽', icon: '🥇' },
    { place: '2 место', amount: '60,000 ₽', icon: '🥈' },
    { place: '3 место', amount: '40,000 ₽', icon: '🥉' },
  ]

  const benefits = [
    'Структурированный формат турнира',
    'Соревновательная среда высокого уровня',
    'Официальные трансляции и освещение',
    'Бесплатное участие при наличии призового фонда',
    'Возможность роста и медийности',
  ]

  return (
    <section
      style={{
        padding: '80px 0',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-default)',
        borderBottom: '1px solid var(--border-default)',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }} className="px-4 md:px-12">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="grid-cols-1 md:grid-cols-2">
          {/* Prize pool */}
          <div>
            <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--accent-yellow)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              Призовой фонд
            </p>
            <h2
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: 'clamp(56px, 8vw, 80px)',
                fontWeight: 700,
                color: 'var(--accent-yellow)',
                lineHeight: 1,
                marginBottom: '32px',
              }}
            >
              200,000 ₽
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {prizes.map((prize) => (
                <div
                  key={prize.place}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{prize.icon}</span>
                    <span style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {prize.place}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'Rajdhani', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {prize.amount}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/register"
              style={{
                display: 'inline-block',
                marginTop: '32px',
                fontFamily: 'Rajdhani',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#000',
                background: 'var(--accent-yellow)',
                padding: '14px 32px',
                textDecoration: 'none',
              }}
            >
              Зарегистрировать команду
            </Link>
          </div>

          {/* Why SPL */}
          <div>
            <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--accent-yellow)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              Почему SPL
            </p>
            <h2
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: 'clamp(28px, 4vw, 36px)',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                marginBottom: '32px',
              }}
            >
              Почему команды
              <br />
              участвуют в SPL
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(200,255,0,0.1)',
                      border: '1px solid var(--accent-yellow)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <span style={{ color: 'var(--accent-yellow)', fontSize: '12px', fontWeight: 700 }}>✓</span>
                  </div>
                  <p style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
