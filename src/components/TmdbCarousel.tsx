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
  imdbMap?: Record<number, string>
}

function TmdbCard({ item, type }: { item: TmdbMovieResult; type: 'movie' | 'tv' }) {
  const [hovered, setHovered] = useState(false)
  const poster = getPosterUrl(item.poster_path, 'w342')
  const title = item.title ?? item.name ?? ''
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null

  return (
    <div
      style={{ display: 'block', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: 'relative',
        aspectRatio: '2/3',
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#1a1f2e',
        transform: hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'transform .25s ease, box-shadow .25s ease',
        boxShadow: hovered
          ? '0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(245,197,24,0.2)'
          : '0 4px 16px rgba(0,0,0,0.4)',
      }}>
        {poster ? (
          <Image
            src={poster}
            alt={title}
            fill
            sizes="(max-width: 768px) 40vw, 200px"
            style={{ objectFit: 'cover', transition: 'transform .35s ease', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 8, color: '#3a4060', fontSize: 32,
          }}>🎬</div>
        )}

        {rating && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            display: 'flex', alignItems: 'center', gap: 3,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            color: 'var(--accent)', fontSize: 11, fontWeight: 800,
            padding: '4px 8px', borderRadius: 8,
            border: '1px solid rgba(245,197,24,0.2)',
          }}>
            ★ {rating}
          </div>
        )}

        <div style={{
          position: 'absolute', top: 8, left: 8,
          background: type === 'tv' ? 'rgba(99,102,241,0.85)' : 'rgba(239,68,68,0.85)',
          color: '#fff', fontSize: 9, fontWeight: 800,
          padding: '3px 7px', borderRadius: 6,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          backdropFilter: 'blur(8px)',
        }}>
          {type === 'tv' ? 'SERIE' : 'PELÍCULA'}
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '50%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
        }} />
      </div>

      <div style={{ marginTop: 10, padding: '0 2px' }}>
        <p style={{
          fontSize: 13, fontWeight: 700,
          color: hovered ? 'var(--accent)' : 'var(--text)',
          transition: 'color .2s',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          lineHeight: 1.3,
        }}>
          {title}
        </p>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, fontWeight: 500 }}>
          {year}
        </p>
      </div>
    </div>
  )
}

export default function TmdbCarousel({ items, title, subtitle, type }: Props) {
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
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 640 : -640, behavior: 'smooth' })
  }

  if (!items.length) return null

  return (
    <section>
      <div className="page-offset" style={{
        marginBottom: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 3, height: 20, background: 'var(--accent)', borderRadius: 2, flexShrink: 0 }} />
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.2px', lineHeight: 1.2, margin: 0 }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{subtitle}</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {(['←', '→'] as const).map((arrow, i) => {
            const active = i === 0 ? canLeft : canRight
            return (
              <button
                key={arrow}
                onClick={() => scroll(i === 0 ? 'left' : 'right')}
                disabled={!active}
                style={{
                  width: 30, height: 30, borderRadius: '50%',
                  border: '1px solid var(--border)',
                  background: active ? 'var(--surface2)' : 'transparent',
                  color: active ? 'var(--text)' : 'rgba(255,255,255,0.15)',
                  fontSize: 13, cursor: active ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .15s',
                }}
              >{arrow}</button>
            )
          })}
        </div>
      </div>

      <div ref={scrollRef} className="scrollbar-hide" style={{ overflowX: 'auto' }}>
        <div className="page-offset-l" style={{
          display: 'flex',
          gap: 12,
          paddingRight: 'var(--page-pad)',
          paddingBottom: 10,
          width: 'max-content',
        }}>
          {items.map((item) => (
            <div key={item.id} style={{ flexShrink: 0, width: 'clamp(130px, 10.5vw, 168px)' }}>
              <TmdbCard item={item} type={type} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
