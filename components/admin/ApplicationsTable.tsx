'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Application {
  _id: string
  teamName: string
  tag: string
  city?: string
  captain: { nickname: string; telegram?: string; email?: string }
  players: { nickname: string }[]
  status: string
  submittedAt: string
  adminNote?: string
}

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'Новая', color: '#00c2ff', bg: 'rgba(0,194,255,0.1)' },
  reviewing: { label: 'На проверке', color: '#ff9900', bg: 'rgba(255,153,0,0.1)' },
  confirmed: { label: 'Подтверждена', color: '#c8ff00', bg: 'rgba(200,255,0,0.1)' },
  rejected: { label: 'Отклонена', color: '#e63946', bg: 'rgba(230,57,70,0.1)' },
  cancelled: { label: 'Аннулирована', color: '#666', bg: 'rgba(100,100,100,0.1)' },
}

function ApplicationRow({ app }: { app: Application }) {
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState(app.status)
  const [note, setNote] = useState(app.adminNote || '')
  const [saving, setSaving] = useState(false)

  const s = statusLabels[status] || statusLabels.new

  async function updateStatus(newStatus: string) {
    setSaving(true)
    try {
      const res = await fetch(`/api/applications/${app._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNote: note }),
      })
      if (res.ok) setStatus(newStatus)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
        <td style={{ padding: '14px 16px' }}>
          <div>
            <p style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{app.teamName}</p>
            <p style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)' }}>[{app.tag}] {app.city}</p>
          </div>
        </td>
        <td style={{ padding: '14px 16px', fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-secondary)' }}>
          {app.captain.nickname}
          {app.captain.telegram && <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>{app.captain.telegram}</span>}
        </td>
        <td style={{ padding: '14px 16px', fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)' }}>
          {app.players.length} игр.
        </td>
        <td style={{ padding: '14px 16px' }}>
          <span style={{ padding: '3px 10px', fontSize: '11px', fontFamily: 'Inter', fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.color}30` }}>
            {s.label}
          </span>
        </td>
        <td style={{ padding: '14px 16px', fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)' }}>
          {new Date(app.submittedAt).toLocaleDateString('ru-RU')}
        </td>
        <td style={{ padding: '14px 16px' }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </td>
      </tr>

      {expanded && (
        <tr style={{ background: 'var(--bg-tertiary)' }}>
          <td colSpan={6} style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              {/* Players */}
              <div>
                <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Игроки</p>
                {app.players.map((p, i) => (
                  <p key={i} style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {i + 1}. {p.nickname}
                  </p>
                ))}
              </div>

              {/* Status change */}
              <div style={{ flex: 1, minWidth: '280px' }}>
                <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Изменить статус</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {['reviewing', 'confirmed', 'rejected', 'cancelled'].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(s)}
                      disabled={saving || status === s}
                      style={{
                        padding: '6px 14px',
                        fontFamily: 'Inter',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: s === 'confirmed' ? 'var(--accent-yellow)' : s === 'rejected' ? 'var(--accent-red)' : 'var(--border-default)',
                        background: status === s ? (s === 'confirmed' ? 'var(--accent-yellow)' : 'var(--bg-secondary)') : 'transparent',
                        color: status === s && s === 'confirmed' ? '#000' : s === 'confirmed' ? 'var(--accent-yellow)' : s === 'rejected' ? 'var(--accent-red)' : 'var(--text-muted)',
                        cursor: saving || status === s ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.6 : 1,
                      }}
                    >
                      {statusLabels[s]?.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Заметка администратора..."
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    fontFamily: 'Inter',
                    fontSize: '13px',
                    resize: 'vertical',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function ApplicationsTable({ applications }: { applications: Application[] }) {
  if (applications.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontFamily: 'Inter', fontSize: '14px' }}>
        Заявок нет
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
            {['Команда', 'Капитан', 'Игроки', 'Статус', 'Дата', ''].map((h) => (
              <th key={h} style={{ padding: '12px 16px', fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left', fontWeight: 500 }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <ApplicationRow key={app._id} app={app} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
