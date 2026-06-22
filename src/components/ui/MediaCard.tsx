'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { MediaItem } from '@/types/omdb'

export default function MediaCard({ item }: { item: MediaItem }) {
  const [hovered, setHovered] = useState(false)
  const routeType = item.type === 'movie' ? 'movie' : 'tv'
  const href = `/${routeType}/${item.imdbID}`

  return (
    <Link
      href={href}
      style={{ display: 'block', textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster container */}
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

        {item.poster ? (
          <Image
            src={item.poster}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 40vw, 200px"
            style={{ objectFit: 'cover', transition: 'transform .35s ease', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 8,
            color: '#3a4060', fontSize: 32
          }}>
            🎬
            <span style={{ fontSize: 10, color: '#3a4060', letterSpacing: 1 }}>SIN IMAGEN</span>
          </div>
        )}

        {/* Rating badge */}
        {item.rating && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            display: 'flex', alignItems: 'center', gap: 3,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            color: 'var(--accent)', fontSize: 11, fontWeight: 800,
            padding: '4px 8px', borderRadius: 8,
            border: '1px solid rgba(245,197,24,0.2)',
          }}>
            ★ {item.rating}
          </div>
        )}

        {/* Type badge */}
        <div style={{
          position: 'absolute', top: 8, left: 8,
          background: item.type === 'series' ? 'rgba(99,102,241,0.85)' : 'rgba(239,68,68,0.85)',
          color: '#fff', fontSize: 9, fontWeight: 800,
          padding: '3px 7px', borderRadius: 6,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          backdropFilter: 'blur(8px)',
        }}>
          {item.type === 'series' ? 'SERIE' : 'PELÍCULA'}
        </div>

        {/* Bottom gradient */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '50%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
        }} />
      </div>

      {/* Info below */}
      <div style={{ marginTop: 10, padding: '0 2px' }}>
        <p style={{
          fontSize: 13, fontWeight: 700,
          color: hovered ? 'var(--accent)' : 'var(--text)',
          transition: 'color .2s',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          lineHeight: 1.3,
        }}>
          {item.title}
        </p>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, fontWeight: 500 }}>
          {item.year}
        </p>
      </div>
    </Link>
  )
}
