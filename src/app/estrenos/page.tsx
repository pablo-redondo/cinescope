export const revalidate = 3600

import { getNowPlaying, getUpcomingMovies, getPosterUrl, getBackdropUrl } from '@/services/tmdb'
import Image from 'next/image'
import Link from 'next/link'
import type { TmdbMovieResult } from '@/services/tmdb'

function MovieRow({ movie }: { movie: TmdbMovieResult }) {
  const poster = getPosterUrl(movie.poster_path, 'w342')
  const backdrop = getBackdropUrl(movie.backdrop_path, 'w780')
  const title = movie.title ?? movie.name ?? ''
  const date = movie.release_date ?? movie.first_air_date ?? ''
  const year = date.slice(0, 4)
  const rating = movie.vote_average > 0 ? movie.vote_average.toFixed(1) : null

  return (
    <Link href={`/tmdb/movie/${movie.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 16, alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }} className="movie-row">
      <div style={{ flexShrink: 0, width: 64, height: 96, borderRadius: 8, overflow: 'hidden', background: 'var(--surface2)', position: 'relative' }}>
        {poster
          ? <Image src={poster} alt={title} fill sizes="64px" style={{ objectFit: 'cover' }} />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🎬</div>
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, marginBottom: 4 }}>{title}</p>
        {date && <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
        {movie.overview && <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{movie.overview}</p>}
      </div>
      {rating && (
        <div style={{ flexShrink: 0, background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.2)', borderRadius: 8, padding: '6px 12px', textAlign: 'center' }}>
          <p style={{ fontSize: 16, fontWeight: 900, color: 'var(--accent)' }}>★ {rating}</p>
          <p style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 600 }}>TMDB</p>
        </div>
      )}
      <span style={{ flexShrink: 0, color: 'var(--muted)', fontSize: 16 }}>→</span>
    </Link>
  )
}

function FeaturedCard({ movie }: { movie: TmdbMovieResult }) {
  const poster = getPosterUrl(movie.poster_path, 'w342')
  const title = movie.title ?? movie.name ?? ''
  const date = movie.release_date ?? ''
  const rating = movie.vote_average > 0 ? movie.vote_average.toFixed(1) : null

  return (
    <Link href={`/tmdb/movie/${movie.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ position: 'relative', aspectRatio: '2/3', borderRadius: 12, overflow: 'hidden', background: 'var(--surface2)' }} className="featured-card">
        {poster && <Image src={poster} alt={title} fill sizes="(max-width: 640px) 45vw, 200px" style={{ objectFit: 'cover' }} />}
        {rating && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.85)', color: 'var(--accent)', fontSize: 11, fontWeight: 800, padding: '4px 8px', borderRadius: 8 }}>
            ★ {rating}
          </div>
        )}
        <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(239,68,68,0.85)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 5 }}>EN CINES</div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
        <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{title}</p>
          {date && <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{date.slice(0, 4)}</p>}
        </div>
      </div>
    </Link>
  )
}

export default async function EstrenosPage() {
  const [nowPlaying, upcoming] = await Promise.all([
    getNowPlaying(),
    getUpcomingMovies(),
  ])

  const nowFiltered = nowPlaying.filter(m => m.poster_path)
  const upcomingFiltered = upcoming.filter(m => m.poster_path)

  const today = new Date().toISOString().slice(0, 10)
  const upcomingSorted = upcomingFiltered
    .filter(m => (m.release_date ?? '') >= today)
    .sort((a, b) => (a.release_date ?? '').localeCompare(b.release_date ?? ''))

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(to bottom, var(--surface) 0%, var(--bg) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="page-inner" style={{ paddingTop: 48, paddingBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: 'linear-gradient(135deg, #ef4444, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 8px 24px rgba(239,68,68,0.3)' }}>🎟️</div>
            <div>
              <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.8px', lineHeight: 1.1 }}>Cartelera & Estrenos</h1>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>Lo que está en cines ahora y lo que viene</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <Link href="#en-cines" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 999, textDecoration: 'none' }}>🎬 En cines</Link>
            <Link href="#proximos" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 999, textDecoration: 'none' }}>📅 Próximos estrenos</Link>
          </div>
        </div>
      </div>

      <div className="page-inner" style={{ paddingTop: 48, paddingBottom: 80, display: 'flex', flexDirection: 'column', gap: 64 }}>

        {/* En cines ahora */}
        {nowFiltered.length > 0 && (
          <section id="en-cines">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 3, height: 22, background: '#ef4444', borderRadius: 2 }} />
              <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.3px' }}>🎬 En cines ahora</h2>
              <span style={{ marginLeft: 8, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>{nowFiltered.length} películas</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
              {nowFiltered.slice(0, 20).map(m => <FeaturedCard key={m.id} movie={m} />)}
            </div>
          </section>
        )}

        {/* Próximos estrenos - agrupados por mes */}
        {upcomingSorted.length > 0 && (
          <section id="proximos">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
              <div style={{ width: 3, height: 22, background: 'var(--accent)', borderRadius: 2 }} />
              <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.3px' }}>📅 Próximos estrenos</h2>
            </div>
            {(() => {
              const grouped: Record<string, TmdbMovieResult[]> = {}
              upcomingSorted.slice(0, 30).forEach(m => {
                const key = m.release_date?.slice(0, 7) ?? 'Sin fecha'
                if (!grouped[key]) grouped[key] = []
                grouped[key].push(m)
              })
              return Object.entries(grouped).map(([monthKey, movies]) => {
                const label = monthKey === 'Sin fecha' ? 'Sin fecha' : new Date(monthKey + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())
                return (
                  <div key={monthKey} style={{ marginBottom: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.05em', textTransform: 'uppercase', background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.2)', padding: '4px 14px', borderRadius: 999 }}>{label}</span>
                      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {movies.map(m => <MovieRow key={m.id} movie={m} />)}
                    </div>
                  </div>
                )
              })
            })()}
          </section>
        )}

      </div>

      <style>{`
        .featured-card { transition: transform .25s ease, box-shadow .25s ease; }
        .featured-card:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 20px 50px rgba(0,0,0,0.7); }
        .movie-row { transition: background .15s; border-radius: 10px; padding-left: 10px; padding-right: 10px; margin: 0 -10px; }
        .movie-row:hover { background: var(--surface2); }
      `}</style>
    </div>
  )
}
