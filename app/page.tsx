import HeroSection from '@/components/home/HeroSection'
import FormatSection from '@/components/home/FormatSection'
import PrizeSection from '@/components/home/PrizeSection'
import TeamGrid from '@/components/home/TeamGrid'
import FAQSection from '@/components/home/FAQSection'
import Footer from '@/components/home/Footer'
import Link from 'next/link'
import connectDB from '@/lib/mongodb'
import Team from '@/models/Team'

async function getTeams() {
  try {
    await connectDB()
    const teams = await Team.find({ status: { $in: ['confirmed', 'pending'] } })
      .select('name slug logo tag status wins losses')
      .limit(15)
      .lean()
    return JSON.parse(JSON.stringify(teams))
  } catch {
    return []
  }
}

export default async function HomePage() {
  const teams = await getTeams()

  return (
    <>
      <HeroSection />

      {/* О проекте */}
      <section
        id="about"
        style={{
          padding: '80px 0',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-default)',
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }} className="px-4 md:px-12">
          <div style={{ maxWidth: '720px' }}>
            <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--accent-yellow)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              О проекте
            </p>
            <h2
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                marginBottom: '24px',
              }}
            >
              Что такое SPL
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
              SPL — это киберспортивная лига по Counter-Strike 2, ориентированная на соревновательный уровень, регулярные турниры и развитие команд.
            </p>
            <p style={{ fontFamily: 'Inter', fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Проект создаётся как системная платформа, а не разовый турнир. Наша цель — создать профессиональную экосистему для CS2-команд СНГ-региона.
            </p>
          </div>
        </div>
      </section>

      <FormatSection />
      <PrizeSection />
      <TeamGrid teams={teams} />

      {/* Партнёрам */}
      <section
        id="partners"
        style={{
          padding: '80px 0',
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-default)',
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }} className="px-4 md:px-12">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="grid-cols-1 md:grid-cols-2">
            <div>
              <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--accent-yellow)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                Сотрудничество
              </p>
              <h2
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontSize: 'clamp(32px, 5vw, 48px)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                  marginBottom: '24px',
                }}
              >
                Партнёрство с SPL
              </h2>
              <p style={{ fontFamily: 'Inter', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                SPL интегрирует бренды в структуру турнира и медиаконтента.
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {[
                  'Присутствие в трансляциях',
                  'Размещение в визуальных материалах',
                  'Интеграции в контент',
                  'Публикации в социальных сетях',
                  'Индивидуальные интеграции под задачи бренда',
                ].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: 'var(--accent-yellow)', fontSize: '16px' }}>→</span>
                    <span style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:admin@spl.gg"
                style={{
                  display: 'inline-block',
                  fontFamily: 'Rajdhani',
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--accent-yellow)',
                  border: '1px solid var(--accent-yellow)',
                  padding: '14px 32px',
                  textDecoration: 'none',
                }}
              >
                Стать партнёром
              </a>
            </div>
            <div style={{ color: 'var(--text-muted)', fontFamily: 'Inter', fontSize: '14px', textAlign: 'center' }}>
              <p>Партнёры будут добавлены в ближайшее время.</p>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />

      {/* Final CTA */}
      <section
        style={{
          padding: '80px 0',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-default)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }} className="px-4 md:px-12">
          <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--accent-yellow)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            Регистрация открыта
          </p>
          <h2
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              marginBottom: '16px',
            }}
          >
            Готовы участвовать?
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '40px' }}>
            Проверка заявки — до 24 часов.
          </p>
          <Link
            href="/register"
            style={{
              display: 'inline-block',
              fontFamily: 'Rajdhani',
              fontSize: '16px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#000',
              background: 'var(--accent-yellow)',
              padding: '16px 48px',
              textDecoration: 'none',
            }}
          >
            Зарегистрировать команду
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
