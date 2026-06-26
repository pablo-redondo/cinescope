'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

const NAV = [
  { href: '/', label: 'Inicio', color: '#f5c518' },
  { href: '/movies', label: 'Películas', color: '#dc2626' },
  { href: '/tv', label: 'Series', color: '#6366f1' },
  { href: '/estrenos', label: 'Estrenos', color: '#f97316' },
  { href: '/streaming', label: 'Streaming', color: '#00a8e0' },
  { href: '/discover', label: 'Descubrir', color: '#10b981' },
  { href: '/top', label: 'Top', color: '#f5c518' },
  { href: '/watchlist', label: 'Mi lista', color: '#a78bfa' },
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
      background: 'rgba(9,9,15,0.92)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="page-inner" style={{
        width: '100%',
        display: 'flex', alignItems: 'center', gap: 0,
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0, marginRight: 28 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#f5c518" opacity="0.15"/>
            <path d="M8 7.5L17 12L8 16.5V7.5Z" fill="#f5c518"/>
          </svg>
          <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.3px' }}>
            Cine<span style={{ color: 'var(--accent)' }}>Scope</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1, overflow: 'hidden' }}>
          {NAV.map(({ href, label, color }) => {
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
                borderBottom: active ? `2px solid ${color}` : '2px solid transparent',
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
