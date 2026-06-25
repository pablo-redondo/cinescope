'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getBackdropUrl, getPosterUrl } from '@/services/tmdb'
import type { TmdbMovieResult } from '@/services/tmdb'

const GENRE_MAP: Record<number, string> = {
  28: 'Acción', 12: 'Aventura', 16: 'Animación', 35: 'Comedia', 80: 'Crimen',
  18: 'Drama', 14: 'Fantasía', 27: 'Terror', 9648: 'Misterio', 10749: 'Romance',
  878: 'Ciencia ficción', 53: 'Thriller', 37: 'Western', 10751: 'Familiar',
  10759: 'Acción & Aventura', 10762: 'Kids', 10763: 'Noticias', 10765: 'Sci-Fi & Fantasy',
  10766: 'Telenovela', 10767: 'Talk', 10768: 'War & Politics',
}

const INTERVAL_MS = 7000

type Props = { items: TmdbMovieResult[]; type: 'movie' | 'tv' }

export default function TmdbHero({ items, type }: Props) {
  if (!items.length) return null
  return <TmdbHeroInner items={items} type={type} />
}

function TmdbHeroInner({ items, type }: Props) {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  const goTo = useCallback((idx: number) => {
    if (idx === current) return
    setFading(true)
    setTimeout(() => { setCurrent(idx); setFading(false) }, 280)
  }, [current])

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
    <section style={{ position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Fondo */}
      <div style={{ position: 'absolute', inset: 0, opacity: fading ? 0 : 1, transition: 'opacity .28s', zIndex: 0 }}>
        {(backdrop || poster) && (
          <Image src={backdrop ?? poster!} alt="" fill priority sizes="100vw"
            style={{ objectFit: 'cover', filter: backdrop ? 'brightness(0.55)' : 'blur(72px) brightness(0.4)' }} />
        )}
      </div>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to right, #141820 20%, rgba(20,24,32,0.82) 52%, rgba(20,24,32,0.25) 78%, transparent)' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to top, #141820 0%, transparent 40%)' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, #141820 0%, transparent 12%)' }} />

      {/* Contenido */}
      <div className="page-inner" style={{
        position: 'relative', zIndex: 2,
        display: 'flex', alignItems: 'center', gap: 'clamp(20px, 3vw, 48px)',
        paddingTop: 'clamp(32px, 4vh, 56px)', paddingBottom: 'clamp(20px, 2.5vh, 36px)',
        opacity: fading ? 0 : 1, transform: fading ? 'translateY(6px)' : 'translateY(0)',
        transition: 'opacity .28s, transform .28s',
      }}>

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.3)',
              color: 'var(--accent)', fontSize: 10, fontWeight: 800,
              padding: '3px 10px', borderRadius: 999, letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              <span style={{ width: 5, height: 5, background: 'var(--accent)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              Destacado
            </span>
            {year && <span style={{ color: 'var(--muted)', fontSize: 12 }}>{year}</span>}
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 4vw, 62px)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-2px', color: '#fff', margin: 0 }}>
            {title}
          </h1>

          {item.vote_average > 0 && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span style={{ color: 'var(--accent)', fontSize: 17 }}>★</span>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 19 }}>{item.vote_average.toFixed(1)}</span>
              <span style={{ color: 'var(--muted)', fontSize: 12 }}>/10 · TMDB</span>
            </div>
          )}

          {genres.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {genres.map(g => (
                <span key={g} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--muted)', fontSize: 11, padding: '3px 11px', borderRadius: 999 }}>{g}</span>
              ))}
            </div>
          )}

          {item.overview && (
            <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '52ch' }}>
              {item.overview}
            </p>
          )}

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <Link href={href} style={{ background: '#fff', color: '#000', fontWeight: 800, fontSize: 13, padding: '11px 26px', borderRadius: 10, textDecoration: 'none' }}>
              ▶ Ver detalles
            </Link>
          </div>
        </div>

        {poster && (
          <div style={{ flexShrink: 0, display: 'none' }} className="hero-poster">
            <div style={{ position: 'relative', width: 'clamp(160px, 14vw, 230px)' }}>
              <div style={{ position: 'absolute', inset: '15%', background: 'rgba(245,197,24,0.1)', filter: 'blur(32px)', borderRadius: 20 }} />
              <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', boxShadow: '0 28px 64px -8px rgba(0,0,0,0.9)', outline: '1px solid rgba(255,255,255,0.1)', transform: 'rotate(1.5deg)' }}>
                <Image src={poster} alt={title} width={230} height={345} style={{ width: '100%', display: 'block' }} priority />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Miniaturas */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="page-inner" style={{ paddingTop: 12, paddingBottom: 14, display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {items.map((m, i) => {
            const p = getPosterUrl(m.poster_path, 'w185')
            const active = i === current
            return (
              <button key={m.id} onClick={() => goTo(i)} title={m.title ?? m.name ?? ''}
                style={{
                  position: 'relative', flexShrink: 0,
                  width: active ? 'clamp(60px, 5.5vw, 82px)' : 'clamp(46px, 4.2vw, 62px)',
                  aspectRatio: '2/3', borderRadius: 7, overflow: 'hidden',
                  border: active ? '2px solid var(--accent)' : '2px solid rgba(255,255,255,0.08)',
                  background: 'var(--surface2)', cursor: 'pointer', padding: 0,
                  opacity: active ? 1 : 0.45,
                  boxShadow: active ? '0 0 12px rgba(245,197,24,0.28)' : 'none',
                  transition: 'width .3s, opacity .2s, border-color .2s',
                }}>
                {p && <Image src={p} alt={m.title ?? m.name ?? ''} fill sizes="82px" style={{ objectFit: 'cover' }} />}
                {active && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(0,0,0,0.5)' }}>
                    <div key={`p-${current}`} style={{ height: '100%', background: 'var(--accent)', animation: `heroProgress ${INTERVAL_MS}ms linear forwards` }} />
                  </div>
                )}
              </button>
            )
          })}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {(['←', '→'] as const).map((arrow, i) => (
              <button key={arrow} onClick={() => goTo(i === 0 ? (current - 1 + items.length) % items.length : (current + 1) % items.length)}
                style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {arrow}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) { .hero-poster { display: block !important; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes heroProgress { from{width:0%} to{width:100%} }
      `}</style>
    </section>
  )
}
