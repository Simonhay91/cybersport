'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface MatchFormProps {
  tournaments: { _id: string; name: string }[]
  teams: { _id: string; name: string; tag: string }[]
  allMatches: { _id: string; stage: string; teamA?: { name: string }; teamB?: { name: string } }[]
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

export default function MatchForm({ tournaments, teams, allMatches, initial }: MatchFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [groups, setGroups] = useState<{ _id: string; name: string }[]>([])
  const [form, setForm] = useState({
    tournament: (initial?.tournament as string) || '',
    group: (initial?.group as string) || '',
    bracket: (initial?.bracket as string) || '',
    stage: (initial?.stage as string) || '',
    round: (initial?.round as string) || '',
    teamA: (initial?.teamA as string) || '',
    teamB: (initial?.teamB as string) || '',
    scoreA: (initial?.scoreA as number) ?? 0,
    scoreB: (initial?.scoreB as number) ?? 0,
    format: (initial?.format as string) || 'BO1',
    status: (initial?.status as string) || 'upcoming',
    winner: (initial?.winner as string) || '',
    scheduledAt: (initial?.scheduledAt as string) ? String(initial?.scheduledAt).slice(0, 16) : '',
    nextMatchWinner: (initial?.nextMatchWinner as string) || '',
    nextMatchWinnerSlot: (initial?.nextMatchWinnerSlot as string) || 'A',
    nextMatchLoser: (initial?.nextMatchLoser as string) || '',
    nextMatchLoserSlot: (initial?.nextMatchLoserSlot as string) || 'A',
    adminNote: (initial?.adminNote as string) || '',
  })

  // Load groups when tournament changes
  useEffect(() => {
    if (!form.tournament) { setGroups([]); return }
    fetch(`/api/groups?tournament=${form.tournament}`)
      .then(r => r.json())
      .then((data: { _id: string; name: string }[]) => setGroups(Array.isArray(data) ? data : []))
      .catch(() => setGroups([]))
  }, [form.tournament])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      // reset group when tournament changes
      ...(name === 'tournament' ? { group: '', bracket: '' } : {}),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const id = initial?._id as string | undefined
      const url = id ? `/api/matches/${id}` : '/api/matches'
      const method = id ? 'PUT' : 'POST'
      const payload = {
        ...form,
        scoreA: Number(form.scoreA),
        scoreB: Number(form.scoreB),
        round: form.round ? Number(form.round) : undefined,
        winner: form.winner || undefined,
        group: form.group || undefined,
        bracket: form.bracket || undefined,
        nextMatchWinner: form.nextMatchWinner || undefined,
        nextMatchLoser: form.nextMatchLoser || undefined,
      }
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      router.push('/admin/matches')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Tournament + Group + Stage */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Турнир *</label>
          <select name="tournament" value={form.tournament} onChange={handleChange} required style={inputStyle}>
            <option value="">Выбрать...</option>
            {tournaments.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Группа</label>
          <select
            name="group"
            value={form.group}
            onChange={handleChange}
            style={{ ...inputStyle, opacity: groups.length === 0 ? 0.5 : 1 }}
            disabled={groups.length === 0}
          >
            <option value="">— Плей-офф / нет группы —</option>
            {groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Брекет (DE)</label>
          <select name="bracket" value={form.bracket} onChange={handleChange} style={inputStyle} disabled={!form.group}>
            <option value="">Нет</option>
            <option value="WB">WB — Winners Bracket</option>
            <option value="LB">LB — Losers Bracket</option>
            <option value="GF">GF — Grand Final</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Стадия *</label>
          <input name="stage" value={form.stage} onChange={handleChange} required style={inputStyle} placeholder="WB Round 1 / LB Final / Grand Final" />
        </div>
        <div>
          <label style={labelStyle}>Раунд</label>
          <input type="number" name="round" value={form.round} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      {/* Teams */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Команда A</label>
          <select name="teamA" value={form.teamA} onChange={handleChange} style={inputStyle}>
            <option value="">TBD</option>
            {teams.map(t => <option key={t._id} value={t._id}>{t.name} [{t.tag}]</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Команда B</label>
          <select name="teamB" value={form.teamB} onChange={handleChange} style={inputStyle}>
            <option value="">TBD</option>
            {teams.map(t => <option key={t._id} value={t._id}>{t.name} [{t.tag}]</option>)}
          </select>
        </div>
      </div>

      {/* Score + Format + Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Счёт A</label>
          <input type="number" name="scoreA" value={form.scoreA} onChange={handleChange} min={0} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Счёт B</label>
          <input type="number" name="scoreB" value={form.scoreB} onChange={handleChange} min={0} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Формат</label>
          <select name="format" value={form.format} onChange={handleChange} style={inputStyle}>
            <option value="BO1">BO1</option>
            <option value="BO3">BO3</option>
            <option value="BO5">BO5</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Статус</label>
          <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="finished">Finished</option>
          </select>
        </div>
      </div>

      {/* Winner + Date */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Победитель</label>
          <select name="winner" value={form.winner} onChange={handleChange} style={inputStyle}>
            <option value="">Не выбран</option>
            {form.teamA && <option value={form.teamA}>{teams.find(t => t._id === form.teamA)?.name} (A)</option>}
            {form.teamB && <option value={form.teamB}>{teams.find(t => t._id === form.teamB)?.name} (B)</option>}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Дата и время</label>
          <input type="datetime-local" name="scheduledAt" value={form.scheduledAt} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      {/* Bracket links */}
      <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', padding: '20px' }}>
        <p style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Продвижение по сетке
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', gap: '12px', alignItems: 'end' }}>
          <div>
            <label style={labelStyle}>Следующий матч для победителя</label>
            <select name="nextMatchWinner" value={form.nextMatchWinner} onChange={handleChange} style={inputStyle}>
              <option value="">Нет</option>
              {allMatches.filter(m => m._id !== (initial?._id as string)).map(m => (
                <option key={m._id} value={m._id}>
                  {m.stage} — {(m.teamA as { name: string } | undefined)?.name || 'TBD'} vs {(m.teamB as { name: string } | undefined)?.name || 'TBD'}
                </option>
              ))}
            </select>
          </div>
          <div style={{ minWidth: '80px' }}>
            <label style={labelStyle}>Слот</label>
            <select name="nextMatchWinnerSlot" value={form.nextMatchWinnerSlot} onChange={handleChange} style={inputStyle}>
              <option value="A">Team A</option>
              <option value="B">Team B</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Следующий матч для проигравшего</label>
            <select name="nextMatchLoser" value={form.nextMatchLoser} onChange={handleChange} style={inputStyle}>
              <option value="">Нет</option>
              {allMatches.filter(m => m._id !== (initial?._id as string)).map(m => (
                <option key={m._id} value={m._id}>
                  {m.stage} — {(m.teamA as { name: string } | undefined)?.name || 'TBD'} vs {(m.teamB as { name: string } | undefined)?.name || 'TBD'}
                </option>
              ))}
            </select>
          </div>
          <div style={{ minWidth: '80px' }}>
            <label style={labelStyle}>Слот</label>
            <select name="nextMatchLoserSlot" value={form.nextMatchLoserSlot} onChange={handleChange} style={inputStyle}>
              <option value="A">Team A</option>
              <option value="B">Team B</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Заметка администратора</label>
        <textarea name="adminNote" value={form.adminNote} onChange={handleChange} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
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
