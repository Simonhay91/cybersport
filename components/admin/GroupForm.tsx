'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface GroupFormProps {
  tournaments: { _id: string; name: string }[]
  teams: { _id: string; name: string; tag: string }[]
  initial?: Record<string, unknown>
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border-default)',
  color: 'var(--text-primary)',
  fontFamily: 'Inter',
  fontSize: '14px',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'Inter',
  fontSize: '11px',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '6px',
}

export default function GroupForm({ tournaments, teams, initial }: GroupFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const initialTeams = (initial?.teams as string[]) || []
  const [form, setForm] = useState({
    name: (initial?.name as string) || '',
    tournament: (initial?.tournament as string) || '',
    status: (initial?.status as string) || 'upcoming',
    format: (initial?.format as string) || 'gsl-4',
    selectedTeams: initialTeams,
  })

  function toggleTeam(id: string) {
    setForm(prev => ({
      ...prev,
      selectedTeams: prev.selectedTeams.includes(id)
        ? prev.selectedTeams.filter(t => t !== id)
        : [...prev.selectedTeams, id],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const id = initial?._id as string | undefined
      const url = id ? `/api/groups/${id}` : '/api/groups'
      const method = id ? 'PUT' : 'POST'
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, tournament: form.tournament, status: form.status, format: form.format, teams: form.selectedTeams }),
      })
      router.push('/admin/groups')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Название *</label>
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required style={inputStyle} placeholder="Группа А" />
        </div>
        <div>
          <label style={labelStyle}>Статус</label>
          <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={inputStyle}>
            <option value="upcoming">Скоро</option>
            <option value="live">Играется</option>
            <option value="finished">Завершена</option>
          </select>
        </div>
      </div>

      {/* Format selector */}
      <div>
        <label style={{ ...labelStyle, marginBottom: '12px' }}>Формат группы</label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { value: 'gsl-4', label: 'GSL', desc: '4 команды — Опенеры → Победители / Вылет → Решающий' },
            { value: 'de-8', label: 'Double Elim', desc: '8 команд — Winners + Losers Bracket + Grand Final' },
            { value: 'round-robin', label: 'Round Robin', desc: 'Любое кол-во — каждый против каждого' },
          ].map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => setForm(p => ({ ...p, format: f.value }))}
              style={{
                padding: '12px 16px',
                background: form.format === f.value ? 'rgba(200,255,0,0.1)' : 'var(--bg-primary)',
                border: `1px solid ${form.format === f.value ? 'var(--accent-yellow)' : 'var(--border-default)'}`,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                minWidth: '200px',
                flex: 1,
              }}
            >
              <div style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700, color: form.format === f.value ? 'var(--accent-yellow)' : 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                {f.label}
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {f.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Турнир *</label>
        <select value={form.tournament} onChange={e => setForm(p => ({ ...p, tournament: e.target.value }))} required style={inputStyle}>
          <option value="">Выбрать...</option>
          {tournaments.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>
      </div>

      <div>
        <label style={{ ...labelStyle, marginBottom: '12px' }}>Команды — выбрано: {form.selectedTeams.length}</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
          {teams.map(t => {
            const selected = form.selectedTeams.includes(t._id)
            return (
              <button
                key={t._id}
                type="button"
                onClick={() => toggleTeam(t._id)}
                style={{
                  padding: '10px 14px',
                  background: selected ? 'rgba(200,255,0,0.1)' : 'var(--bg-primary)',
                  border: `1px solid ${selected ? 'var(--accent-yellow)' : 'var(--border-default)'}`,
                  color: selected ? 'var(--accent-yellow)' : 'var(--text-secondary)',
                  fontFamily: 'Inter',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                {t.name} <span style={{ color: 'var(--text-muted)' }}>[{t.tag}]</span>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" disabled={saving} style={{ padding: '12px 32px', background: 'var(--accent-yellow)', color: '#000', fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', border: 'none', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Сохранение...' : initial?._id ? 'Сохранить' : 'Создать'}
        </button>
        <button type="button" onClick={() => router.back()} style={{ padding: '12px 24px', background: 'transparent', color: 'var(--text-muted)', fontFamily: 'Inter', fontSize: '13px', border: '1px solid var(--border-default)', cursor: 'pointer' }}>
          Отмена
        </button>
      </div>
    </form>
  )
}
