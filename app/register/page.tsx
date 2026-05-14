import RegisterForm from '@/components/register/RegisterForm'
import Footer from '@/components/home/Footer'

export default function RegisterPage() {
  return (
    <>
      <section style={{ padding: '60px 0 80px', background: 'var(--bg-primary)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--accent-yellow)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            Siberian Pro League
          </p>
          <h1 style={{ fontFamily: 'Rajdhani', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Регистрация команды
          </h1>
          <p style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6 }}>
            Заполните форму, и администрация SPL свяжется с капитаном в течение 24 часов через Telegram или Discord.
          </p>
          <RegisterForm />
        </div>
      </section>
      <Footer />
    </>
  )
}
