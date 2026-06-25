export type MediaType = 'movie' | 'series'

export interface OmdbSearchItem {
  imdbID: string
  Title: string
  Year: string
  Type: MediaType
  Poster: string
}

export interface OmdbDetail {
  imdbID: string
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Actors: string
  Plot: string
  Language: string
  Poster: string
  imdbRating: string
  imdbVotes: string
  Type: MediaType
  Response: 'True' | 'False'
  Error?: string
  totalSeasons?: string
  Metascore?: string
  Awards?: string
  BoxOffice?: string
  Production?: string
  Country?: string
  Writer?: string
}

export interface OmdbSearchResponse {
  Search?: OmdbSearchItem[]
  totalResults?: string
  Response: 'True' | 'False'
  Error?: string
}

export interface MediaItem {
  imdbID: string
  title: string
  year: string
  type: MediaType
  poster: string | null
  rating?: string
}
