import { searchMovies } from '@/services/movies'
import { searchTV } from '@/services/tv'
import MediaGrid from '@/components/ui/MediaGrid'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  if (!q) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-slate-400 text-lg">Busca películas y series desde la barra de navegación</p>
      </div>
    )
  }

  const [movies, shows] = await Promise.all([
    searchMovies(q),
    searchTV(q),
  ])

  const totalResults = movies.total_results + shows.total_results

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-white">Resultados para "{q}"</h1>
        <p className="text-slate-400 mt-1">{totalResults} resultados encontrados</p>
      </div>

      {movies.results.length > 0 && (
        <MediaGrid items={movies.results.slice(0, 10)} type="movie" title="🎬 Películas" />
      )}

      {shows.results.length > 0 && (
        <MediaGrid items={shows.results.slice(0, 10)} type="tv" title="📺 Series" />
      )}

      {totalResults === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-slate-400">No encontramos nada para "{q}"</p>
        </div>
      )}
    </div>
  )
}
