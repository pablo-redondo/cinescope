import tmdbFetch, { getPosterUrl, getBackdropUrl } from '@/lib/tmdb'

export type TmdbCastMember = {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export type TmdbMovieResult = {
  id: number
  title?: string
  name?: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  release_date?: string
  first_air_date?: string
  overview: string
  genre_ids: number[]
}

export type TmdbFindResult = {
  movie_results: (TmdbMovieResult & { imdb_id?: string })[]
  tv_results: (TmdbMovieResult & { imdb_id?: string })[]
}

export type TmdbDetailEnhancement = {
  tmdbId: number
  backdropUrl: string | null
  cast: TmdbCastMember[]
  similar: TmdbMovieResult[]
}

async function safeTmdbFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
  try {
    return await tmdbFetch<T>(endpoint, params)
  } catch {
    return null
  }
}

export async function getMovieEnhancement(imdbId: string): Promise<TmdbDetailEnhancement | null> {
  const found = await safeTmdbFetch<TmdbFindResult>(`/find/${imdbId}`, { external_source: 'imdb_id' })
  const movie = found?.movie_results?.[0]
  if (!movie) return null

  const tmdbId = movie.id
  const [creditsRaw, similarRaw] = await Promise.all([
    safeTmdbFetch<{ cast: TmdbCastMember[] }>(`/movie/${tmdbId}/credits`),
    safeTmdbFetch<{ results: TmdbMovieResult[] }>(`/movie/${tmdbId}/similar`),
  ])

  return {
    tmdbId,
    backdropUrl: getBackdropUrl(movie.backdrop_path, 'w1280'),
    cast: (creditsRaw?.cast ?? []).slice(0, 8),
    similar: (similarRaw?.results ?? []).filter(m => m.poster_path).slice(0, 12),
  }
}

export async function getTVEnhancement(imdbId: string): Promise<TmdbDetailEnhancement | null> {
  const found = await safeTmdbFetch<TmdbFindResult>(`/find/${imdbId}`, { external_source: 'imdb_id' })
  const show = found?.tv_results?.[0]
  if (!show) return null

  const tmdbId = show.id
  const [creditsRaw, similarRaw] = await Promise.all([
    safeTmdbFetch<{ cast: TmdbCastMember[] }>(`/tv/${tmdbId}/credits`),
    safeTmdbFetch<{ results: TmdbMovieResult[] }>(`/tv/${tmdbId}/similar`),
  ])

  return {
    tmdbId,
    backdropUrl: getBackdropUrl(show.backdrop_path, 'w1280'),
    cast: (creditsRaw?.cast ?? []).slice(0, 8),
    similar: (similarRaw?.results ?? []).filter(s => s.poster_path).slice(0, 12),
  }
}

export async function getTrendingMovies(): Promise<TmdbMovieResult[]> {
  const data = await safeTmdbFetch<{ results: TmdbMovieResult[] }>('/trending/movie/week')
  return data?.results ?? []
}

export async function getTrendingTV(): Promise<TmdbMovieResult[]> {
  const data = await safeTmdbFetch<{ results: TmdbMovieResult[] }>('/trending/tv/week')
  return data?.results ?? []
}

export { getPosterUrl, getBackdropUrl }
