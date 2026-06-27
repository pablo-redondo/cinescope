'use client'

import { useState, useEffect } from 'react'
import { isInTmdbWatchlist, addToTmdbWatchlist, removeFromTmdbWatchlist } from '@/lib/tmdb-watchlist'

type Props = {
  tmdbId: number
  type: 'movie' | 'tv'
  title: string
  posterPath: string | null
  year: string
  rating: number | null
}

export default function TmdbWatchlistButton({ tmdbId, type, title, posterPath, year, rating }: Props) {
  const [inList, setInList] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    setInList(isInTmdbWatchlist(tmdbId, type))
  }, [tmdbId, type])

  function toggle() {
    setAnimating(true)
    setTimeout(() => setAnimating(false), 300)
    if (inList) {
      removeFromTmdbWatchlist(tmdbId, type)
      setInList(false)
    } else {
      addToTmdbWatchlist({ tmdbId, type, title, posterPath, year, rating })
      setInList(true)
    }
  }

  return (
    <button
      onClick={toggle}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: inList ? 'rgba(239,68,68,0.15)' : 'rgba(212,152,42,0.08)',
        border: `1px solid ${inList ? 'rgba(239,68,68,0.4)' : 'rgba(212,152,42,0.2)'}`,
        color: inList ? '#fca5a5' : '#f0ece3',
        fontSize: 13, fontWeight: 700,
        padding: '10px 18px', borderRadius: 10, cursor: 'pointer',
        transform: animating ? 'scale(0.94)' : 'scale(1)',
        transition: 'all .2s ease',
      }}
    >
      <span style={{ fontSize: 15 }}>{inList ? '❤️' : '🤍'}</span>
      {inList ? 'En mi lista' : 'Añadir a mi lista'}
    </button>
  )
}
