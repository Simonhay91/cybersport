'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AdminLogout from './AdminLogout'

const navItems = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/applications', label: 'Заявки' },
  { href: '/admin/teams', label: 'Команды' },
  { href: '/admin/tournaments', label: 'Турниры' },
  { href: '/admin/matches', label: 'Матчи' },
  { href: '/admin/groups', label: 'Группы' },
  { href: '/admin/partners', label: 'Партнёры' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: '220px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        minHeight: '100vh',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-default)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <p style={{ fontFamily: 'Rajdhani', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>SPL</p>
          <p style={{ fontFamily: 'Inter', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Админ-панель</p>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ padding: '8px 0', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'block',
                padding: '10px 20px',
                fontFamily: 'Inter',
                fontSize: '14px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                textDecoration: 'none',
                background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                borderLeft: `3px solid ${isActive ? 'var(--accent-yellow)' : 'transparent'}`,
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-default)' }}>
        <AdminLogout />
      </div>
    </aside>
  )
}
