export const revalidate = 3600

import Image from 'next/image'
import Link from 'next/link'
import { getTopRatedMovies, getTopRatedTV, getPosterUrl } from '@/services/tmdb'
import type { TmdbMovieResult } from '@/services/tmdb'

function PodiumCard({ item, rank, type }: { item: TmdbMovieResult; rank: number; type: 'movie' | 'tv' }) {
  const poster = getPosterUrl(item.poster_path, 'w342')
  const title = item.title ?? item.name ?? ''
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)
  const medal = rank === 1 ? { color: '#f5c518', glow: 'rgba(245,197,24,0.2)', num: '01' }
              : rank === 2 ? { color: '#94a3b8', glow: 'rgba(148,163,184,0.15)', num: '02' }
              : { color: '#c97c3e', glow: 'rgba(201,124,62,0.15)', num: '03' }

  return (
    <Link href={`/tmdb/${type}/${item.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 14, alignItems: 'center', padding: '14px 16px', borderRadius: 10, background: `linear-gradient(135deg, ${medal.glow}, transparent)`, border: `1px solid rgba(255,255,255,0.06)`, marginBottom: 8 }} className="top-row">
      <span style={{ fontSize: 11, fontWeight: 900, color: medal.color, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px', flexShrink: 0, width: 22, textAlign: 'right', opacity: 0.7 }}>{medal.num}</span>
      <div style={{ width: 42, height: 63, borderRadius: 6, overflow: 'hidden', background: 'var(--surface2)', flexShrink: 0, position: 'relative', boxShadow: `0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px ${medal.color}22` }}>
        {poster && <Image src={poster} alt={title} fill sizes="42px" style={{ objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{title}</p>
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{year}</p>
      </div>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ color: medal.color, fontSize: 11 }}>★</span>
        <span style={{ color: medal.color, fontWeight: 900, fontSize: 15 }}>{item.vote_average.toFixed(1)}</span>
      </div>
    </Link>
  )
}

function RankedRow({ item, rank, type }: { item: TmdbMovieResult; rank: number; type: 'movie' | 'tv' }) {
  const poster = getPosterUrl(item.poster_path, 'w185')
  const title = item.title ?? item.name ?? ''
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)

  return (
    <Link href={`/tmdb/${type}/${item.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 12, alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)' }} className="top-row">
      <span style={{
        fontSize: rank <= 10 ? 13 : 11, fontWeight: 700,
        color: rank <= 10 ? 'var(--muted2)' : 'var(--muted)',
        opacity: rank <= 10 ? 0.8 : 0.4,
        width: 28, textAlign: 'right', flexShrink: 0,
        fontVariantNumeric: 'tabular-nums',
      }}>{rank}</span>
      <div style={{ width: 36, height: 54, borderRadius: 5, overflow: 'hidden', background: 'var(--surface2)', flexShrink: 0, position: 'relative' }}>
        {poster && <Image src={poster} alt={title} fill sizes="36px" style={{ objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
        <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{year}</p>
      </div>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
        <span style={{ color: 'var(--accent)', fontSize: 10 }}>★</span>
        <span style={{ color: 'var(--muted2)', fontWeight: 700, fontSize: 12 }}>{item.vote_average.toFixed(1)}</span>
      </div>
    </Link>
  )
}

function TopList({ items, type }: { items: TmdbMovieResult[]; type: 'movie' | 'tv' }) {
  const top3 = items.slice(0, 3)
  const rest = items.slice(3)
  return (
    <div>
      {top3.map((item, i) => <PodiumCard key={item.id} item={item} rank={i + 1} type={type} />)}
      <div style={{ marginTop: 6 }}>
        {rest.map((item, i) => <RankedRow key={item.id} item={item} rank={i + 4} type={type} />)}
      </div>
    </div>
  )
}

export default async function TopPage() {
  const [moviesP1, moviesP2, tvP1, tvP2] = await Promise.all([
    getTopRatedMovies(1), getTopRatedMovies(2),
    getTopRatedTV(1), getTopRatedTV(2),
  ])

  const movies = [...moviesP1, ...moviesP2].filter(m => m.poster_path).slice(0, 50)
  const tvShows = [...tvP1, ...tvP2].filter(s => s.poster_path).slice(0, 50)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Compact header */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="page-inner" style={{ paddingTop: 28, paddingBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.8px', lineHeight: 1 }}>Lo mejor de todos los tiempos</h1>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 5 }}>Rankings basados en valoraciones de la comunidad TMDB</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link href="#movies" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted2)', fontSize: 11, fontWeight: 600, padding: '5px 14px', borderRadius: 4, textDecoration: 'none' }}>Películas</Link>
              <Link href="#tv" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted2)', fontSize: 11, fontWeight: 600, padding: '5px 14px', borderRadius: 4, textDecoration: 'none' }}>Series</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="page-inner" style={{ paddingTop: 36, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 56, alignItems: 'start' }}>

          <section id="movies">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 2, height: 18, background: 'rgba(239,68,68,0.7)', borderRadius: 2 }} />
              <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>Top Películas</h2>
              <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 2 }}>{movies.length}</span>
            </div>
            <TopList items={movies} type="movie" />
            <div style={{ marginTop: 16 }}>
              <Link href="/discover?sort=vote_average.desc&type=movie&rating=7" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 12, fontWeight: 600, padding: '8px 16px', borderRadius: 8, textDecoration: 'none' }}>
                Ver todas las películas valoradas →
              </Link>
            </div>
          </section>

          <section id="tv">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 2, height: 18, background: 'rgba(99,102,241,0.7)', borderRadius: 2 }} />
              <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>Top Series</h2>
              <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 2 }}>{tvShows.length}</span>
            </div>
            <TopList items={tvShows} type="tv" />
            <div style={{ marginTop: 16 }}>
              <Link href="/discover?sort=vote_average.desc&type=tv&rating=7" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 12, fontWeight: 600, padding: '8px 16px', borderRadius: 8, textDecoration: 'none' }}>
                Ver todas las series valoradas →
              </Link>
            </div>
          </section>

        </div>
      </div>

      <style>{`
        .top-row { transition: background .12s; }
        .top-row:hover { background: var(--surface2) !important; border-radius: 8px; }
      `}</style>
    </div>
  )
}
