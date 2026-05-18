import { getTrending } from '@/services/movies'
import { getTrendingTV } from '@/services/tv'
import MediaGrid from '@/components/ui/MediaGrid'
import HeroBanner from '@/components/HeroBanner'

export default async function HomePage() {
  const [trendingMovies, trendingTV] = await Promise.all([
    getTrending('week'),
    getTrendingTV('week'),
  ])

  const hero = trendingMovies.results[0]

  return (
    <div>
      <HeroBanner movie={hero} />
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        <MediaGrid
          items={trendingMovies.results.slice(1, 11)}
          type="movie"
          title="🔥 Películas en tendencia"
        />
        <MediaGrid
          items={trendingTV.results.slice(0, 10)}
          type="tv"
          title="📺 Series en tendencia"
        />
      </div>
    </div>
  )
}
