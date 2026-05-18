'use client'

import { useState, useEffect } from 'react'
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '@/lib/watchlist'
import type { Movie } from '@/types/tmdb'

export default function WatchlistButton({ movie }: { movie: Movie }) {
  const [inList, setInList] = useState(false)

  useEffect(() => {
    setInList(isInWatchlist(movie.id))
  }, [movie.id])

  function toggle() {
    if (inList) {
      removeFromWatchlist(movie.id)
      setInList(false)
    } else {
      addToWatchlist(movie)
      setInList(true)
    }
  }

  return (
    <button
      onClick={toggle}
      className={`font-semibold px-5 py-2.5 rounded-full text-sm transition-all cursor-pointer border ${
        inList
          ? 'bg-white text-black border-white hover:bg-slate-200'
          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
      }`}
    >
      {inList ? '✓ En mi lista' : '+ Mi lista'}
    </button>
  )
}
