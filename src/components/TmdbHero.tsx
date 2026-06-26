'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getBackdropUrl, getPosterUrl } from '@/services/tmdb'
import type { TmdbMovieResult } from '@/services/tmdb'

const GENRE_MAP: Record<number, string> = {
  28: 'Acción', 12: 'Aventura', 16: 'Animación', 35: 'Comedia', 80: 'Crimen',
  18: 'Drama', 14: 'Fantasía', 27: 'Terror', 9648: 'Misterio', 10749: 'Romance',
  878: 'Sci-Fi', 53: 'Thriller', 37: 'Western', 10751: 'Familiar',
  10759: 'Acción & Av.', 10765: 'Sci-Fi & Fantasy',
}

const INTERVAL_MS = 8000

type Props = { items: TmdbMovieResult[]; type: 'movie' | 'tv' }

export default function TmdbHero({ items, type }: Props) {
  if (!items.length) return null
  return <TmdbHeroInner items={items} type={type} />
}

function TmdbHeroInner({ items, type }: Props) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((idx: number) => {
    if (idx === current || animating) return
    setPrev(current)
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setPrev(null)
      setAnimating(false)
    }, 400)
  }, [current, animating])

  useEffect(() => {
    const t = setInterval(() => goTo((current + 1) % items.length), INTERVAL_MS)
    return () => clearInterval(t)
  }, [current, items.length, goTo])

  const item = items[current]
  const backdrop = getBackdropUrl(item.backdrop_path, 'w1280')
  const poster = getPosterUrl(item.poster_path, 'w342')
  const title = item.title ?? item.name ?? ''
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)
  const genres = (item.genre_ids ?? []).slice(0, 3).map(id => GENRE_MAP[id]).filter(Boolean)
  const href = `/tmdb/${type}/${item.id}`

  return (
    <section style={{ position: 'relative', height: 'clamp(480px, 55vh, 660px)', overflow: 'hidden' }}>

      {/* Background images — cross-fade */}
      {prev !== null && (
        <div key={`prev-${prev}`} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {(() => {
            const p = items[prev]
            const bg = getBackdropUrl(p.backdrop_path, 'w1280') ?? getPosterUrl(p.poster_path, 'w342')
            return bg ? <Image src={bg} alt="" fill priority sizes="100vw" style={{ objectFit: 'cover', filter: 'brightness(0.45)' }} /> : null
          })()}
        </div>
      )}
      <div key={`curr-${current}`} style={{
        position: 'absolute', inset: 0, zIndex: 1,
        opacity: animating ? 0 : 1,
        transition: 'opacity .4s ease',
      }}>
        {(backdrop || poster) && (
          <Image src={backdrop ?? poster!} alt="" fill priority sizes="100vw"
            style={{ objectFit: 'cover', filter: 'brightness(0.4) saturate(1.1)' }} />
        )}
      </div>

      {/* Gradient overlays */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to right, rgba(9,9,15,0.95) 0%, rgba(9,9,15,0.7) 45%, rgba(9,9,15,0.2) 75%, transparent 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to top, rgba(9,9,15,1) 0%, transparent 35%)' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to bottom, rgba(9,9,15,0.4) 0%, transparent 20%)' }} />

      {/* Content */}
      <div className="page-inner" style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        paddingBottom: 52,
      }}>
        <div style={{
          maxWidth: 580,
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity .35s ease, transform .35s ease',
        }}>

          {/* Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(245,197,24,0.12)', border: '1px solid rgba(245,197,24,0.25)',
              color: 'var(--accent)', fontSize: 10, fontWeight: 700,
              padding: '3px 10px', borderRadius: 4, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              <span style={{ width: 4, height: 4, background: 'var(--accent)', borderRadius: '50%', animation: 'heroHbeat 2s infinite' }} />
              Destacado
            </span>
            {year && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{year}</span>}
            {genres.map(g => (
              <span key={g} style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{g}</span>
            ))}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 66px)',
            fontWeight: 900,
            lineHeight: 0.93,
            letterSpacing: '-2.5px',
            color: '#fff',
            marginBottom: 14,
            textShadow: '0 2px 32px rgba(0,0,0,0.4)',
          }}>{title}</h1>

          {/* Rating */}
          {item.vote_average > 0 && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 14 }}>
              <span style={{ color: 'var(--accent)', fontSize: 14 }}>★</span>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>{item.vote_average.toFixed(1)}</span>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>/10 TMDB</span>
            </div>
          )}

          {/* Overview */}
          {item.overview && (
            <p style={{
              color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.65,
              marginBottom: 20,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{item.overview}</p>
          )}

          {/* CTA */}
          <Link href={href} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#fff', color: '#000', fontWeight: 800, fontSize: 13,
            padding: '11px 22px', borderRadius: 8, textDecoration: 'none',
            transition: 'background .15s',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 2l7 4-7 4V2z"/></svg>
            Ver detalles
          </Link>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 4,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        paddingRight: 'var(--page-pad)', gap: 6,
      }} className="hero-strip">
        {items.map((m, i) => {
          const p = getPosterUrl(m.poster_path, 'w185')
          const active = i === current
          return (
            <button key={m.id} onClick={() => goTo(i)} title={m.title ?? m.name ?? ''}
              style={{
                position: 'relative', flexShrink: 0,
                width: active ? 46 : 38,
                aspectRatio: '2/3', borderRadius: 6, overflow: 'hidden',
                border: active ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.08)',
                background: 'var(--surface2)', cursor: 'pointer', padding: 0,
                opacity: active ? 1 : 0.38,
                boxShadow: active ? '0 0 16px rgba(245,197,24,0.3)' : 'none',
                transition: 'width .3s, opacity .25s, border-color .25s, box-shadow .25s',
              }}>
              {p && <Image src={p} alt={m.title ?? m.name ?? ''} fill sizes="46px" style={{ objectFit: 'cover' }} />}
              {active && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(0,0,0,0.4)' }}>
                  <div key={`progress-${current}`} style={{ height: '100%', background: 'var(--accent)', animation: `heroProgress ${INTERVAL_MS}ms linear forwards` }} />
                </div>
              )}
            </button>
          )
        })}
      </div>

      <style>{`
        @media (max-width: 640px) { .hero-strip { display: none !important; } }
        @keyframes heroHbeat { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes heroProgress { from{width:0%} to{width:100%} }
      `}</style>
    </section>
  )
}
