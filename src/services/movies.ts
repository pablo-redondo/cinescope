import tmdbFetch from '@/lib/tmdb'
import type { Movie, MovieDetail, Cast, Video, Genre, PaginatedResponse } from '@/types/tmdb'

export async function getTrending(timeWindow: 'day' | 'week' = 'week') {
  return tmdbFetch<PaginatedResponse<Movie>>(`/trending/movie/${timeWindow}`)
}

export async function getNowPlaying(page = 1) {
  return tmdbFetch<PaginatedResponse<Movie>>('/movie/now_playing', { page: String(page) })
}

export async function getTopRated(page = 1) {
  return tmdbFetch<PaginatedResponse<Movie>>('/movie/top_rated', { page: String(page) })
}

export async function getUpcoming(page = 1) {
  return tmdbFetch<PaginatedResponse<Movie>>('/movie/upcoming', { page: String(page) })
}

export async function getMovieDetail(id: number) {
  return tmdbFetch<MovieDetail>(`/movie/${id}`)
}

export async function getMovieCredits(id: number) {
  const data = await tmdbFetch<{ cast: Cast[] }>(`/movie/${id}/credits`)
  return data.cast.slice(0, 10)
}

export async function getMovieVideos(id: number) {
  const data = await tmdbFetch<{ results: Video[] }>(`/movie/${id}/videos`)
  return data.results.filter((v) => v.site === 'YouTube' && v.type === 'Trailer')
}

export async function getSimilarMovies(id: number) {
  return tmdbFetch<PaginatedResponse<Movie>>(`/movie/${id}/similar`)
}

export async function searchMovies(query: string, page = 1) {
  return tmdbFetch<PaginatedResponse<Movie>>('/search/movie', { query, page: String(page) })
}

export async function discoverMovies(params: {
  genre?: string
  year?: string
  sortBy?: string
  page?: number
}) {
  return tmdbFetch<PaginatedResponse<Movie>>('/discover/movie', {
    with_genres: params.genre || '',
    primary_release_year: params.year || '',
    sort_by: params.sortBy || 'popularity.desc',
    page: String(params.page || 1),
  })
}

export async function getMovieGenres() {
  const data = await tmdbFetch<{ genres: Genre[] }>('/genre/movie/list')
  return data.genres
}
