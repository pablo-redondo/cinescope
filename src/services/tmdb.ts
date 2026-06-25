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
  imdb_id?: string | null
}

export type TmdbFindResult = {
  movie_results: (TmdbMovieResult & { imdb_id?: string })[]
  tv_results: (TmdbMovieResult & { imdb_id?: string })[]
}

export type WatchProvider = {
  provider_id: number
  provider_name: string
  logo_path: string
}

export type WatchProviders = {
  flatrate?: WatchProvider[]
  rent?: WatchProvider[]
  buy?: WatchProvider[]
  link?: string
}

export type TmdbDetailEnhancement = {
  tmdbId: number
  backdropUrl: string | null
  cast: TmdbCastMember[]
  similar: TmdbMovieResult[]
  providers: WatchProviders | null
}

async function safeTmdbFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
  try {
    return await tmdbFetch<T>(endpoint, params)
  } catch {
    return null
  }
}

async function fetchWatchProviders(mediaType: 'movie' | 'tv', tmdbId: number): Promise<WatchProviders | null> {
  type ProvidersResponse = { results: Record<string, WatchProviders> }
  const raw = await safeTmdbFetch<ProvidersResponse>(`/${mediaType}/${tmdbId}/watch/providers`)
  if (!raw?.results) return null
  // Prefer Spain, fallback to US
  return raw.results['ES'] ?? raw.results['US'] ?? null
}

export async function getMovieEnhancement(imdbId: string): Promise<TmdbDetailEnhancement | null> {
  const found = await safeTmdbFetch<TmdbFindResult>(`/find/${imdbId}`, { external_source: 'imdb_id' })
  const movie = found?.movie_results?.[0]
  if (!movie) return null

  const tmdbId = movie.id
  const [creditsRaw, similarRaw, providers] = await Promise.all([
    safeTmdbFetch<{ cast: TmdbCastMember[] }>(`/movie/${tmdbId}/credits`),
    safeTmdbFetch<{ results: TmdbMovieResult[] }>(`/movie/${tmdbId}/similar`),
    fetchWatchProviders('movie', tmdbId),
  ])

  return {
    tmdbId,
    backdropUrl: getBackdropUrl(movie.backdrop_path, 'w1280'),
    cast: (creditsRaw?.cast ?? []).slice(0, 8),
    similar: (similarRaw?.results ?? []).filter(m => m.poster_path).slice(0, 12),
    providers,
  }
}

export async function getTVEnhancement(imdbId: string): Promise<TmdbDetailEnhancement | null> {
  const found = await safeTmdbFetch<TmdbFindResult>(`/find/${imdbId}`, { external_source: 'imdb_id' })
  const show = found?.tv_results?.[0]
  if (!show) return null

  const tmdbId = show.id
  const [creditsRaw, similarRaw, providers] = await Promise.all([
    safeTmdbFetch<{ cast: TmdbCastMember[] }>(`/tv/${tmdbId}/credits`),
    safeTmdbFetch<{ results: TmdbMovieResult[] }>(`/tv/${tmdbId}/similar`),
    fetchWatchProviders('tv', tmdbId),
  ])

  return {
    tmdbId,
    backdropUrl: getBackdropUrl(show.backdrop_path, 'w1280'),
    cast: (creditsRaw?.cast ?? []).slice(0, 8),
    similar: (similarRaw?.results ?? []).filter(s => s.poster_path).slice(0, 12),
    providers,
  }
}

async function enrichWithImdbId(
  items: TmdbMovieResult[],
  mediaType: 'movie' | 'tv',
): Promise<TmdbMovieResult[]> {
  const ids = await Promise.all(
    items.map(item =>
      safeTmdbFetch<{ imdb_id?: string | null }>(`/${mediaType}/${item.id}/external_ids`)
    )
  )
  return items.map((item, i) => ({ ...item, imdb_id: ids[i]?.imdb_id ?? null }))
}

export async function getTrendingMovies(): Promise<TmdbMovieResult[]> {
  const data = await safeTmdbFetch<{ results: TmdbMovieResult[] }>('/trending/movie/week')
  const results = data?.results ?? []
  return enrichWithImdbId(results, 'movie')
}

export async function getTrendingTV(): Promise<TmdbMovieResult[]> {
  const data = await safeTmdbFetch<{ results: TmdbMovieResult[] }>('/trending/tv/week')
  const results = data?.results ?? []
  return enrichWithImdbId(results, 'tv')
}

export { getPosterUrl, getBackdropUrl }
