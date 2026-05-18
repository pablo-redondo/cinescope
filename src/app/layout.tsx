import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CineScope — Descubre películas y series',
  description: 'Explora las mejores películas y series, descubre tendencias y gestiona tu watchlist.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} min-h-full bg-[#0d0d0d] text-white`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
