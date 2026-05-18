import tmdbFetch from '@/lib/tmdb'
import type { TVShow, TVDetail, Cast, Video, Genre, PaginatedResponse } from '@/types/tmdb'

export async function getTrendingTV(timeWindow: 'day' | 'week' = 'week') {
  return tmdbFetch<PaginatedResponse<TVShow>>(`/trending/tv/${timeWindow}`)
}

export async function getTopRatedTV(page = 1) {
  return tmdbFetch<PaginatedResponse<TVShow>>('/tv/top_rated', { page: String(page) })
}

export async function getOnAirTV(page = 1) {
  return tmdbFetch<PaginatedResponse<TVShow>>('/tv/on_the_air', { page: String(page) })
}

export async function getTVDetail(id: number) {
  return tmdbFetch<TVDetail>(`/tv/${id}`)
}

export async function getTVCredits(id: number) {
  const data = await tmdbFetch<{ cast: Cast[] }>(`/tv/${id}/credits`)
  return data.cast.slice(0, 10)
}

export async function getTVVideos(id: number) {
  const data = await tmdbFetch<{ results: Video[] }>(`/tv/${id}/videos`)
  return data.results.filter((v) => v.site === 'YouTube' && v.type === 'Trailer')
}

export async function searchTV(query: string, page = 1) {
  return tmdbFetch<PaginatedResponse<TVShow>>('/search/tv', { query, page: String(page) })
}

export async function getTVGenres() {
  const data = await tmdbFetch<{ genres: Genre[] }>('/genre/tv/list')
  return data.genres
}
