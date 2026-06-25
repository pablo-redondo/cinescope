import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getMovieGenres, getTVGenres, discoverMovies, discoverTV, getPosterUrl } from '@/services/tmdb'
import DiscoverFilters from '@/components/DiscoverFilters'
import type { TmdbMovieResult } from '@/services/tmdb'

type SearchParams = {
  type?: string
  genre?: string
  sort?: string
  rating?: string
  year?: string
  page?: string
  genre_name?: string
}

function ResultCard({ item, type }: { item: TmdbMovieResult; type: 'movie' | 'tv' }) {
  const poster = getPosterUrl(item.poster_path, 'w342')
  const title = item.title ?? item.name ?? ''
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null
  const href = `/tmdb/${type}/${item.id}`

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ position: 'relative', aspectRatio: '2/3', borderRadius: 12, overflow: 'hidden', background: 'var(--surface2)', transition: 'transform .25s ease, box-shadow .25s ease' }} className="result-card">
        {poster && <Image src={poster} alt={title} fill sizes="(max-width: 640px) 45vw, 200px" style={{ objectFit: 'cover' }} />}
        {rating && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.85)', color: 'var(--accent)', fontSize: 11, fontWeight: 800, padding: '4px 8px', borderRadius: 8, border: '1px solid rgba(245,197,24,0.2)' }}>
            ★ {rating}
          </div>
        )}
        <div style={{ position: 'absolute', top: 8, left: 8, background: type === 'tv' ? 'rgba(99,102,241,0.85)' : 'rgba(239,68,68,0.85)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 7px', borderRadius: 6, backdropFilter: 'blur(8px)' }}>
          {type === 'tv' ? 'SERIE' : 'PEL.'}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{year}</p>
      </div>
    </Link>
  )
}

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const type = (sp.type ?? 'movie') as 'movie' | 'tv'
  const sort = sp.sort ?? 'popularity.desc'
  const genre = sp.genre ?? ''
  const rating = sp.rating ?? ''
  const year = sp.year ?? ''
  const page = sp.page ?? '1'

  const [movieGenres, tvGenres] = await Promise.all([getMovieGenres(), getTVGenres()])

  const params: Record<string, string> = { sort_by: sort, 'vote_count.gte': '30', page }
  if (genre) params.with_genres = genre
  if (rating) params['vote_average.gte'] = rating
  if (year) {
    const y = parseInt(year)
    if (y >= 2020) { params['primary_release_date.gte'] = `${y}-01-01`; params['primary_release_date.lte'] = `${y + 1}-12-31` }
    else if (y >= 2000) { params['primary_release_date.gte'] = `${y}-01-01`; params['primary_release_date.lte'] = `${y + 4}-12-31` }
    else if (y >= 1990) { params['primary_release_date.gte'] = '1990-01-01'; params['primary_release_date.lte'] = '1999-12-31' }
    else { params['primary_release_date.lte'] = '1989-12-31' }
  }

  const data = type === 'tv'
    ? await discoverTV(params as Parameters<typeof discoverTV>[0])
    : await discoverMovies(params as Parameters<typeof discoverMovies>[0])

  const results = data.results.filter(r => r.poster_path)
  const totalPages = Math.min(data.total_pages, 20)
  const currentPage = parseInt(page)

  const activeGenreName = genre
    ? (type === 'tv' ? tvGenres : movieGenres).find(g => String(g.id) === genre)?.name
    : null

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(to bottom, var(--surface) 0%, var(--bg) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="page-inner" style={{ paddingTop: 40, paddingBottom: 28 }}>
          <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.8px', marginBottom: 6 }}>
            Descubrir
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            {data.total_results.toLocaleString('es')} {type === 'tv' ? 'series' : 'películas'}{activeGenreName ? ` de ${activeGenreName}` : ''}
          </p>
        </div>
      </div>

      <div className="page-inner" style={{ paddingTop: 32, paddingBottom: 80 }}>

        {/* Filters */}
        <div style={{ marginBottom: 36, padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
          <Suspense fallback={null}>
            <DiscoverFilters genres={movieGenres} tvGenres={tvGenres} />
          </Suspense>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Sin resultados</p>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>Prueba con otros filtros</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 18 }}>
            {results.map(item => (
              <ResultCard key={item.id} item={item} type={type} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48, flexWrap: 'wrap' }}>
            {currentPage > 1 && (
              <PaginationLink sp={sp} page={currentPage - 1} label="← Anterior" />
            )}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, currentPage - 2) + i
              if (p > totalPages) return null
              return <PaginationLink key={p} sp={sp} page={p} label={String(p)} active={p === currentPage} />
            })}
            {currentPage < totalPages && (
              <PaginationLink sp={sp} page={currentPage + 1} label="Siguiente →" />
            )}
          </div>
        )}
      </div>

      <style>{`
        .result-card:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 20px 50px rgba(0,0,0,0.7); }
      `}</style>
    </div>
  )
}

function PaginationLink({ sp, page, label, active }: { sp: SearchParams; page: number; label: string; active?: boolean }) {
  const params = new URLSearchParams()
  if (sp.type) params.set('type', sp.type)
  if (sp.genre) params.set('genre', sp.genre)
  if (sp.sort) params.set('sort', sp.sort)
  if (sp.rating) params.set('rating', sp.rating)
  if (sp.year) params.set('year', sp.year)
  params.set('page', String(page))

  return (
    <Link href={`/discover?${params.toString()}`} style={{
      padding: '8px 16px', borderRadius: 8,
      background: active ? 'var(--accent)' : 'var(--surface2)',
      color: active ? '#000' : 'var(--muted)',
      fontSize: 13, fontWeight: active ? 800 : 500,
      textDecoration: 'none', border: '1px solid var(--border)',
    }}>
      {label}
    </Link>
  )
}
