'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

const NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/movies', label: 'Películas' },
  { href: '/tv', label: 'Series' },
  { href: '/estrenos', label: 'Estrenos' },
  { href: '/discover', label: 'Descubrir' },
  { href: '/top', label: 'Top' },
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
      height: 58,
      display: 'flex', alignItems: 'center',
      background: 'rgba(13,11,8,0.97)',
      backdropFilter: 'blur(20px) saturate(160%)',
      borderBottom: '1px solid rgba(240,236,227,0.07)',
    }}>
      <div className="page-inner" style={{ width: '100%', display: 'flex', alignItems: 'center' }}>

        {/* Logo — flex:1 left */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="13" stroke="#d4982a" strokeWidth="1.5" opacity="0.9"/>
              <circle cx="16" cy="16" r="7" stroke="#d4982a" strokeWidth="1.2" opacity="0.5"/>
              <circle cx="16" cy="16" r="2.5" fill="#d4982a"/>
              <circle cx="11.5" cy="11.5" r="1.4" fill="#f0ece3" opacity="0.45"/>
              <circle cx="20.5" cy="11.5" r="1.4" fill="#f0ece3" opacity="0.45"/>
              <circle cx="11.5" cy="20.5" r="1.4" fill="#f0ece3" opacity="0.45"/>
              <circle cx="20.5" cy="20.5" r="1.4" fill="#f0ece3" opacity="0.45"/>
            </svg>
            <span style={{
              fontFamily: 'var(--font-bebas), sans-serif',
              fontSize: 19,
              letterSpacing: '5px',
              color: 'var(--text)',
              lineHeight: 1,
              paddingTop: 2,
            }}>
              LA SALA
            </span>
          </Link>
        </div>

        {/* Nav — centered */}
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          {NAV.map(({ href, label }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link key={href} href={href} className={`nv${active ? ' nv-active' : ''}`}
                style={{
                  padding: '0 14px',
                  height: 58,
                  display: 'flex', alignItems: 'center',
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  textDecoration: 'none',
                  color: active ? 'var(--text)' : 'var(--muted2)',
                  position: 'relative',
                  transition: 'color .15s',
                  whiteSpace: 'nowrap',
                }}>
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right side — flex:1, justify-end */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
          {/* Search box */}
          <form onSubmit={onSearch}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: focused ? 'var(--surface2)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${focused ? 'var(--border2)' : 'var(--border)'}`,
              borderRadius: 8,
              padding: '0 10px',
              height: 34,
              width: focused ? 210 : 140,
              transition: 'width .2s ease, background .2s, border-color .2s',
            }}>
              <svg width="12" height="12" fill="none" stroke={focused ? 'var(--muted2)' : 'var(--muted)'} strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={e => setQ(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={focused ? 'Buscar películas, series...' : 'Buscar… /'}
                style={{
                  background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--text)', fontSize: 12, width: '100%',
                  fontFamily: 'inherit',
                }}
              />
              {q && (
                <button type="button" onClick={() => setQ('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 11, padding: 0, lineHeight: 1, flexShrink: 0 }}>
                  ✕
                </button>
              )}
            </div>
          </form>

          {/* Mi lista — solid amber button */}
          <Link href="/watchlist" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#d4982a', color: '#0d0b08',
            fontWeight: 700, fontSize: 12,
            padding: '0 16px', height: 34, borderRadius: 8,
            textDecoration: 'none', whiteSpace: 'nowrap',
            letterSpacing: '0.01em',
            transition: 'background .15s',
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Mi lista
          </Link>
        </div>
      </div>

      <style>{`
        .nv::after {
          content: '';
          position: absolute;
          bottom: 0; left: 14px; right: 14px;
          height: 1.5px;
          background: var(--accent);
          opacity: 0;
          transition: opacity .15s;
        }
        .nv-active::after { opacity: 1; }
        .nv:hover { color: var(--text) !important; }
        .nv:hover::after { opacity: 0.5; }
        .nv-active:hover::after { opacity: 1; }
      `}</style>
    </header>
  )
}
