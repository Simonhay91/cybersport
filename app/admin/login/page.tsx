'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.ok) {
      router.push('/admin')
    } else {
      setError('Неверный email или пароль')
    }
    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '48px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
        }}
      >
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontFamily: 'Rajdhani', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>SPL</p>
          <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Администратор</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                fontFamily: 'Inter',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                fontFamily: 'Inter',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--accent-red)' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px',
              background: 'var(--accent-yellow)',
              color: '#000',
              fontFamily: 'Rajdhani',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}
