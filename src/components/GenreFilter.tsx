'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Genre } from '@/types/tmdb'

export default function GenreFilter({ genres }: { genres: Genre[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get('genre') || ''

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value) {
      params.set('genre', e.target.value)
    } else {
      params.delete('genre')
    }
    router.push(`/movies?${params}`)
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className="bg-white/10 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-white/30 cursor-pointer"
    >
      <option value="">Todos los géneros</option>
      {genres.map((g) => (
        <option key={g.id} value={String(g.id)} className="bg-[#1a1a1a]">
          {g.name}
        </option>
      ))}
    </select>
  )
}
