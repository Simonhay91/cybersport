import Link from 'next/link'

export default function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
      }}
    >
      {/* Trophy glow background */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '50%',
          height: '100%',
          background: 'radial-gradient(ellipse at right center, rgba(57,211,83,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '400px',
          height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(200,255,0,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      {/* Geometric trophy shape */}
      <svg
        style={{
          position: 'absolute',
          right: '4%',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0.15,
          filter: 'drop-shadow(0 0 60px rgba(200,255,0,0.4))',
        }}
        width="420"
        height="520"
        viewBox="0 0 420 520"
        className="hidden lg:block"
      >
        <polygon points="210,20 390,120 390,320 210,500 30,320 30,120" fill="none" stroke="#c8ff00" strokeWidth="1.5" />
        <polygon points="210,60 360,145 360,305 210,460 60,305 60,145" fill="none" stroke="#39d353" strokeWidth="0.5" />
        <polygon points="210,100 330,170 330,290 210,420 90,290 90,170" fill="rgba(200,255,0,0.03)" stroke="#c8ff00" strokeWidth="0.5" />
        <line x1="210" y1="20" x2="210" y2="500" stroke="#c8ff00" strokeWidth="0.3" />
        <line x1="30" y1="120" x2="390" y2="320" stroke="#c8ff00" strokeWidth="0.3" />
        <line x1="390" y1="120" x2="30" y2="320" stroke="#c8ff00" strokeWidth="0.3" />
      </svg>

      {/* Content */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 48px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
        className="px-4 md:px-12"
      >
        <div style={{ maxWidth: '680px' }}>
          {/* Label */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: 'var(--accent-yellow)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '16px',
            }}
          >
            Текущий турнир
          </p>

          {/* Title */}
          <h1
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 'clamp(48px, 8vw, 80px)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              lineHeight: 1,
              marginBottom: '8px',
            }}
          >
            Siberian
            <br />
            Pro League
          </h1>
          <p
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 'clamp(20px, 3vw, 28px)',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '32px',
            }}
          >
            CS2 Tournament Series · Winter Season 1
          </p>

          {/* Status badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(57,211,83,0.1)',
                border: '1px solid var(--accent-green)',
                color: 'var(--accent-green)',
                padding: '4px 12px',
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              <span
                className="live-dot"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent-green)',
                  display: 'inline-block',
                }}
              />
              Live
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'Inter' }}>
              Статус турнира
            </span>
          </div>

          {/* Meta info */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '32px',
              marginBottom: '40px',
            }}
          >
            {[
              { label: 'Даты проведения', value: '22 Фев — 31 Мар' },
              { label: 'Призовой фонд', value: '200,000 ₽' },
              { label: 'Команд', value: '64 / 128' },
            ].map((item) => (
              <div key={item.label}>
                <p
                  style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {item.value}
                </p>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link
              href="/register"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#000',
                background: 'var(--accent-yellow)',
                padding: '14px 32px',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'background 0.2s',
              }}
            >
              Зарегистрировать команду
            </Link>
            <Link
              href="/tournament/spl-winter-season-1"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-primary)',
                background: 'transparent',
                border: '1px solid var(--border-accent)',
                padding: '14px 32px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Подробнее о турнире
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
