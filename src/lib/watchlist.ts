import type { Movie } from '@/types/tmdb'

const KEY = 'cinescope_watchlist'

export function getWatchlist(): Movie[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function addToWatchlist(movie: Movie): void {
  const list = getWatchlist()
  if (!list.find((m) => m.id === movie.id)) {
    localStorage.setItem(KEY, JSON.stringify([...list, movie]))
  }
}

export function removeFromWatchlist(id: number): void {
  const list = getWatchlist().filter((m) => m.id !== id)
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function isInWatchlist(id: number): boolean {
  return getWatchlist().some((m) => m.id === id)
}
