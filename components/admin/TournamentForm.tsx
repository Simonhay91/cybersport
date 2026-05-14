'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TournamentFormProps {
  initial?: {
    _id?: string
    name?: string
    slug?: string
    status?: string
    description?: string
    startDate?: string
    endDate?: string
    prizePool?: number
    format?: string
    registrationOpen?: boolean
    maxTeams?: number
  }
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

export default function TournamentForm({ initial }: TournamentFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: initial?.name || '',
    slug: initial?.slug || '',
    status: initial?.status || 'upcoming',
    description: initial?.description || '',
    startDate: initial?.startDate ? initial.startDate.slice(0, 10) : '',
    endDate: initial?.endDate ? initial.endDate.slice(0, 10) : '',
    prizePool: initial?.prizePool || 200000,
    format: initial?.format || 'BO1 / BO3',
    registrationOpen: initial?.registrationOpen ?? true,
    maxTeams: initial?.maxTeams || 128,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const url = initial?._id ? `/api/tournaments/${initial._id}` : '/api/tournaments'
      const method = initial?._id ? 'PUT' : 'POST'
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      router.push('/admin/tournaments')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>Название *</label>
          <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Slug (URL) *</label>
          <input name="slug" value={form.slug} onChange={handleChange} required style={inputStyle} placeholder="spl-winter-season-1" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>Статус</label>
          <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="finished">Finished</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Формат</label>
          <input name="format" value={form.format} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Описание</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>Дата начала</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Дата окончания</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Призовой фонд (₽)</label>
          <input type="number" name="prizePool" value={form.prizePool} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>Макс. команд</label>
          <input type="number" name="maxTeams" value={form.maxTeams} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
          <input type="checkbox" name="registrationOpen" checked={form.registrationOpen} onChange={handleChange} id="regOpen" />
          <label htmlFor="regOpen" style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            Регистрация открыта
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button
          type="submit"
          disabled={saving}
          style={{ padding: '12px 32px', background: 'var(--accent-yellow)', color: '#000', fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', border: 'none', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'Сохранение...' : initial?._id ? 'Сохранить' : 'Создать'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ padding: '12px 24px', background: 'transparent', color: 'var(--text-muted)', fontFamily: 'Inter', fontSize: '13px', border: '1px solid var(--border-default)', cursor: 'pointer' }}
        >
          Отмена
        </button>
      </div>
    </form>
  )
}
