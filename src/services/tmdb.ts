import tmdbFetch, { getPosterUrl, getBackdropUrl } from '@/lib/tmdb'

// ─── Types ─────────────────────────────────────────────────────────────────

export type TmdbCastMember = {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export type TmdbCrewMember = {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export type TmdbMovieResult = {
  id: number
  title?: string
  name?: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count?: number
  release_date?: string
  first_air_date?: string
  overview: string
  genre_ids: number[]
  imdb_id?: string | null
  media_type?: 'movie' | 'tv' | 'person'
}

export type TmdbGenre = { id: number; name: string }

export type TmdbVideoResult = {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export type TmdbReview = {
  id: string
  author: string
  author_details: { rating?: number | null; avatar_path?: string | null }
  content: string
  created_at: string
}

export type TmdbCollection = {
  id: number
  name: string
  overview?: string
  poster_path: string | null
  backdrop_path: string | null
  parts?: TmdbMovieResult[]
}

export type TmdbTVSeason = {
  id: number
  name: string
  season_number: number
  episode_count: number
  air_date: string | null
  poster_path: string | null
  overview: string
}

export type TmdbPersonDetail = {
  id: number
  name: string
  biography: string
  birthday: string | null
  deathday: string | null
  place_of_birth: string | null
  profile_path: string | null
  known_for_department: string
  imdb_id?: string | null
}

export type TmdbPersonCredit = TmdbMovieResult & {
  character?: string
  job?: string
  media_type: 'movie' | 'tv'
}

export type TmdbFullMovieDetail = {
  id: number
  imdb_id: string | null
  title: string
  original_title: string
  tagline: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  release_date: string
  runtime: number | null
  status: string
  budget: number
  revenue: number
  genres: TmdbGenre[]
  belongs_to_collection: { id: number; name: string; poster_path: string | null; backdrop_path: string | null } | null
  production_companies: { id: number; name: string; logo_path: string | null }[]
  spoken_languages: { name: string; english_name: string }[]
  credits: { cast: TmdbCastMember[]; crew: TmdbCrewMember[] }
  videos: { results: TmdbVideoResult[] }
  recommendations: { results: TmdbMovieResult[] }
  similar: { results: TmdbMovieResult[] }
  'watch/providers': { results: Record<string, WatchProviders> }
  reviews: { results: TmdbReview[] }
  keywords: { keywords: { id: number; name: string }[] }
}

export type TmdbFullTVDetail = {
  id: number
  name: string
  original_name: string
  tagline: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  first_air_date: string
  last_air_date: string
  status: string
  number_of_seasons: number
  number_of_episodes: number
  episode_run_time: number[]
  genres: TmdbGenre[]
  seasons: TmdbTVSeason[]
  networks: { id: number; name: string; logo_path: string | null }[]
  created_by: { id: number; name: string; profile_path: string | null }[]
  production_companies: { id: number; name: string; logo_path: string | null }[]
  spoken_languages: { name: string; english_name: string }[]
  credits: { cast: TmdbCastMember[]; crew: TmdbCrewMember[] }
  videos: { results: TmdbVideoResult[] }
  recommendations: { results: TmdbMovieResult[] }
  similar: { results: TmdbMovieResult[] }
  'watch/providers': { results: Record<string, WatchProviders> }
  reviews: { results: TmdbReview[] }
  keywords: { results: { id: number; name: string }[] }
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

export type TmdbFindResult = {
  movie_results: (TmdbMovieResult & { imdb_id?: string })[]
  tv_results: (TmdbMovieResult & { imdb_id?: string })[]
}

export type TmdbDetailEnhancement = {
  tmdbId: number
  backdropUrl: string | null
  cast: TmdbCastMember[]
  trailerKey: string | null
  similar: TmdbMovieResult[]
  recommendations: TmdbMovieResult[]
  providers: WatchProviders | null
  collection: TmdbCollection | null
}

export type TmdbPersonResult = {
  id: number
  name: string
  profile_path: string | null
  known_for_department: string
  known_for: TmdbMovieResult[]
  media_type?: 'person'
}

export type MultiSearchResult = {
  movies: TmdbMovieResult[]
  tv: TmdbMovieResult[]
  people: TmdbPersonResult[]
}

// ─── Utilities ──────────────────────────────────────────────────────────────

async function safeTmdbFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
  try {
    return await tmdbFetch<T>(endpoint, params)
  } catch {
    return null
  }
}

function pickTrailer(videos: TmdbVideoResult[]): string | null {
  const youtube = videos.filter(v => v.site === 'YouTube')
  const official = youtube.find(v => v.type === 'Trailer' && v.official)
  const anyTrailer = youtube.find(v => v.type === 'Trailer')
  const teaser = youtube.find(v => v.type === 'Teaser')
  return (official ?? anyTrailer ?? teaser)?.key ?? null
}

function pickProviders(raw: Record<string, WatchProviders> | undefined): WatchProviders | null {
  if (!raw) return null
  return raw['ES'] ?? raw['US'] ?? null
}

// ─── Detail Enhancements (for OMDb-ID pages) ────────────────────────────────

export async function getMovieEnhancement(imdbId: string): Promise<TmdbDetailEnhancement | null> {
  const found = await safeTmdbFetch<TmdbFindResult>(`/find/${imdbId}`, { external_source: 'imdb_id' })
  const movie = found?.movie_results?.[0]
  if (!movie) return null

  const tmdbId = movie.id
  const detail = await safeTmdbFetch<TmdbFullMovieDetail>(
    `/movie/${tmdbId}`,
    { append_to_response: 'credits,videos,recommendations,similar,watch/providers' }
  )
  if (!detail) return null

  let collection: TmdbCollection | null = null
  if (detail.belongs_to_collection) {
    collection = await safeTmdbFetch<TmdbCollection>(`/collection/${detail.belongs_to_collection.id}`)
  }

  return {
    tmdbId,
    backdropUrl: getBackdropUrl(movie.backdrop_path ?? detail.backdrop_path, 'w1280'),
    cast: (detail.credits?.cast ?? []).slice(0, 12),
    trailerKey: pickTrailer(detail.videos?.results ?? []),
    similar: (detail.similar?.results ?? []).filter(m => m.poster_path).slice(0, 12),
    recommendations: (detail.recommendations?.results ?? []).filter(m => m.poster_path).slice(0, 12),
    providers: pickProviders(detail['watch/providers']?.results),
    collection,
  }
}

export async function getTVEnhancement(imdbId: string): Promise<TmdbDetailEnhancement | null> {
  const found = await safeTmdbFetch<TmdbFindResult>(`/find/${imdbId}`, { external_source: 'imdb_id' })
  const show = found?.tv_results?.[0]
  if (!show) return null

  const tmdbId = show.id
  const detail = await safeTmdbFetch<TmdbFullTVDetail>(
    `/tv/${tmdbId}`,
    { append_to_response: 'credits,videos,recommendations,similar,watch/providers' }
  )
  if (!detail) return null

  return {
    tmdbId,
    backdropUrl: getBackdropUrl(show.backdrop_path ?? detail.backdrop_path, 'w1280'),
    cast: (detail.credits?.cast ?? []).slice(0, 12),
    trailerKey: pickTrailer(detail.videos?.results ?? []),
    similar: (detail.similar?.results ?? []).filter(s => s.poster_path).slice(0, 12),
    recommendations: (detail.recommendations?.results ?? []).filter(s => s.poster_path).slice(0, 12),
    providers: pickProviders(detail['watch/providers']?.results),
    collection: null,
  }
}

// ─── TMDB-Native Full Detail (for Discover / TMDB ID pages) ─────────────────

export async function getTmdbMovieDetail(tmdbId: number | string): Promise<TmdbFullMovieDetail | null> {
  return safeTmdbFetch<TmdbFullMovieDetail>(
    `/movie/${tmdbId}`,
    { append_to_response: 'credits,videos,recommendations,similar,watch/providers,reviews,keywords' }
  )
}

export async function getTmdbTVDetail(tmdbId: number | string): Promise<TmdbFullTVDetail | null> {
  return safeTmdbFetch<TmdbFullTVDetail>(
    `/tv/${tmdbId}`,
    { append_to_response: 'credits,videos,recommendations,similar,watch/providers,reviews,keywords' }
  )
}

// ─── Genres ─────────────────────────────────────────────────────────────────

export async function getMovieGenres(): Promise<TmdbGenre[]> {
  const data = await safeTmdbFetch<{ genres: TmdbGenre[] }>('/genre/movie/list')
  return data?.genres ?? []
}

export async function getTVGenres(): Promise<TmdbGenre[]> {
  const data = await safeTmdbFetch<{ genres: TmdbGenre[] }>('/genre/tv/list')
  return data?.genres ?? []
}

// ─── Discover ────────────────────────────────────────────────────────────────

export type DiscoverMovieParams = {
  with_genres?: string
  sort_by?: string
  'vote_average.gte'?: string
  'vote_count.gte'?: string
  primary_release_year?: string
  with_original_language?: string
  page?: string
}

export async function discoverMovies(params: DiscoverMovieParams = {}): Promise<{ results: TmdbMovieResult[]; total_results: number; total_pages: number }> {
  const merged = { 'vote_count.gte': '50', ...params }
  const data = await safeTmdbFetch<{ results: TmdbMovieResult[]; total_results: number; total_pages: number }>('/discover/movie', merged as Record<string, string>)
  return data ?? { results: [], total_results: 0, total_pages: 0 }
}

export async function discoverTV(params: DiscoverMovieParams = {}): Promise<{ results: TmdbMovieResult[]; total_results: number; total_pages: number }> {
  const tvParams: Record<string, string> = { 'vote_count.gte': '20' }
  if (params.with_genres) tvParams.with_genres = params.with_genres
  if (params.sort_by) tvParams.sort_by = params.sort_by
  if (params['vote_average.gte']) tvParams['vote_average.gte'] = params['vote_average.gte']
  if (params.primary_release_year) tvParams.first_air_date_year = params.primary_release_year
  if (params.with_original_language) tvParams.with_original_language = params.with_original_language
  if (params.page) tvParams.page = params.page
  const data = await safeTmdbFetch<{ results: TmdbMovieResult[]; total_results: number; total_pages: number }>('/discover/tv', tvParams)
  return data ?? { results: [], total_results: 0, total_pages: 0 }
}

// ─── Curated Lists ───────────────────────────────────────────────────────────

export async function getTopRatedMovies(page = 1): Promise<TmdbMovieResult[]> {
  const data = await safeTmdbFetch<{ results: TmdbMovieResult[] }>('/movie/top_rated', { page: String(page) })
  return data?.results ?? []
}

export async function getTopRatedTV(page = 1): Promise<TmdbMovieResult[]> {
  const data = await safeTmdbFetch<{ results: TmdbMovieResult[] }>('/tv/top_rated', { page: String(page) })
  return data?.results ?? []
}

export async function getNowPlaying(): Promise<TmdbMovieResult[]> {
  const data = await safeTmdbFetch<{ results: TmdbMovieResult[] }>('/movie/now_playing', { region: 'ES' })
  return data?.results ?? []
}

export async function getUpcomingMovies(): Promise<TmdbMovieResult[]> {
  const data = await safeTmdbFetch<{ results: TmdbMovieResult[] }>('/movie/upcoming', { region: 'ES' })
  return data?.results ?? []
}

export async function getTrendingMovies(): Promise<TmdbMovieResult[]> {
  const data = await safeTmdbFetch<{ results: TmdbMovieResult[] }>('/trending/movie/week')
  return data?.results ?? []
}

export async function getTrendingTV(): Promise<TmdbMovieResult[]> {
  const data = await safeTmdbFetch<{ results: TmdbMovieResult[] }>('/trending/tv/week')
  return data?.results ?? []
}

// ─── Person ──────────────────────────────────────────────────────────────────

export async function getPersonDetail(tmdbId: number | string): Promise<{
  detail: TmdbPersonDetail
  credits: { cast: TmdbPersonCredit[]; crew: TmdbPersonCredit[] }
  images: { profiles: { file_path: string }[] }
} | null> {
  const [detail, credits, images] = await Promise.all([
    safeTmdbFetch<TmdbPersonDetail>(`/person/${tmdbId}`),
    safeTmdbFetch<{ cast: TmdbPersonCredit[]; crew: TmdbPersonCredit[] }>(`/person/${tmdbId}/combined_credits`),
    safeTmdbFetch<{ profiles: { file_path: string }[] }>(`/person/${tmdbId}/images`),
  ])
  if (!detail) return null
  return {
    detail,
    credits: credits ?? { cast: [], crew: [] },
    images: images ?? { profiles: [] },
  }
}

// ─── Collection ──────────────────────────────────────────────────────────────

export async function getCollection(id: number | string): Promise<TmdbCollection | null> {
  return safeTmdbFetch<TmdbCollection>(`/collection/${id}`)
}

// ─── Search ──────────────────────────────────────────────────────────────────

export async function multiSearch(query: string): Promise<MultiSearchResult> {
  type RawResult = (TmdbMovieResult | TmdbPersonResult) & { media_type: 'movie' | 'tv' | 'person' }
  const data = await safeTmdbFetch<{ results: RawResult[] }>('/search/multi', { query })
  const results = data?.results ?? []
  return {
    movies: results.filter(r => r.media_type === 'movie') as TmdbMovieResult[],
    tv: results.filter(r => r.media_type === 'tv') as TmdbMovieResult[],
    people: results.filter(r => r.media_type === 'person') as TmdbPersonResult[],
  }
}

export async function searchTmdbMovies(query: string): Promise<TmdbMovieResult[]> {
  const data = await safeTmdbFetch<{ results: TmdbMovieResult[] }>('/search/movie', { query })
  return data?.results ?? []
}

export async function searchTmdbTV(query: string): Promise<TmdbMovieResult[]> {
  const data = await safeTmdbFetch<{ results: TmdbMovieResult[] }>('/search/tv', { query })
  return data?.results ?? []
}

export { getPosterUrl, getBackdropUrl }
