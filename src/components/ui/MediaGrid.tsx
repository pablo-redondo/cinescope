import MediaCard from './MediaCard'
import type { Movie, TVShow } from '@/types/tmdb'

type Props = {
  items: (Movie | TVShow)[]
  type: 'movie' | 'tv'
  title?: string
}

export default function MediaGrid({ items, type, title }: Props) {
  return (
    <section>
      {title && (
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} type={type} />
        ))}
      </div>
    </section>
  )
}
