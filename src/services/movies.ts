import { omdbFetch, normalizePoster } from '@/lib/omdb'
import type { OmdbDetail, OmdbSearchItem, OmdbSearchResponse, MediaItem } from '@/types/omdb'

export function normalizeDetail(d: OmdbDetail): MediaItem {
  return {
    imdbID: d.imdbID,
    title: d.Title,
    year: d.Year,
    type: 'movie',
    poster: normalizePoster(d.Poster),
    rating: d.imdbRating !== 'N/A' ? d.imdbRating : undefined,
  }
}

export function normalizeSearchItem(item: OmdbSearchItem): MediaItem {
  return {
    imdbID: item.imdbID,
    title: item.Title,
    year: item.Year,
    type: 'movie',
    poster: normalizePoster(item.Poster),
  }
}

export async function getMoviesByIds(ids: string[]): Promise<OmdbDetail[]> {
  const results = await Promise.all(
    ids.map((id) => omdbFetch<OmdbDetail>({ i: id, plot: 'short' }))
  )
  return results.filter((r) => r.Response === 'True')
}

export async function getMovieDetail(id: string): Promise<OmdbDetail | null> {
  const data = await omdbFetch<OmdbDetail>({ i: id, plot: 'full' })
  return data.Response === 'True' ? data : null
}

export async function searchMovies(query: string, page = 1): Promise<OmdbSearchResponse> {
  return omdbFetch<OmdbSearchResponse>({ s: query, type: 'movie', page: String(page) })
}
