import connectDB from '@/lib/mongodb'
import Tournament from '@/models/Tournament'
import Team from '@/models/Team'
import Application from '@/models/Application'
import Match from '@/models/Match'
import Link from 'next/link'

async function getStats() {
  try {
    await connectDB()
    const [tournaments, teams, applications, matches, newApps] = await Promise.all([
      Tournament.countDocuments(),
      Team.countDocuments({ status: 'confirmed' }),
      Application.countDocuments(),
      Match.countDocuments(),
      Application.countDocuments({ status: 'new' }),
    ])
    return { tournaments, teams, applications, matches, newApps }
  } catch {
    return { tournaments: 0, teams: 0, applications: 0, matches: 0, newApps: 0 }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: 'Турниров', value: stats.tournaments, href: '/admin/tournaments', color: 'var(--accent-yellow)' },
    { label: 'Команд', value: stats.teams, href: '/admin/teams', color: 'var(--accent-green)' },
    { label: 'Заявок', value: stats.applications, href: '/admin/applications', color: 'var(--accent-blue)', badge: stats.newApps },
    { label: 'Матчей', value: stats.matches, href: '/admin/matches', color: 'var(--text-primary)' },
  ]

  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontFamily: 'Rajdhani', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '32px' }}>
        Dashboard
      </h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {cards.map((card) => (
          <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
            <div
              className="hover-accent-border"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)',
                padding: '24px',
                transition: 'border-color 0.2s',
                position: 'relative',
              }}
            >
              {card.badge !== undefined && card.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'var(--accent-red)',
                    color: '#fff',
                    fontFamily: 'Inter',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '10px',
                  }}
                >
                  {card.badge} new
                </span>
              )}
              <p style={{ fontFamily: 'Rajdhani', fontSize: '40px', fontWeight: 700, color: card.color, lineHeight: 1, marginBottom: '8px' }}>
                {card.value}
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {card.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 style={{ fontFamily: 'Rajdhani', fontSize: '20px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Быстрые действия
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {[
            { label: 'Новые заявки', href: '/admin/applications?status=new' },
            { label: 'Создать турнир', href: '/admin/tournaments/new' },
            { label: 'Добавить матч', href: '/admin/matches/new' },
            { label: 'Добавить группу', href: '/admin/groups/new' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'Inter',
                fontSize: '13px',
                color: 'var(--accent-yellow)',
                border: '1px solid var(--border-default)',
                padding: '8px 16px',
                textDecoration: 'none',
                transition: 'border-color 0.2s',
              }}
            >
              {link.label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
