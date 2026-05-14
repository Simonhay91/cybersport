export default function FormatSection() {
  const stages = [
    {
      name: 'Open Qualifier',
      sub: 'Открытая квалификация',
      desc: 'До 128 команд · BO1 · Групповой этап',
    },
    {
      name: 'Closed Qualifier',
      sub: 'Закрытая квалификация',
      desc: '32 лучших команды · BO1/BO3 · GSL группы',
    },
    {
      name: 'Main Stage',
      sub: 'Основная стадия',
      desc: '8 команд · BO3 · Playoffs',
    },
  ]

  return (
    <section
      id="format"
      style={{
        padding: '80px 0',
        background: 'var(--bg-primary)',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }} className="px-4 md:px-12">
        {/* Header */}
        <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--accent-yellow)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
          Структура турнира
        </p>
        <h2
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
            marginBottom: '48px',
          }}
        >
          Формат турнира
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', maxWidth: '600px' }}>
          {stages.map((stage, i) => (
            <div key={stage.name} style={{ display: 'flex', gap: '0' }}>
              {/* Connector line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '24px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--bg-secondary)',
                    border: '2px solid var(--accent-yellow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, color: 'var(--accent-yellow)', fontSize: '16px' }}>
                    {i + 1}
                  </span>
                </div>
                {i < stages.length - 1 && (
                  <div style={{ width: '2px', flex: 1, background: 'var(--border-default)', minHeight: '40px' }} />
                )}
              </div>

              {/* Content */}
              <div style={{ paddingBottom: i < stages.length - 1 ? '32px' : '0' }}>
                <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--accent-yellow)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                  {stage.sub}
                </p>
                <h3 style={{ fontFamily: 'Rajdhani', fontSize: '22px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {stage.name}
                </h3>
                <p style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {stage.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Format info */}
        <div
          style={{
            marginTop: '48px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          {[
            { label: 'Формат матчей', value: 'BO1 / BO3' },
            { label: 'Система', value: 'GSL группы + Playoffs' },
            { label: 'Платформа', value: 'Online' },
            { label: 'Организатор', value: 'SPL' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)',
                padding: '16px 24px',
              }}
            >
              <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                {item.label}
              </p>
              <p style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 600, color: 'var(--accent-yellow)', textTransform: 'uppercase' }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
