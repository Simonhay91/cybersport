'use client'

import { useState } from 'react'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-default)',
  color: 'var(--text-primary)',
  fontFamily: 'Inter',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
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

const sectionTitle: React.CSSProperties = {
  fontFamily: 'Rajdhani',
  fontSize: '18px',
  fontWeight: 600,
  textTransform: 'uppercase',
  color: 'var(--text-primary)',
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '1px solid var(--border-default)',
}

interface PlayerField { nickname: string; fullName: string; age: string; steam: string; faceit: string; telegram: string; discord: string }

const emptyPlayer = (): PlayerField => ({ nickname: '', fullName: '', age: '', steam: '', faceit: '', telegram: '', discord: '' })

export default function RegisterForm() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [step1, setStep1] = useState({ teamName: '', captainNick: '', captainTelegram: '' })
  const [form, setForm] = useState({
    tag: '', city: '', socialTelegram: '', socialVk: '',
    captainFullName: '', captainAge: '', captainDiscord: '', captainEmail: '', captainSteam: '', captainFaceit: '',
    players: [emptyPlayer(), emptyPlayer(), emptyPlayer(), emptyPlayer()],
    reserve: emptyPlayer(),
    hasReserve: false,
    agree1: false, agree2: false, agree3: false, agree4: false, agree5: false,
  })

  function updatePlayer(idx: number, field: keyof PlayerField, val: string) {
    setForm(prev => {
      const players = [...prev.players]
      players[idx] = { ...players[idx], [field]: val }
      return { ...prev, players }
    })
  }

  function updateReserve(field: keyof PlayerField, val: string) {
    setForm(prev => ({ ...prev, reserve: { ...prev.reserve, [field]: val } }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.agree1 || !form.agree2 || !form.agree3 || !form.agree4) {
      setError('Необходимо принять все обязательные условия')
      return
    }
    setLoading(true)
    setError('')
    try {
      const payload = {
        teamName: step1.teamName,
        tag: form.tag,
        city: form.city,
        socialLinks: { telegram: form.socialTelegram, vk: form.socialVk },
        captain: {
          nickname: step1.captainNick,
          fullName: form.captainFullName,
          age: form.captainAge ? Number(form.captainAge) : undefined,
          telegram: step1.captainTelegram,
          discord: form.captainDiscord,
          email: form.captainEmail,
          steam: form.captainSteam,
          faceit: form.captainFaceit,
        },
        players: form.players.filter(p => p.nickname).map(p => ({ ...p, age: p.age ? Number(p.age) : undefined })),
        reserve: form.hasReserve && form.reserve.nickname ? { ...form.reserve, age: form.reserve.age ? Number(form.reserve.age) : undefined } : undefined,
      }
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        setError('Ошибка при отправке. Попробуйте ещё раз.')
      }
    } catch {
      setError('Ошибка соединения. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-green)', padding: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: '48px', marginBottom: '16px' }}>✅</p>
        <h2 style={{ fontFamily: 'Rajdhani', fontSize: '28px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '12px' }}>
          Заявка отправлена!
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Администрация SPL свяжется с капитаном команды <strong style={{ color: 'var(--text-primary)' }}>{step1.captainNick}</strong> в течение 24 часов через Telegram или Discord.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Step indicator */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', alignItems: 'center' }}>
        {[1, 2].map(n => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: step >= n ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
              border: `2px solid ${step >= n ? 'var(--accent-yellow)' : 'var(--border-default)'}`,
            }}>
              <span style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700, color: step >= n ? '#000' : 'var(--text-muted)' }}>{n}</span>
            </div>
            <span style={{ fontFamily: 'Inter', fontSize: '13px', color: step === n ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {n === 1 ? 'Быстрый вход' : 'Полная информация'}
            </span>
            {n < 2 && <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>→</span>}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', padding: '32px' }}>
          <h2 style={sectionTitle}>Шаг 1 — Основная информация</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Название команды *</label>
              <input value={step1.teamName} onChange={e => setStep1(p => ({ ...p, teamName: e.target.value }))} required style={inputStyle} placeholder="Например: Team Navi" />
            </div>
            <div>
              <label style={labelStyle}>Ник капитана *</label>
              <input value={step1.captainNick} onChange={e => setStep1(p => ({ ...p, captainNick: e.target.value }))} required style={inputStyle} placeholder="Ваш игровой ник" />
            </div>
            <div>
              <label style={labelStyle}>Telegram капитана *</label>
              <input value={step1.captainTelegram} onChange={e => setStep1(p => ({ ...p, captainTelegram: e.target.value }))} required style={inputStyle} placeholder="@username" />
            </div>
            <button
              onClick={() => {
                if (!step1.teamName || !step1.captainNick || !step1.captainTelegram) {
                  setError('Заполните все поля')
                  return
                }
                setError('')
                setStep(2)
              }}
              style={{ padding: '14px 32px', background: 'var(--accent-yellow)', color: '#000', fontFamily: 'Rajdhani', fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}
            >
              Продолжить →
            </button>
            {error && <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--accent-red)' }}>{error}</p>}
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Team info */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', padding: '24px' }}>
              <h2 style={sectionTitle}>Информация о команде</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Тег команды *</label>
                  <input value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))} required style={inputStyle} placeholder="NAVI" maxLength={8} />
                </div>
                <div>
                  <label style={labelStyle}>Город / Регион</label>
                  <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} style={inputStyle} placeholder="Москва" />
                </div>
                <div>
                  <label style={labelStyle}>Telegram команды</label>
                  <input value={form.socialTelegram} onChange={e => setForm(p => ({ ...p, socialTelegram: e.target.value }))} style={inputStyle} placeholder="@teamchat" />
                </div>
                <div>
                  <label style={labelStyle}>VK команды</label>
                  <input value={form.socialVk} onChange={e => setForm(p => ({ ...p, socialVk: e.target.value }))} style={inputStyle} placeholder="vk.com/team" />
                </div>
              </div>
            </div>

            {/* Captain full info */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', padding: '24px' }}>
              <h2 style={sectionTitle}>Капитан: {step1.captainNick}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'ФИО', key: 'captainFullName' as const, placeholder: 'Иванов Иван Иванович' },
                  { label: 'Возраст', key: 'captainAge' as const, placeholder: '20', type: 'number' },
                  { label: 'Email', key: 'captainEmail' as const, placeholder: 'email@example.com' },
                  { label: 'Discord', key: 'captainDiscord' as const, placeholder: 'username#0000' },
                  { label: 'Steam URL', key: 'captainSteam' as const, placeholder: 'steamcommunity.com/...' },
                  { label: 'FACEIT URL', key: 'captainFaceit' as const, placeholder: 'faceit.com/...' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input type={f.type || 'text'} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} placeholder={f.placeholder} />
                  </div>
                ))}
              </div>
            </div>

            {/* Players */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', padding: '24px' }}>
              <h2 style={sectionTitle}>Игроки (4 игрока)</h2>
              {form.players.map((player, i) => (
                <div key={i} style={{ marginBottom: '20px' }}>
                  <p style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Игрок {i + 1}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                    {[
                      { label: 'Ник *', key: 'nickname' as keyof PlayerField, required: true },
                      { label: 'ФИО', key: 'fullName' as keyof PlayerField },
                      { label: 'Возраст', key: 'age' as keyof PlayerField },
                      { label: 'Steam', key: 'steam' as keyof PlayerField },
                      { label: 'FACEIT', key: 'faceit' as keyof PlayerField },
                      { label: 'Telegram', key: 'telegram' as keyof PlayerField },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={labelStyle}>{f.label}</label>
                        <input value={player[f.key]} onChange={e => updatePlayer(i, f.key, e.target.value)} required={f.required} style={inputStyle} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Reserve */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <input type="checkbox" id="hasReserve" checked={form.hasReserve} onChange={e => setForm(p => ({ ...p, hasReserve: e.target.checked }))} />
                <label htmlFor="hasReserve" style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Добавить запасного игрока
                </label>
              </div>
              {form.hasReserve && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                  {(['nickname', 'fullName', 'age', 'steam', 'faceit', 'telegram'] as (keyof PlayerField)[]).map(key => (
                    <div key={key}>
                      <label style={labelStyle}>{key === 'nickname' ? 'Ник *' : key === 'fullName' ? 'ФИО' : key.charAt(0).toUpperCase() + key.slice(1)}</label>
                      <input value={form.reserve[key]} onChange={e => updateReserve(key, e.target.value)} required={key === 'nickname'} style={inputStyle} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkboxes */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', padding: '24px' }}>
              <h2 style={sectionTitle}>Подтверждение</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { key: 'agree1', text: 'Подтверждаю корректность введённых данных', required: true },
                  { key: 'agree2', text: 'Принимаю регламент SPL', required: true },
                  { key: 'agree3', text: 'Принимаю публичную оферту', required: true },
                  { key: 'agree4', text: 'Даю согласие на обработку персональных данных', required: true },
                  { key: 'agree5', text: 'Согласен получать уведомления по турниру через официальные каналы SPL', required: false },
                ].map(c => (
                  <label key={c.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={(form as unknown as Record<string, boolean>)[c.key]}
                      onChange={e => setForm(p => ({ ...p, [c.key]: e.target.checked }))}
                      style={{ marginTop: '2px', flexShrink: 0 }}
                    />
                    <span style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {c.text} {c.required && <span style={{ color: 'var(--accent-red)' }}>*</span>}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {error && <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--accent-red)' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ padding: '14px 24px', background: 'transparent', color: 'var(--text-muted)', fontFamily: 'Inter', fontSize: '13px', border: '1px solid var(--border-default)', cursor: 'pointer' }}
              >
                ← Назад
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{ padding: '14px 40px', background: 'var(--accent-yellow)', color: '#000', fontFamily: 'Rajdhani', fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
              >
                {loading ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
