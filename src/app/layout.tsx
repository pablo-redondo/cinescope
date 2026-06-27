import type { Metadata } from 'next'
import { Bebas_Neue, Playfair_Display, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const bebasNeue = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-bebas' })
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'], style: ['normal', 'italic'], variable: '--font-playfair' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-space' })

export const metadata: Metadata = {
  title: 'La Sala — Descubre películas y series',
  description: 'Explora las mejores películas y series, gestiona tu watchlist y descubre tendencias.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${playfair.variable} ${spaceGrotesk.variable}`}>
      <body style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
