import type { Metadata } from 'next'
import { Rajdhani, Inter } from 'next/font/google'
import './globals.css'
import ConditionalNavbar from '@/components/nav/ConditionalNavbar'

const rajdhani = Rajdhani({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Siberian Pro League — CS2 Tournament',
  description: 'Siberian Pro League — профессиональная CS2 киберспортивная лига. Призовой фонд 200,000 ₽. Регистрация команд открыта.',
  keywords: 'SPL, Siberian Pro League, CS2, киберспорт, турнир',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${rajdhani.variable} ${inter.variable}`}>
      <body className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <ConditionalNavbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
