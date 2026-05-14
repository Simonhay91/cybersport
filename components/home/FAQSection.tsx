'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'Участие платное?',
    a: 'Нет, участие бесплатное. SPL — лига с призовым фондом 200,000 ₽ при бесплатном входе.',
  },
  {
    q: 'Сколько игроков в команде?',
    a: '5 основных игроков + 1 запасной (если предусмотрен регламентом). Капитан входит в состав основных.',
  },
  {
    q: 'Где проходят матчи?',
    a: 'Онлайн-стадии проходят на официальных серверах SPL. Финальная стадия может проходить в офлайн-формате согласно условиям турнира.',
  },
  {
    q: 'Как попасть на турнир?',
    a: 'Заполните форму регистрации команды и дождитесь подтверждения от администрации. Проверка заявки — до 24 часов.',
  },
  {
    q: 'Когда придёт ответ на заявку?',
    a: 'Администрация SPL рассматривает заявки в течение 24 часов и связывается с капитаном команды через Telegram или Discord.',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" style={{ padding: '80px 0', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }} className="px-4 md:px-12">
        <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--accent-yellow)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
          Часто задаваемые вопросы
        </p>
        <h2
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
            marginBottom: '48px',
          }}
        >
          FAQ
        </h2>

        <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '0' }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{ borderBottom: '1px solid var(--border-default)' }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  gap: '16px',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontFamily: 'Rajdhani', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {faq.q}
                </span>
                <ChevronDown
                  size={20}
                  style={{
                    color: 'var(--accent-yellow)',
                    flexShrink: 0,
                    transform: open === i ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>
              {open === i && (
                <p style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, paddingBottom: '20px' }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
