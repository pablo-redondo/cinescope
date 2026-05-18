import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getMovieDetail, getMovieCredits, getMovieVideos, getSimilarMovies } from '@/services/movies'
import { getBackdropUrl, getPosterUrl } from '@/lib/tmdb'
import MediaGrid from '@/components/ui/MediaGrid'
import WatchlistButton from '@/components/WatchlistButton'

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const movieId = Number(id)

  const [movie, credits, videos, similar] = await Promise.all([
    getMovieDetail(movieId).catch(() => null),
    getMovieCredits(movieId).catch(() => []),
    getMovieVideos(movieId).catch(() => []),
    getSimilarMovies(movieId).catch(() => ({ results: [] })),
  ])

  if (!movie) notFound()

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original')
  const posterUrl = getPosterUrl(movie.poster_path, 'w500')
  const trailer = videos[0]
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '—'
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '—'

  return (
    <div>
      {/* Backdrop */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        {backdropUrl && (
          <Image src={backdropUrl} alt={movie.title} fill priority className="object-cover" sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/50 to-black/30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 pb-16">
        <div className="flex gap-8 items-start">
          {/* Poster */}
          {posterUrl && (
            <div className="hidden md:block shrink-0 w-52 rounded-xl overflow-hidden shadow-2xl">
              <Image src={posterUrl} alt={movie.title} width={208} height={312} className="w-full" />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 space-y-4 pt-8">
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span key={g.id} className="bg-white/10 text-xs text-slate-300 px-3 py-1 rounded-full">
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white">{movie.title}</h1>

            {movie.tagline && (
              <p className="text-slate-400 italic">"{movie.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span>⭐ {movie.vote_average.toFixed(1)} ({movie.vote_count.toLocaleString()} votos)</span>
              <span>📅 {year}</span>
              <span>⏱ {runtime}</span>
              <span className="uppercase text-xs bg-white/10 px-2 py-0.5 rounded">{movie.original_language}</span>
            </div>

            <p className="text-slate-300 leading-relaxed max-w-2xl">{movie.overview}</p>

            <div className="flex gap-3 pt-2">
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
                >
                  ▶ Ver tráiler
                </a>
              )}
              <WatchlistButton movie={movie} />
            </div>
          </div>
        </div>

        {/* Cast */}
        {credits.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-white mb-4">Reparto principal</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {credits.map((actor) => (
                <div key={actor.id} className="shrink-0 w-24 text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-white/10 mx-auto mb-2">
                    {actor.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                    )}
                  </div>
                  <p className="text-white text-xs font-medium line-clamp-2">{actor.name}</p>
                  <p className="text-slate-500 text-xs line-clamp-1">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {similar.results.length > 0 && (
          <section className="mt-12">
            <MediaGrid items={similar.results.slice(0, 10)} type="movie" title="Películas similares" />
          </section>
        )}
      </div>
    </div>
  )
}
