'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { TmdbMovieResult } from '@/services/tmdb'
import { getPosterUrl } from '@/lib/tmdb'

type Props = {
  items: TmdbMovieResult[]
  title: string
  subtitle?: string
  type: 'movie' | 'tv'
  viewAllHref?: string
}

function TmdbCard({ item, type }: { item: TmdbMovieResult; type: 'movie' | 'tv' }) {
  const poster = getPosterUrl(item.poster_path, 'w342')
  const title = item.title ?? item.name ?? ''
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null
  const href = `/tmdb/${type === 'tv' ? 'tv' : 'movie'}/${item.id}`

  return (
    <Link href={href} style={{ display: 'block', textDecoration: 'none', position: 'relative' }} className="tmdb-card">
      <div style={{
        position: 'relative',
        aspectRatio: '2/3',
        width: '100%',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        background: 'var(--surface2)',
      }} className="tmdb-card-img">
        {poster ? (
          <Image src={poster} alt={title} fill sizes="(max-width: 768px) 40vw, 180px"
            style={{ objectFit: 'cover', transition: 'transform .4s ease' }} className="tmdb-poster" />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
              {type === 'tv'
                ? <><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></>
                : <><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></>}
            </svg>
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)', opacity: 0, transition: 'opacity .3s' }} className="tmdb-overlay" />

        {/* Rating badge */}
        {rating && (
          <div style={{
            position: 'absolute', top: 7, right: 7,
            background: 'rgba(0,0,0,0.88)',
            color: 'var(--accent)', fontSize: 10, fontWeight: 800,
            padding: '3px 7px', borderRadius: 6,
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(212,152,42,0.25)',
          }}>★ {rating}</div>
        )}

        {/* Type pill */}
        <div style={{
          position: 'absolute', top: 7, left: 7,
          background: type === 'tv' ? 'rgba(99,102,241,0.9)' : 'rgba(220,38,38,0.9)',
          color: '#fff', fontSize: 8, fontWeight: 800,
          padding: '2px 6px', borderRadius: 4,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          backdropFilter: 'blur(6px)',
        }}>{type === 'tv' ? 'SERIE' : 'PEL.'}</div>
      </div>

      <div style={{ marginTop: 8, padding: '0 1px' }}>
        <p style={{
          fontSize: 12, fontWeight: 600,
          color: 'var(--text)',
          transition: 'color .15s',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          lineHeight: 1.3,
        }} className="tmdb-title">{title}</p>
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, fontWeight: 400 }}>{year}</p>
      </div>

      <style>{`
        .tmdb-card:hover .tmdb-poster { transform: scale(1.06); }
        .tmdb-card:hover .tmdb-overlay { opacity: 1; }
        .tmdb-card:hover .tmdb-title { color: var(--accent); }
        .tmdb-card-img {
          box-shadow: 0 2px 12px rgba(0,0,0,0.5);
          transition: box-shadow .3s ease;
        }
        .tmdb-card:hover .tmdb-card-img {
          box-shadow: 0 16px 40px rgba(0,0,0,0.75), 0 0 0 1px rgba(212,152,42,0.15);
        }
      `}</style>
    </Link>
  )
}

export default function TmdbCarousel({ items, title, subtitle, type, viewAllHref }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  function updateArrows() {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    return () => el.removeEventListener('scroll', updateArrows)
  }, [items])

  function scroll(dir: 'left' | 'right') {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 560 : -560, behavior: 'smooth' })
  }

  if (!items.length) return null

  return (
    <section>
      {/* Header row */}
      <div className="page-offset" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{ width: 2, height: 14, borderRadius: 2, flexShrink: 0, background: 'var(--accent)' }} />
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.1px', whiteSpace: 'nowrap' }}>{title}</h2>
          {subtitle && <p style={{ fontSize: 11, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle}</p>}
        </div>

        <div style={{ display: 'flex', gap: 4, flexShrink: 0, alignItems: 'center' }}>
          {viewAllHref && (
            <Link href={viewAllHref} style={{ fontSize: 11, color: 'var(--muted)', textDecoration: 'none', fontWeight: 600, marginRight: 8, whiteSpace: 'nowrap' }}>
              Ver todo →
            </Link>
          )}
          {(['←', '→'] as const).map((arrow, i) => {
            const active = i === 0 ? canLeft : canRight
            return (
              <button key={arrow} onClick={() => scroll(i === 0 ? 'left' : 'right')} disabled={!active}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  border: '1px solid var(--border)',
                  background: active ? 'var(--surface2)' : 'transparent',
                  color: active ? 'var(--muted2)' : 'rgba(255,255,255,0.1)',
                  fontSize: 12, cursor: active ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .15s',
                }}>{arrow}</button>
            )
          })}
        </div>
      </div>

      {/* Scroll row */}
      <div ref={scrollRef} className="scrollbar-hide" style={{ overflowX: 'auto' }}>
        <div className="page-offset-l" style={{
          display: 'flex', gap: 10,
          paddingRight: 'var(--page-pad)',
          paddingBottom: 4,
          width: 'max-content',
        }}>
          {items.map(item => (
            <div key={item.id} style={{ flexShrink: 0, width: 'clamp(120px, 9.5vw, 155px)' }}>
              <TmdbCard item={item} type={type} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
