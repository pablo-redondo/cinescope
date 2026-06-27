'use client'

import { useState, useEffect } from 'react'
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '@/lib/watchlist'
import type { OmdbDetail } from '@/types/omdb'

export default function WatchlistButton({ movie }: { movie: OmdbDetail }) {
  const [inList, setInList] = useState(false)

  useEffect(() => {
    setInList(isInWatchlist(movie.imdbID))
  }, [movie.imdbID])

  function toggle() {
    if (inList) {
      removeFromWatchlist(movie.imdbID)
      setInList(false)
    } else {
      addToWatchlist(movie)
      setInList(true)
    }
  }

  return (
    <button
      onClick={toggle}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: inList ? '#d4982a' : 'rgba(212,152,42,0.1)',
        color: inList ? '#0d0b08' : '#f0ece3',
        border: inList ? '1px solid #d4982a' : '1px solid rgba(212,152,42,0.25)',
        fontWeight: 700, fontSize: 13,
        padding: '11px 22px', borderRadius: 10,
        cursor: 'pointer', transition: 'all .2s',
      }}
    >
      {inList ? '✓ En mi lista' : '+ Mi lista'}
    </button>
  )
}
