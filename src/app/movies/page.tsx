import { getNowPlaying, getTopRated, getUpcoming, getMovieGenres } from '@/services/movies'
import MediaGrid from '@/components/ui/MediaGrid'
import GenreFilter from '@/components/GenreFilter'

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; sort?: string }>
}) {
  const { genre, sort } = await searchParams

  const [nowPlaying, topRated, upcoming, genres] = await Promise.all([
    getNowPlaying(),
    getTopRated(),
    getUpcoming(),
    getMovieGenres(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Películas</h1>
        <GenreFilter genres={genres} />
      </div>

      <MediaGrid items={nowPlaying.results.slice(0, 10)} type="movie" title="🎬 En cines ahora" />
      <MediaGrid items={topRated.results.slice(0, 10)} type="movie" title="⭐ Mejor valoradas" />
      <MediaGrid items={upcoming.results.slice(0, 10)} type="movie" title="📅 Próximos estrenos" />
    </div>
  )
}
