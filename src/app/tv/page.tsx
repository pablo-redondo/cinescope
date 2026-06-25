export const revalidate = 3600

import { discoverTV, getTopRatedTV, getTrendingTV } from '@/services/tmdb'
import TmdbCarousel from '@/components/TmdbCarousel'
import Link from 'next/link'

export default async function TVPage() {
  const [trending, topRated, crime, comedy, scifi, drama, action] = await Promise.all([
    getTrendingTV(),
    getTopRatedTV(),
    discoverTV({ with_genres: '80', sort_by: 'popularity.desc', 'vote_count.gte': '100' }),
    discoverTV({ with_genres: '35', sort_by: 'popularity.desc', 'vote_count.gte': '100' }),
    discoverTV({ with_genres: '10765', sort_by: 'popularity.desc', 'vote_count.gte': '100' }),
    discoverTV({ with_genres: '18', sort_by: 'vote_average.desc', 'vote_count.gte': '500' }),
    discoverTV({ with_genres: '10759', sort_by: 'popularity.desc', 'vote_count.gte': '100' }),
  ])

  const f = (r: { results: import('@/services/tmdb').TmdbMovieResult[] }) =>
    r.results.filter(m => m.poster_path).slice(0, 16)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(to bottom, var(--surface) 0%, var(--bg) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="page-inner" style={{ paddingTop: 48, paddingBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 8px 24px rgba(99,102,241,0.25)' }}>📺</div>
            <div>
              <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.8px', lineHeight: 1.1 }}>Series</h1>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>Explora por género o descubre las más populares</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: '🔥 Tendencias', href: '/discover?sort=popularity.desc&type=tv' },
              { label: '⭐ Mejor valoradas', href: '/discover?sort=vote_average.desc&type=tv&rating=7' },
              { label: '🔍 Crimen', href: '/discover?genre=80&type=tv' },
              { label: '😂 Comedia', href: '/discover?genre=35&type=tv' },
              { label: '🤖 Sci-Fi', href: '/discover?genre=10765&type=tv' },
              { label: '🎭 Drama', href: '/discover?genre=18&type=tv' },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 999, textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{ paddingTop: 36, paddingBottom: 56, display: 'flex', flexDirection: 'column', gap: 36 }}>
        <TmdbCarousel items={trending.slice(0, 16)} title="🔥 En tendencia esta semana" subtitle="Los shows del momento" type="tv" />
        <TmdbCarousel items={topRated.slice(0, 16)} title="⭐ Las mejores series de la historia" subtitle="Las más aclamadas de todos los tiempos" type="tv" />
        <TmdbCarousel items={f(crime)} title="🔍 Crimen & Misterio" subtitle="Intriga y suspense hasta el final" type="tv" />
        <TmdbCarousel items={f(action)} title="💥 Acción & Aventura" type="tv" />
        <TmdbCarousel items={f(scifi)} title="🤖 Ciencia Ficción & Fantasía" subtitle="Mundos más allá de la imaginación" type="tv" />
        <TmdbCarousel items={f(drama)} title="🎭 Drama" subtitle="Historias que no olvidarás" type="tv" />
        <TmdbCarousel items={f(comedy)} title="😂 Comedia" subtitle="Para reír sin parar" type="tv" />
      </div>
    </div>
  )
}
