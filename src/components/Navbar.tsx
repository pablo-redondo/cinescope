'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

const NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/movies', label: 'Películas' },
  { href: '/tv', label: 'Series' },
  { href: '/estrenos', label: 'Estrenos' },
  { href: '/streaming', label: 'Streaming' },
  { href: '/discover', label: 'Descubrir' },
  { href: '/top', label: 'Top' },
  { href: '/watchlist', label: 'Mi lista' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [q, setQ] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!q.trim()) return
    router.push(`/search?q=${encodeURIComponent(q.trim())}`)
    setQ('')
    inputRef.current?.blur()
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      height: 56,
      display: 'flex', alignItems: 'center',
      background: 'rgba(4,4,7,0.93)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="page-inner" style={{
        width: '100%',
        display: 'flex', alignItems: 'center', gap: 0,
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0, marginRight: 28 }}>
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="12" stroke="#d4982a" strokeWidth="1.8" opacity="0.85"/>
            <circle cx="16" cy="16" r="6.5" stroke="#d4982a" strokeWidth="1.4" opacity="0.55"/>
            <circle cx="16" cy="16" r="2.5" fill="#d4982a"/>
            <circle cx="13" cy="13" r="1.2" fill="#f0ece3" opacity="0.5"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'Georgia, serif' }}>
            La Sala
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1, overflow: 'hidden' }}>
          {NAV.map(({ href, label }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link key={href} href={href} style={{
                padding: '0 12px',
                height: 56,
                display: 'flex', alignItems: 'center',
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                textDecoration: 'none',
                color: active ? 'var(--text)' : 'var(--muted)',
                borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'color .15s, border-color .15s',
                whiteSpace: 'nowrap',
              }} onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--muted2)' }}
                 onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}>
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Search */}
        <form onSubmit={onSearch} style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: focused ? 'var(--surface2)' : 'transparent',
            border: `1px solid ${focused ? 'var(--border2)' : 'var(--border)'}`,
            borderRadius: 8,
            padding: '0 10px',
            height: 34,
            width: focused ? 220 : 150,
            transition: 'width .2s ease, background .2s, border-color .2s',
          }}>
            <svg width="13" height="13" fill="none" stroke={focused ? 'var(--muted2)' : 'var(--muted)'} strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, transition: 'stroke .2s' }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              ref={inputRef}
              value={q}
              onChange={e => setQ(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={focused ? 'Buscar películas, series...' : 'Buscar... /'}
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--text)', fontSize: 12, width: '100%',
                fontFamily: 'inherit',
              }}
            />
            {q && (
              <button type="button" onClick={() => setQ('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 12, padding: 0, lineHeight: 1, flexShrink: 0 }}>
                ✕
              </button>
            )}
          </div>
        </form>

      </div>
    </header>
  )
}
