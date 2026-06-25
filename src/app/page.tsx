export const revalidate = 3600

import { getTrendingMovies, getTrendingTV, discoverMovies, discoverTV, getTopRatedMovies, getTopRatedTV } from '@/services/tmdb'
import TmdbCarousel from '@/components/TmdbCarousel'
import TmdbHero from '@/components/TmdbHero'

export default async function HomePage() {
  const [
    trending,
    trendingTV,
    scifiMovies,
    thrillerMovies,
    classicMovies,
    crimeTV,
    comedyTV,
    topMovies,
    topTV,
  ] = await Promise.all([
    getTrendingMovies(),
    getTrendingTV(),
    discoverMovies({ with_genres: '878', sort_by: 'popularity.desc', 'vote_count.gte': '100' }),
    discoverMovies({ with_genres: '53', sort_by: 'popularity.desc', 'vote_count.gte': '100' }),
    discoverMovies({ sort_by: 'vote_average.desc', 'vote_count.gte': '5000', 'primary_release_date.lte': '2000-12-31' }),
    discoverTV({ with_genres: '80', sort_by: 'popularity.desc', 'vote_count.gte': '100' }),
    discoverTV({ with_genres: '35', sort_by: 'popularity.desc', 'vote_count.gte': '100' }),
    getTopRatedMovies(),
    getTopRatedTV(),
  ])

  const heroItems = trending.filter(m => m.backdrop_path).slice(0, 6)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <TmdbHero items={heroItems} type="movie" />

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28, paddingBottom: 56, display: 'flex', flexDirection: 'column', gap: 36 }}>

        <TmdbCarousel items={trending.slice(0, 12)} title="🔥 En tendencia esta semana" subtitle="Lo más visto ahora mismo" type="movie" />

        <TmdbCarousel items={trendingTV.slice(0, 12)} title="📺 Series en tendencia" subtitle="Los shows del momento" type="tv" />

        <TmdbCarousel items={topMovies.slice(0, 12)} title="⭐ Las mejores películas de la historia" subtitle="Mejor valoradas por la comunidad" type="movie" />

        <TmdbCarousel items={topTV.slice(0, 12)} title="🏅 Las mejores series de la historia" subtitle="Las series más aclamadas" type="tv" />

        <TmdbCarousel items={scifiMovies.results.filter(m => m.poster_path).slice(0, 12)} title="🚀 Ciencia Ficción" type="movie" />

        <TmdbCarousel items={thrillerMovies.results.filter(m => m.poster_path).slice(0, 12)} title="🔪 Thriller & Suspense" type="movie" />

        <TmdbCarousel items={classicMovies.results.filter(m => m.poster_path).slice(0, 12)} title="🏆 Clásicos del cine" subtitle="Las obras maestras de todos los tiempos" type="movie" />

        <TmdbCarousel items={crimeTV.results.filter(m => m.poster_path).slice(0, 12)} title="🔍 Crimen & Misterio" type="tv" />

        <TmdbCarousel items={comedyTV.results.filter(m => m.poster_path).slice(0, 12)} title="😂 Comedia" type="tv" />

      </div>
    </div>
  )
}
