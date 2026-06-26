export const revalidate = 3600

import Image from 'next/image'
import Link from 'next/link'
import { getTopRatedMovies, getTopRatedTV, getPosterUrl } from '@/services/tmdb'
import type { TmdbMovieResult } from '@/services/tmdb'

const MEDAL: Record<number, { color: string; bg: string; label: string }> = {
  1: { color: '#f5c518', bg: 'rgba(245,197,24,0.12)', label: '🥇' },
  2: { color: '#c0c0c0', bg: 'rgba(192,192,192,0.10)', label: '🥈' },
  3: { color: '#cd7f32', bg: 'rgba(205,127,50,0.10)', label: '🥉' },
}

function PodiumCard({ item, rank, type }: { item: TmdbMovieResult; rank: number; type: 'movie' | 'tv' }) {
  const poster = getPosterUrl(item.poster_path, 'w342')
  const title = item.title ?? item.name ?? ''
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)
  const medal = MEDAL[rank]

  return (
    <Link href={`/tmdb/${type}/${item.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 14, alignItems: 'center', padding: '14px 16px', borderRadius: 12, background: medal.bg, border: `1px solid ${medal.color}22`, marginBottom: 10 }} className="top-row">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{ fontSize: 20 }}>{medal.label}</span>
      </div>
      <div style={{ width: 44, height: 66, borderRadius: 7, overflow: 'hidden', background: 'var(--surface2)', flexShrink: 0, position: 'relative', boxShadow: `0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px ${medal.color}33` }}>
        {poster && <Image src={poster} alt={title} fill sizes="44px" style={{ objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{title}</p>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{year}</p>
      </div>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
        <span style={{ color: medal.color, fontSize: 14 }}>★</span>
        <span style={{ color: medal.color, fontWeight: 900, fontSize: 15 }}>{item.vote_average.toFixed(1)}</span>
      </div>
    </Link>
  )
}

function RankedRow({ item, rank, type }: { item: TmdbMovieResult; rank: number; type: 'movie' | 'tv' }) {
  const poster = getPosterUrl(item.poster_path, 'w185')
  const title = item.title ?? item.name ?? ''
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)
  const isTop10 = rank <= 10

  return (
    <Link href={`/tmdb/${type}/${item.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 14, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }} className="top-row">
      <span style={{
        fontSize: isTop10 ? 16 : 13, fontWeight: 900,
        color: isTop10 ? 'var(--text)' : 'var(--muted)',
        opacity: isTop10 ? 0.9 : 0.45,
        width: 34, textAlign: 'right', flexShrink: 0,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {rank}
      </span>
      <div style={{ width: 40, height: 60, borderRadius: 6, overflow: 'hidden', background: 'var(--surface2)', flexShrink: 0, position: 'relative' }}>
        {poster && <Image src={poster} alt={title} fill sizes="40px" style={{ objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{year}</p>
      </div>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
        <span style={{ color: 'var(--accent)', fontSize: 12 }}>★</span>
        <span style={{ color: 'var(--text)', fontWeight: 800, fontSize: 13 }}>{item.vote_average.toFixed(1)}</span>
      </div>
    </Link>
  )
}

function TopList({ items, type }: { items: TmdbMovieResult[]; type: 'movie' | 'tv' }) {
  const top3 = items.slice(0, 3)
  const rest = items.slice(3)
  return (
    <div>
      {top3.map((item, i) => (
        <PodiumCard key={item.id} item={item} rank={i + 1} type={type} />
      ))}
      <div style={{ marginTop: 8 }}>
        {rest.map((item, i) => (
          <RankedRow key={item.id} item={item} rank={i + 4} type={type} />
        ))}
      </div>
    </div>
  )
}

export default async function TopPage() {
  const [moviesP1, moviesP2, tvP1, tvP2] = await Promise.all([
    getTopRatedMovies(1),
    getTopRatedMovies(2),
    getTopRatedTV(1),
    getTopRatedTV(2),
  ])

  const movies = [...moviesP1, ...moviesP2].filter(m => m.poster_path).slice(0, 50)
  const tvShows = [...tvP1, ...tvP2].filter(s => s.poster_path).slice(0, 50)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(to bottom, var(--surface) 0%, var(--bg) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="page-inner" style={{ paddingTop: 40, paddingBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: 'linear-gradient(135deg, #f5c518, #e6a800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 8px 24px rgba(245,197,24,0.3)' }}>🏆</div>
            <div>
              <h1 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.5px' }}>Lo mejor de todos los tiempos</h1>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>Rankings basados en valoraciones de la comunidad TMDB</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <Link href="#movies" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 999, textDecoration: 'none' }}>🎬 Películas</Link>
            <Link href="#tv" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 999, textDecoration: 'none' }}>📺 Series</Link>
          </div>
        </div>
      </div>

      <div className="page-inner" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 64, alignItems: 'start' }}>

          <section id="movies">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 3, height: 22, background: 'rgba(239,68,68,0.8)', borderRadius: 2 }} />
              <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>Top Películas</h2>
              <span style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>{movies.length}</span>
            </div>
            <TopList items={movies} type="movie" />
            <div style={{ marginTop: 20 }}>
              <Link href="/discover?sort=vote_average.desc&type=movie&rating=7" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>
                Ver todas las películas valoradas →
              </Link>
            </div>
          </section>

          <section id="tv">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 3, height: 22, background: 'rgba(99,102,241,0.8)', borderRadius: 2 }} />
              <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>Top Series</h2>
              <span style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>{tvShows.length}</span>
            </div>
            <TopList items={tvShows} type="tv" />
            <div style={{ marginTop: 20 }}>
              <Link href="/discover?sort=vote_average.desc&type=tv&rating=7" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>
                Ver todas las series valoradas →
              </Link>
            </div>
          </section>

        </div>
      </div>

      <style>{`
        .top-row { transition: background .15s, transform .15s; }
        .top-row:hover { background: var(--surface2) !important; border-radius: 10px; transform: translateX(2px); }
      `}</style>
    </div>
  )
}
