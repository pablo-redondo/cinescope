export const revalidate = 3600

import { discoverMovies, getTopRatedMovies, getTrendingMovies } from '@/services/tmdb'
import TmdbCarousel from '@/components/TmdbCarousel'
import Link from 'next/link'

export default async function MoviesPage() {
  const [trending, topRated, scifi, thriller, animation, action, drama] = await Promise.all([
    getTrendingMovies(),
    getTopRatedMovies(),
    discoverMovies({ with_genres: '878', sort_by: 'popularity.desc', 'vote_count.gte': '100' }),
    discoverMovies({ with_genres: '53', sort_by: 'popularity.desc', 'vote_count.gte': '100' }),
    discoverMovies({ with_genres: '16', sort_by: 'popularity.desc', 'vote_count.gte': '50' }),
    discoverMovies({ with_genres: '28', sort_by: 'popularity.desc', 'vote_count.gte': '100' }),
    discoverMovies({ with_genres: '18', sort_by: 'vote_average.desc', 'vote_count.gte': '1000' }),
  ])

  const f = (r: { results: import('@/services/tmdb').TmdbMovieResult[] }) =>
    r.results.filter(m => m.poster_path).slice(0, 16)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(to bottom, var(--surface) 0%, var(--bg) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="page-inner" style={{ paddingTop: 48, paddingBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: 'linear-gradient(135deg, var(--accent), #e6a800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 8px 24px rgba(245,197,24,0.25)' }}>🎬</div>
            <div>
              <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.8px', lineHeight: 1.1 }}>Películas</h1>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>Explora por género o descubre las más populares</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: '🔥 Tendencias', href: '/discover?sort=popularity.desc&type=movie' },
              { label: '⭐ Mejor valoradas', href: '/discover?sort=vote_average.desc&type=movie&rating=7' },
              { label: '🚀 Sci-Fi', href: '/discover?genre=878&type=movie' },
              { label: '🔪 Thriller', href: '/discover?genre=53&type=movie' },
              { label: '😂 Comedia', href: '/discover?genre=35&type=movie' },
              { label: '✨ Animación', href: '/discover?genre=16&type=movie' },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 999, textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{ paddingTop: 36, paddingBottom: 56, display: 'flex', flexDirection: 'column', gap: 36 }}>
        <TmdbCarousel items={trending.slice(0, 16)} title="🔥 En tendencia esta semana" subtitle="Lo más visto ahora mismo" type="movie" />
        <TmdbCarousel items={topRated.slice(0, 16)} title="⭐ Mejor valoradas de la historia" subtitle="Las películas más aclamadas de todos los tiempos" type="movie" />
        <TmdbCarousel items={f(action)} title="💥 Acción & Aventura" type="movie" />
        <TmdbCarousel items={f(scifi)} title="🚀 Ciencia Ficción" subtitle="Viajes al futuro y más allá" type="movie" />
        <TmdbCarousel items={f(thriller)} title="🔪 Thriller & Suspense" subtitle="Suspenso hasta el final" type="movie" />
        <TmdbCarousel items={f(drama)} title="🎭 Drama" subtitle="Historias que te harán reflexionar" type="movie" />
        <TmdbCarousel items={f(animation)} title="✨ Animación" subtitle="Para todas las edades" type="movie" />
      </div>
    </div>
  )
}
