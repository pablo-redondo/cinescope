'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getWatchlist, removeFromWatchlist } from '@/lib/watchlist'
import { getTmdbWatchlist, removeFromTmdbWatchlist } from '@/lib/tmdb-watchlist'
import { getPosterUrl } from '@/services/tmdb'
import type { TmdbWatchlistItem } from '@/lib/tmdb-watchlist'
import type { OmdbDetail } from '@/types/omdb'

function TmdbWatchlistCard({ item, onRemove }: { item: TmdbWatchlistItem; onRemove: () => void }) {
  const poster = getPosterUrl(item.posterPath, 'w342')
  return (
    <div style={{ position: 'relative' }}
      onMouseEnter={e => { const btn = e.currentTarget.querySelector<HTMLButtonElement>('[data-remove]'); if (btn) btn.style.opacity = '1' }}
      onMouseLeave={e => { const btn = e.currentTarget.querySelector<HTMLButtonElement>('[data-remove]'); if (btn) btn.style.opacity = '0' }}
    >
      <Link href={`/tmdb/${item.type}/${item.tmdbId}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ position: 'relative', aspectRatio: '2/3', borderRadius: 12, overflow: 'hidden', background: 'var(--surface2)', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
          {poster
            ? <Image src={poster} alt={item.title} fill sizes="(max-width: 640px) 45vw, 200px" style={{ objectFit: 'cover' }} />
            : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>{item.type === 'tv' ? '📺' : '🎬'}</div>
          }
          {item.rating && (
            <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.85)', color: 'var(--accent)', fontSize: 11, fontWeight: 800, padding: '4px 8px', borderRadius: 8, border: '1px solid rgba(245,197,24,0.2)' }}>
              ★ {item.rating.toFixed(1)}
            </div>
          )}
          <div style={{ position: 'absolute', top: 8, left: 8, background: item.type === 'tv' ? 'rgba(99,102,241,0.85)' : 'rgba(239,68,68,0.85)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 7px', borderRadius: 6 }}>
            {item.type === 'tv' ? 'SERIE' : 'PEL.'}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{item.year}</p>
        </div>
      </Link>
      <button data-remove onClick={onRemove} style={{
        position: 'absolute', top: 8, left: 8,
        background: 'rgba(239,68,68,0.9)', color: '#fff', fontSize: 11, fontWeight: 700,
        padding: '4px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
        opacity: 0, transition: 'opacity .2s',
      }}>✕ Quitar</button>
    </div>
  )
}

function OmdbWatchlistCard({ item, onRemove }: { item: OmdbDetail; onRemove: () => void }) {
  const poster = item.Poster && item.Poster !== 'N/A' ? item.Poster : null
  return (
    <div style={{ position: 'relative' }}
      onMouseEnter={e => { const btn = e.currentTarget.querySelector<HTMLButtonElement>('[data-remove]'); if (btn) btn.style.opacity = '1' }}
      onMouseLeave={e => { const btn = e.currentTarget.querySelector<HTMLButtonElement>('[data-remove]'); if (btn) btn.style.opacity = '0' }}
    >
      <Link href={`/${item.Type === 'series' ? 'tv' : 'movie'}/${item.imdbID}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ position: 'relative', aspectRatio: '2/3', borderRadius: 12, overflow: 'hidden', background: 'var(--surface2)', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
          {poster
            ? <Image src={poster} alt={item.Title} fill sizes="(max-width: 640px) 45vw, 200px" style={{ objectFit: 'cover' }} />
            : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🎬</div>
          }
          {item.imdbRating && item.imdbRating !== 'N/A' && (
            <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.85)', color: 'var(--accent)', fontSize: 11, fontWeight: 800, padding: '4px 8px', borderRadius: 8 }}>
              ★ {item.imdbRating}
            </div>
          )}
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.Title}</p>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{item.Year}</p>
        </div>
      </Link>
      <button data-remove onClick={onRemove} style={{
        position: 'absolute', top: 8, left: 8,
        background: 'rgba(239,68,68,0.9)', color: '#fff', fontSize: 11, fontWeight: 700,
        padding: '4px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
        opacity: 0, transition: 'opacity .2s',
      }}>✕ Quitar</button>
    </div>
  )
}

export default function WatchlistClient() {
  const [tmdbList, setTmdbList] = useState<TmdbWatchlistItem[]>([])
  const [omdbList, setOmdbList] = useState<OmdbDetail[]>([])

  useEffect(() => {
    setTmdbList(getTmdbWatchlist())
    setOmdbList(getWatchlist())
  }, [])

  const total = tmdbList.length + omdbList.length

  if (total === 0) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎬</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Tu lista está vacía</h2>
        <p style={{ fontSize: 14, color: 'var(--muted)' }}>
          Añade películas y series desde su página de detalle
        </p>
      </div>
    )
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>{total} {total === 1 ? 'título guardado' : 'títulos guardados'}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 20 }}>
        {tmdbList.map(item => (
          <TmdbWatchlistCard key={`tmdb-${item.type}-${item.tmdbId}`} item={item} onRemove={() => {
            removeFromTmdbWatchlist(item.tmdbId, item.type)
            setTmdbList(prev => prev.filter(i => !(i.tmdbId === item.tmdbId && i.type === item.type)))
          }} />
        ))}
        {omdbList.map(item => (
          <OmdbWatchlistCard key={`omdb-${item.imdbID}`} item={item} onRemove={() => {
            removeFromWatchlist(item.imdbID)
            setOmdbList(prev => prev.filter(i => i.imdbID !== item.imdbID))
          }} />
        ))}
      </div>
    </div>
  )
}
