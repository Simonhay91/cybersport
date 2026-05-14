'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/tournament/spl-winter-season-1', label: 'Турнир' },
  { href: '/teams', label: 'Команды' },
  { href: '/tournament/spl-winter-season-1/matches', label: 'Матчи' },
  { href: '/tournament/spl-winter-season-1/bracket', label: 'Сетка' },
  { href: '/tournament/spl-winter-season-1/results', label: 'Результаты' },
  { href: '/#partners', label: 'Партнёрам' },
  { href: '/#about', label: 'О лиге' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav
      style={{
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-default)',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 48px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        className="px-4 md:px-12"
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700,
              fontSize: '20px',
              color: 'var(--text-primary)',
              letterSpacing: '0.05em',
            }}
          >
            SPL
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            SIBERIAN PRO LEAGUE
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex" style={{ gap: '32px', alignItems: 'center' }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--accent-yellow)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  borderBottom: isActive ? '2px solid var(--accent-yellow)' : '2px solid transparent',
                  paddingBottom: '2px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link
            href="/register"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--accent-yellow)',
              border: '1px solid var(--accent-yellow)',
              background: 'transparent',
              padding: '8px 16px',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'var(--accent-yellow)'
              el.style.color = '#000'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'transparent'
              el.style.color = 'var(--accent-yellow)'
            }}
          >
            Зарегистрировать команду
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--bg-primary)',
            zIndex: 49,
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 24px',
            gap: '24px',
          }}
          className="md:hidden"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontSize: '20px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--accent-yellow)' : 'var(--text-primary)',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/register"
            onClick={() => setMobileOpen(false)}
            style={{
              marginTop: '16px',
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: '#000',
              background: 'var(--accent-yellow)',
              padding: '12px 24px',
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            Зарегистрировать команду
          </Link>
        </div>
      )}
    </nav>
  )
}
