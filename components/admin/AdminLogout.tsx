'use client'

import { signOut } from 'next-auth/react'

export default function AdminLogout() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      style={{
        width: '100%',
        padding: '8px 12px',
        background: 'transparent',
        border: '1px solid var(--border-default)',
        color: 'var(--text-muted)',
        fontFamily: 'Inter',
        fontSize: '13px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'color 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-red)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
    >
      Выйти
    </button>
  )
}
