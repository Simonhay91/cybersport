'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TeamEditFormProps {
  initial: Record<string, unknown>
  tournaments: { _id: string; name: string }[]
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

export default function TeamEditForm({ initial, tournaments }: TeamEditFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: (initial.name as string) || '',
    slug: (initial.slug as string) || '',
    tag: (initial.tag as string) || '',
    city: (initial.city as string) || '',
    description: (initial.description as string) || '',
    status: (initial.status as string) || 'pending',
    logo: (initial.logo as string) || '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch(`/api/teams/${initial._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      router.push('/admin/teams')
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
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Тег *</label>
          <input value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))} required style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Slug</label>
          <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Город</label>
          <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} style={inputStyle} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Статус</label>
        <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={inputStyle}>
          <option value="pending">На проверке</option>
          <option value="confirmed">Подтверждена</option>
          <option value="rejected">Отклонена</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>URL логотипа</label>
        <input value={form.logo} onChange={e => setForm(p => ({ ...p, logo: e.target.value }))} style={inputStyle} placeholder="https://..." />
      </div>
      <div>
        <label style={labelStyle}>Описание</label>
        <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" disabled={saving} style={{ padding: '12px 32px', background: 'var(--accent-yellow)', color: '#000', fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', border: 'none', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button type="button" onClick={() => router.back()} style={{ padding: '12px 24px', background: 'transparent', color: 'var(--text-muted)', fontFamily: 'Inter', fontSize: '13px', border: '1px solid var(--border-default)', cursor: 'pointer' }}>
          Отмена
        </button>
      </div>
    </form>
  )
}
