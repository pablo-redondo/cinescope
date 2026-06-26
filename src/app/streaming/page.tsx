export const revalidate = 3600

import { discoverMovies, discoverTV, getPosterUrl } from '@/services/tmdb'
import Image from 'next/image'
import Link from 'next/link'
import type { TmdbMovieResult } from '@/services/tmdb'

const PROVIDERS = [
  { id: '8', name: 'Netflix', color: '#e50914', bg: 'rgba(229,9,20,0.1)', border: 'rgba(229,9,20,0.25)', emoji: '🔴' },
  { id: '384', name: 'Max', color: '#002be7', bg: 'rgba(0,43,231,0.1)', border: 'rgba(0,43,231,0.25)', emoji: '🔵' },
  { id: '337', name: 'Disney+', color: '#0063e5', bg: 'rgba(0,99,229,0.1)', border: 'rgba(0,99,229,0.25)', emoji: '✨' },
  { id: '119', name: 'Prime Video', color: '#00a8e0', bg: 'rgba(0,168,224,0.1)', border: 'rgba(0,168,224,0.25)', emoji: '📦' },
  { id: '350', name: 'Apple TV+', color: '#a2aaad', bg: 'rgba(162,170,173,0.1)', border: 'rgba(162,170,173,0.25)', emoji: '🍎' },
  { id: '149', name: 'Movistar+', color: '#009bde', bg: 'rgba(0,155,222,0.1)', border: 'rgba(0,155,222,0.25)', emoji: '📡' },
]

function PlatformCard({ item, type }: { item: TmdbMovieResult; type: 'movie' | 'tv' }) {
  const poster = getPosterUrl(item.poster_path, 'w342')
  const title = item.title ?? item.name ?? ''
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)
  const rating = item.vote_average > 0 ? item.vote_average.toFixed(1) : null

  return (
    <Link href={`/tmdb/${type}/${item.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ position: 'relative', aspectRatio: '2/3', borderRadius: 10, overflow: 'hidden', background: 'var(--surface2)' }} className="platform-card">
        {poster
          ? <Image src={poster} alt={title} fill sizes="(max-width: 640px) 42vw, 165px" style={{ objectFit: 'cover' }} />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{type === 'tv' ? '📺' : '🎬'}</div>
        }
        {rating && (
          <div style={{ position: 'absolute', top: 7, right: 7, background: 'rgba(0,0,0,0.85)', color: 'var(--accent)', fontSize: 10, fontWeight: 800, padding: '3px 7px', borderRadius: 7 }}>★ {rating}</div>
        )}
        <div style={{ position: 'absolute', top: 7, left: 7, background: type === 'tv' ? 'rgba(99,102,241,0.85)' : 'rgba(239,68,68,0.85)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 5 }}>
          {type === 'tv' ? 'SERIE' : 'PEL.'}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
      </div>
      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
      {year && <p style={{ fontSize: 11, color: 'var(--muted)' }}>{year}</p>}
    </Link>
  )
}

type PlatformData = {
  provider: typeof PROVIDERS[number]
  movies: TmdbMovieResult[]
  tv: TmdbMovieResult[]
}

async function fetchPlatform(provider: typeof PROVIDERS[number]): Promise<PlatformData> {
  const opts = { with_watch_providers: provider.id, watch_region: 'ES', sort_by: 'popularity.desc', 'vote_count.gte': '10' }
  const [movies, tv] = await Promise.all([
    discoverMovies(opts),
    discoverTV(opts),
  ])
  return {
    provider,
    movies: movies.results.filter(m => m.poster_path).slice(0, 8),
    tv: tv.results.filter(s => s.poster_path).slice(0, 8),
  }
}

export default async function StreamingPage() {
  const platforms = await Promise.all(PROVIDERS.map(fetchPlatform))

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(to bottom, var(--surface) 0%, var(--bg) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="page-inner" style={{ paddingTop: 48, paddingBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }}>▶</div>
            <div>
              <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.8px', lineHeight: 1.1 }}>Qué hay en streaming</h1>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>Lo más popular en cada plataforma ahora mismo</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
            {PROVIDERS.map(p => (
              <Link key={p.id} href={`#${p.name.toLowerCase().replace(/\s+/g, '-')}`} style={{ background: p.bg, border: `1px solid ${p.border}`, color: p.color, fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 999, textDecoration: 'none' }}>
                {p.emoji} {p.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{ paddingBottom: 80 }}>
        {platforms.map(({ provider, movies, tv }) => {
          const allItems = [...movies, ...tv]
          if (allItems.length === 0) return null
          return (
            <div key={provider.id} id={provider.name.toLowerCase().replace(/\s+/g, '-')} style={{ paddingTop: 56 }}>
              <div className="page-inner" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 4, height: 24, background: provider.color, borderRadius: 2 }} />
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.3px' }}>
                    {provider.emoji} {provider.name}
                  </h2>
                  <Link href={`/discover?sort=popularity.desc&type=movie&provider=${provider.id}`} style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)', textDecoration: 'none', fontWeight: 600 }}>Ver más →</Link>
                </div>
              </div>

              {movies.length > 0 && (
                <div className="page-inner" style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Películas</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 14 }}>
                    {movies.map(m => <PlatformCard key={m.id} item={m} type="movie" />)}
                  </div>
                </div>
              )}

              {tv.length > 0 && (
                <div className="page-inner">
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Series</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 14 }}>
                    {tv.map(s => <PlatformCard key={s.id} item={s} type="tv" />)}
                  </div>
                </div>
              )}

              <div style={{ height: 1, background: 'var(--border)', margin: '40px 0 0' }} className="page-inner" />
            </div>
          )
        })}
      </div>

      <style>{`
        .platform-card { transition: transform .25s ease, box-shadow .25s ease; }
        .platform-card:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 20px 50px rgba(0,0,0,0.7); }
      `}</style>
    </div>
  )
}
