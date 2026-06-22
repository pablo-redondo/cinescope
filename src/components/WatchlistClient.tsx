'use client'

import { useState, useEffect } from 'react'
import { getWatchlist, removeFromWatchlist } from '@/lib/watchlist'
import MediaCard from '@/components/ui/MediaCard'
import { normalizePoster } from '@/lib/omdb'
import type { OmdbDetail, MediaItem } from '@/types/omdb'

function normalize(d: OmdbDetail): MediaItem {
  return {
    imdbID: d.imdbID,
    title: d.Title,
    year: d.Year,
    type: d.Type,
    poster: normalizePoster(d.Poster),
    rating: d.imdbRating !== 'N/A' ? d.imdbRating : undefined,
  }
}

export default function WatchlistClient() {
  const [list, setList] = useState<OmdbDetail[]>([])

  useEffect(() => {
    setList(getWatchlist())
  }, [])

  function handleRemove(id: string) {
    removeFromWatchlist(id)
    setList((prev) => prev.filter((m) => m.imdbID !== id))
  }

  if (list.length === 0) {
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
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: 20,
    }}>
      {list.map((item) => (
        <div key={item.imdbID} style={{ position: 'relative' }} className="group">
          <MediaCard item={normalize(item)} />
          <button
            onClick={() => handleRemove(item.imdbID)}
            style={{
              position: 'absolute', top: 8, left: 8,
              background: 'rgba(239,68,68,0.9)', backdropFilter: 'blur(8px)',
              color: '#fff', fontSize: 11, fontWeight: 700,
              padding: '4px 10px', borderRadius: 8,
              border: 'none', cursor: 'pointer',
              opacity: 0, transition: 'opacity .2s',
            }}
            className="group-hover:opacity-100-btn"
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
          >
            ✕ Quitar
          </button>
        </div>
      ))}
    </div>
  )
}
