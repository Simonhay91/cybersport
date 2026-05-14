import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-default)',
        padding: '48px 0 32px',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }} className="px-4 md:px-12">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px', marginBottom: '48px' }}>
          {/* Logo */}
          <div>
            <p style={{ fontFamily: 'Rajdhani', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>SPL</p>
            <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Siberian Pro League
            </p>

            {/* Socials */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
              {[
                { label: 'TG', href: '#' },
                { label: 'VK', href: '#' },
                { label: 'TW', href: '#' },
                { label: 'YT', href: '#' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="footer-social"
                  style={{
                    width: '36px',
                    height: '36px',
                    border: '1px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    color: 'var(--text-muted)',
                    fontFamily: 'Inter',
                    fontSize: '11px',
                    fontWeight: 600,
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '16px' }}>
                Навигация
              </p>
              {[
                { label: 'Турнир', href: '/tournament/spl-winter-season-1' },
                { label: 'Команды', href: '/teams' },
                { label: 'Матчи', href: '/tournament/spl-winter-season-1/matches' },
                { label: 'Сетка', href: '/tournament/spl-winter-season-1/bracket' },
                { label: 'Регистрация', href: '/register' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ display: 'block', fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '8px' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div>
              <p style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '16px' }}>
                Документы
              </p>
              {[
                { label: 'Публичная оферта', href: '/docs/offer' },
                { label: 'Регламент', href: '/docs/rules' },
                { label: 'Политика конфиденциальности', href: '/docs/privacy' },
                { label: 'Пользовательское соглашение', href: '/docs/terms' },
                { label: 'Контакты', href: '#contacts' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ display: 'block', fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '8px' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-default)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <p style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)' }}>
            © 2024 Siberian Pro League. Все права защищены.
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)' }}>
            admin@spl.gg
          </p>
        </div>
      </div>
    </footer>
  )
}
