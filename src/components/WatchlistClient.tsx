'use client'

import { useState, useEffect } from 'react'
import { getWatchlist, removeFromWatchlist } from '@/lib/watchlist'
import MediaCard from '@/components/ui/MediaCard'
import type { Movie } from '@/types/tmdb'

export default function WatchlistClient() {
  const [list, setList] = useState<Movie[]>([])

  useEffect(() => {
    setList(getWatchlist())
  }, [])

  function handleRemove(id: number) {
    removeFromWatchlist(id)
    setList((prev) => prev.filter((m) => m.id !== id))
  }

  if (list.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🎬</p>
        <p className="text-slate-400 text-lg">Tu lista está vacía</p>
        <p className="text-slate-600 text-sm mt-1">Añade películas desde su página de detalle</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {list.map((movie) => (
        <div key={movie.id} className="relative group">
          <MediaCard item={movie} type="movie" />
          <button
            onClick={() => handleRemove(movie.id)}
            className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600"
          >
            ✕ Quitar
          </button>
        </div>
      ))}
    </div>
  )
}
