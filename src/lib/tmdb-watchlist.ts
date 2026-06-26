'use client'

export type TmdbWatchlistItem = {
  tmdbId: number
  type: 'movie' | 'tv'
  title: string
  posterPath: string | null
  year: string
  rating: number | null
  addedAt: number
}

const STORAGE_KEY = 'tmdb_watchlist'

function load(): TmdbWatchlistItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(items: TmdbWatchlistItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getTmdbWatchlist(): TmdbWatchlistItem[] {
  return load()
}

export function isInTmdbWatchlist(tmdbId: number, type: 'movie' | 'tv'): boolean {
  return load().some(i => i.tmdbId === tmdbId && i.type === type)
}

export function addToTmdbWatchlist(item: Omit<TmdbWatchlistItem, 'addedAt'>) {
  const list = load().filter(i => !(i.tmdbId === item.tmdbId && i.type === item.type))
  save([{ ...item, addedAt: Date.now() }, ...list])
}

export function removeFromTmdbWatchlist(tmdbId: number, type: 'movie' | 'tv') {
  save(load().filter(i => !(i.tmdbId === tmdbId && i.type === type)))
}
