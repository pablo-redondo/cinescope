import { omdbFetch } from '@/lib/omdb'
import { getMoviesByIds, normalizeDetail as normalizeMovie } from '@/services/movies'
import { getTVByIds, normalizeDetail as normalizeTV } from '@/services/tv'
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
import HeroCarousel from '@/components/HeroCarousel'
import type { OmdbDetail } from '@/types/omdb'

export default async function HomePage() {
  const [featuredMovies, popular, classics, scifi, tv, crimeTv, comedyTv] = await Promise.all([
    Promise.all(FEATURED_MOVIE_IDS.map(id => omdbFetch<OmdbDetail>({ i: id, plot: 'full' }))),
    getMoviesByIds(CURATED_MOVIES),
    getMoviesByIds(CURATED_CLASSIC_MOVIES),
    getMoviesByIds(CURATED_SCIFI_MOVIES),
    getTVByIds(CURATED_TV),
    getTVByIds(CURATED_CRIME_TV),
    getTVByIds(CURATED_COMEDY_TV),
  ])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <HeroCarousel movies={featuredMovies} />

      {/* Carruseles — separador sutil con borde top */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28, paddingBottom: 56, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <MediaCarousel items={popular.map(normalizeMovie)} title="🔥 Películas populares"     subtitle="Los títulos más vistos del momento" />
        <MediaCarousel items={tv.map(normalizeTV)}          title="📺 Series imprescindibles" subtitle="Las mejores series de todos los tiempos" />
        <MediaCarousel items={scifi.map(normalizeMovie)}    title="🚀 Ciencia Ficción"        />
        <MediaCarousel items={classics.map(normalizeMovie)} title="🏆 Clásicos del cine"      subtitle="Historia del séptimo arte" />
        <MediaCarousel items={crimeTv.map(normalizeTV)}     title="🔍 Crimen & Misterio"      />
        <MediaCarousel items={comedyTv.map(normalizeTV)}    title="😂 Comedia"                />
      </div>

    </div>
  )
}
