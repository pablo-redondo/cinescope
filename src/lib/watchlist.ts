import type { OmdbDetail } from '@/types/omdb'

const KEY = 'lasala_watchlist'

export function getWatchlist(): OmdbDetail[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function addToWatchlist(movie: OmdbDetail): void {
  const list = getWatchlist()
  if (!list.find((m) => m.imdbID === movie.imdbID)) {
    localStorage.setItem(KEY, JSON.stringify([...list, movie]))
  }
}

export function removeFromWatchlist(id: string): void {
  const list = getWatchlist().filter((m) => m.imdbID !== id)
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function isInWatchlist(id: string): boolean {
  return getWatchlist().some((m) => m.imdbID === id)
}
