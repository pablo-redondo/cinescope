'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    setQuery('')
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">
        <Link href="/" className="text-xl font-bold text-white shrink-0">
          🎬 CineScope
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: '/', label: 'Inicio' },
            { href: '/movies', label: 'Películas' },
            { href: '/tv', label: 'Series' },
            { href: '/watchlist', label: 'Mi Lista' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === href
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="ml-auto flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar películas o series..."
            className="bg-white/10 border border-white/10 text-white placeholder-slate-500 rounded-full px-4 py-2 text-sm w-48 md:w-64 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all"
          />
        </form>
      </div>
    </header>
  )
}
