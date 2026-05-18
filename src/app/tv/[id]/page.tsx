import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTVDetail, getTVCredits, getTVVideos } from '@/services/tv'
import { getBackdropUrl, getPosterUrl } from '@/lib/tmdb'

export default async function TVPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tvId = Number(id)

  const [show, credits, videos] = await Promise.all([
    getTVDetail(tvId).catch(() => null),
    getTVCredits(tvId).catch(() => []),
    getTVVideos(tvId).catch(() => []),
  ])

  if (!show) notFound()

  const backdropUrl = getBackdropUrl(show.backdrop_path, 'original')
  const posterUrl = getPosterUrl(show.poster_path, 'w500')
  const trailer = videos[0]
  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : '—'

  return (
    <div>
      <div className="relative h-[50vh] w-full overflow-hidden">
        {backdropUrl && (
          <Image src={backdropUrl} alt={show.name} fill priority className="object-cover" sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/50 to-black/30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 pb-16">
        <div className="flex gap-8 items-start">
          {posterUrl && (
            <div className="hidden md:block shrink-0 w-52 rounded-xl overflow-hidden shadow-2xl">
              <Image src={posterUrl} alt={show.name} width={208} height={312} className="w-full" />
            </div>
          )}

          <div className="flex-1 space-y-4 pt-8">
            <div className="flex flex-wrap gap-2">
              {show.genres.map((g) => (
                <span key={g.id} className="bg-white/10 text-xs text-slate-300 px-3 py-1 rounded-full">
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white">{show.name}</h1>

            {show.tagline && <p className="text-slate-400 italic">"{show.tagline}"</p>}

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span>⭐ {show.vote_average.toFixed(1)}</span>
              <span>📅 {year}</span>
              <span>📺 {show.number_of_seasons} temporadas</span>
              <span>🎬 {show.number_of_episodes} episodios</span>
            </div>

            <p className="text-slate-300 leading-relaxed max-w-2xl">{show.overview}</p>

            {trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
              >
                ▶ Ver tráiler
              </a>
            )}
          </div>
        </div>

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
      </div>
    </div>
  )
}
