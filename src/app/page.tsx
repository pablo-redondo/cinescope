import { omdbFetch } from '@/lib/omdb'
import { getMoviesByIds, normalizeDetail as normalizeMovie } from '@/services/movies'
import { getTVByIds, normalizeDetail as normalizeTV } from '@/services/tv'
import { getTrendingMovies, getTrendingTV } from '@/services/tmdb'
import {
  FEATURED_MOVIE_IDS,
  CURATED_MOVIES,
  CURATED_CLASSIC_MOVIES,
  CURATED_SCIFI_MOVIES,
  CURATED_TV,
  CURATED_CRIME_TV,
  CURATED_COMEDY_TV,
} from '@/lib/curated'
import MediaCarousel from '@/components/ui/MediaCarousel'
import TmdbCarousel from '@/components/TmdbCarousel'
import HeroCarousel from '@/components/HeroCarousel'
import type { OmdbDetail } from '@/types/omdb'

export default async function HomePage() {
  const featuredRaw = await Promise.allSettled(
    FEATURED_MOVIE_IDS.map(id => omdbFetch<OmdbDetail>({ i: id, plot: 'full' }))
  )
  const featuredMovies = featuredRaw
    .filter((r): r is PromiseFulfilledResult<OmdbDetail> => r.status === 'fulfilled' && r.value.Response === 'True')
    .map(r => r.value)

  const [popular, classics, scifi, tv, crimeTv, comedyTv, trendingMovies, trendingTV] = await Promise.all([
    getMoviesByIds(CURATED_MOVIES),
    getMoviesByIds(CURATED_CLASSIC_MOVIES),
    getMoviesByIds(CURATED_SCIFI_MOVIES),
    getTVByIds(CURATED_TV),
    getTVByIds(CURATED_CRIME_TV),
    getTVByIds(CURATED_COMEDY_TV),
    getTrendingMovies(),
    getTrendingTV(),
  ])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <HeroCarousel movies={featuredMovies} />

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28, paddingBottom: 56, display: 'flex', flexDirection: 'column', gap: 36 }}>

        {trendingMovies.length > 0 && (
          <TmdbCarousel
            items={trendingMovies}
            title="🔥 En tendencia esta semana"
            subtitle="Lo más visto ahora mismo"
            type="movie"
          />
        )}

        <MediaCarousel items={popular.map(normalizeMovie)} title="⭐ Películas populares" subtitle="Los títulos más vistos del momento" />

        {trendingTV.length > 0 && (
          <TmdbCarousel
            items={trendingTV}
            title="📺 Series en tendencia"
            subtitle="Los shows del momento"
            type="tv"
          />
        )}

        <MediaCarousel items={tv.map(normalizeTV)} title="🏅 Series imprescindibles" subtitle="Las mejores series de todos los tiempos" />
        <MediaCarousel items={scifi.map(normalizeMovie)} title="🚀 Ciencia Ficción" />
        <MediaCarousel items={classics.map(normalizeMovie)} title="🏆 Clásicos del cine" subtitle="Historia del séptimo arte" />
        <MediaCarousel items={crimeTv.map(normalizeTV)} title="🔍 Crimen & Misterio" />
        <MediaCarousel items={comedyTv.map(normalizeTV)} title="😂 Comedia" />

      </div>

    </div>
  )
}
