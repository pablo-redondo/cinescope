'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/movies', label: 'Películas' },
  { href: '/tv', label: 'Series' },
  { href: '/estrenos', label: 'Estrenos' },
  { href: '/discover', label: 'Descubrir' },
  { href: '/top', label: 'Top' },
  { href: '/watchlist', label: 'Mi Lista' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [q, setQ] = useState('')
  const [focused, setFocused] = useState(false)

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!q.trim()) return
    router.push(`/search?q=${encodeURIComponent(q.trim())}`)
    setQ('')
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(14,17,26,0.96)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div className="page-inner" style={{
        height: 64,
        display: 'flex', alignItems: 'center',
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0, marginRight: 32 }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, var(--accent) 0%, #e6a800 100%)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 15, color: '#000', letterSpacing: '-0.5px',
            boxShadow: '0 4px 16px rgba(245,197,24,0.25)',
          }}>C</div>
          <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', letterSpacing: '-0.4px' }}>CineScope</span>
        </Link>

        {/* Separador vertical */}
        <div style={{ width: 1, height: 22, background: 'var(--border)', marginRight: 24, flexShrink: 0 }} />

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          {NAV.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} style={{
                position: 'relative',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                textDecoration: 'none',
                color: active ? '#fff' : 'var(--muted)',
                background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                transition: 'color .15s, background .15s',
              }}>
                {label}
                {active && (
                  <span style={{
                    position: 'absolute', bottom: 2, left: '50%',
                    transform: 'translateX(-50%)',
                    width: 18, height: 2,
                    background: 'var(--accent)', borderRadius: 2,
                  }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Búsqueda */}
        <form onSubmit={onSearch} style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: focused ? 'var(--surface2)' : 'var(--surface)',
            border: `1px solid ${focused ? 'rgba(255,255,255,0.15)' : 'var(--border)'}`,
            borderRadius: 10,
            padding: '0 14px',
            height: 38,
            width: focused ? 260 : 200,
            transition: 'width .25s ease, border-color .2s, background .2s',
          }}>
            <svg width="13" height="13" fill="none" stroke={focused ? 'var(--text)' : 'var(--muted)'} strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Buscar..."
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--text)', fontSize: 13, width: '100%',
                fontFamily: 'inherit',
              }}
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 13, padding: 0, lineHeight: 1, flexShrink: 0 }}
              >
                ✕
              </button>
            )}
          </div>
        </form>

      </div>
    </header>
  )
}
