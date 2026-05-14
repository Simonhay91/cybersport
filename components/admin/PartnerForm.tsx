'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

export default function PartnerForm({ initial }: { initial?: Record<string, unknown> }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: (initial?.name as string) || '',
    logo: (initial?.logo as string) || '',
    url: (initial?.url as string) || '',
    tier: (initial?.tier as string) || 'general',
    active: (initial?.active as boolean) ?? true,
    order: (initial?.order as number) ?? 0,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const id = initial?._id as string | undefined
      const url = id ? `/api/partners/${id}` : '/api/partners'
      await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      router.push('/admin/partners')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <label style={labelStyle}>Название *</label>
        <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>URL логотипа</label>
        <input value={form.logo} onChange={e => setForm(p => ({ ...p, logo: e.target.value }))} style={inputStyle} placeholder="https://..." />
      </div>
      <div>
        <label style={labelStyle}>Сайт</label>
        <input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} style={inputStyle} placeholder="https://..." />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Уровень</label>
          <select value={form.tier} onChange={e => setForm(p => ({ ...p, tier: e.target.value }))} style={inputStyle}>
            <option value="title">Титульный</option>
            <option value="main">Главный</option>
            <option value="general">Генеральный</option>
            <option value="media">Медиа</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Порядок</label>
          <input type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} id="active" />
        <label htmlFor="active" style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Активен</label>
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
