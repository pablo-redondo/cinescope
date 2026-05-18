import Image from 'next/image'
import Link from 'next/link'
import { getBackdropUrl } from '@/lib/tmdb'
import type { Movie } from '@/types/tmdb'

export default function HeroBanner({ movie }: { movie: Movie }) {
  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original')
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : ''

  return (
    <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-xl space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="bg-white/10 px-2 py-0.5 rounded text-xs">🔥 Tendencia</span>
              <span>{year}</span>
              <span>⭐ {movie.vote_average.toFixed(1)}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {movie.title}
            </h1>

            <p className="text-slate-300 text-sm md:text-base line-clamp-3 leading-relaxed">
              {movie.overview}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href={`/movie/${movie.id}`}
                className="bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-slate-200 transition-colors text-sm"
              >
                Ver detalles
              </Link>
              <Link
                href={`/movie/${movie.id}`}
                className="bg-white/10 backdrop-blur text-white font-semibold px-6 py-3 rounded-full hover:bg-white/20 transition-colors text-sm border border-white/20"
              >
                + Mi lista
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
