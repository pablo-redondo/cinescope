import { getTrendingTV, getTopRatedTV, getOnAirTV } from '@/services/tv'
import MediaGrid from '@/components/ui/MediaGrid'

export default async function TVPage() {
  const [trending, topRated, onAir] = await Promise.all([
    getTrendingTV('week'),
    getTopRatedTV(),
    getOnAirTV(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
      <h1 className="text-3xl font-bold text-white">Series</h1>
      <MediaGrid items={trending.results.slice(0, 10)} type="tv" title="🔥 En tendencia" />
      <MediaGrid items={onAir.results.slice(0, 10)} type="tv" title="📺 En emisión ahora" />
      <MediaGrid items={topRated.results.slice(0, 10)} type="tv" title="⭐ Mejor valoradas" />
    </div>
  )
}
