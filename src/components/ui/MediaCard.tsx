import Link from 'next/link'
import Image from 'next/image'
import { getPosterUrl } from '@/lib/tmdb'
import type { Movie, TVShow } from '@/types/tmdb'

type Props = {
  item: Movie | TVShow
  type: 'movie' | 'tv'
}

function isMovie(item: Movie | TVShow): item is Movie {
  return 'title' in item
}

export default function MediaCard({ item, type }: Props) {
  const title = isMovie(item) ? item.title : item.name
  const date = isMovie(item) ? item.release_date : item.first_air_date
  const posterUrl = getPosterUrl(item.poster_path, 'w342')
  const year = date ? new Date(date).getFullYear() : '—'
  const rating = item.vote_average.toFixed(1)

  return (
    <Link href={`/${type}/${item.id}`} className="group block">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-4xl">
            🎬
          </div>
        )}

        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
          ⭐ {rating}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <span className="text-white text-xs font-medium line-clamp-2">{title}</span>
        </div>
      </div>

      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-medium text-white line-clamp-1 group-hover:text-slate-300 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">{year}</p>
      </div>
    </Link>
  )
}
