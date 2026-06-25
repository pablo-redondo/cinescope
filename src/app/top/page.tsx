import Image from 'next/image'
import Link from 'next/link'
import { getTopRatedMovies, getTopRatedTV, getPosterUrl } from '@/services/tmdb'
import type { TmdbMovieResult } from '@/services/tmdb'

function RankedCard({ item, rank, type }: { item: TmdbMovieResult; rank: number; type: 'movie' | 'tv' }) {
  const poster = getPosterUrl(item.poster_path, 'w342')
  const title = item.title ?? item.name ?? ''
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null

  return (
    <Link href={`/tmdb/${type}/${item.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 16, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 'clamp(18px, 2vw, 28px)', fontWeight: 900, color: rank <= 3 ? 'var(--accent)' : 'var(--muted)', opacity: rank <= 3 ? 1 : 0.5, width: 40, textAlign: 'right', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
        {rank}
      </span>
      <div style={{ width: 52, aspectRatio: '2/3', borderRadius: 8, overflow: 'hidden', background: 'var(--surface2)', flexShrink: 0, position: 'relative' }}>
        {poster && <Image src={poster} alt={title} fill sizes="52px" style={{ objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{year}</p>
      </div>
      {rating && (
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: 'var(--accent)', fontSize: 13 }}>★</span>
          <span style={{ color: 'var(--text)', fontWeight: 800, fontSize: 14 }}>{rating}</span>
        </div>
      )}
    </Link>
  )
}

export default async function TopPage() {
  const [movies, tvShows] = await Promise.all([
    getTopRatedMovies(),
    getTopRatedTV(),
  ])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(to bottom, var(--surface) 0%, var(--bg) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="page-inner" style={{ paddingTop: 40, paddingBottom: 28 }}>
          <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.8px', marginBottom: 6 }}>
            Lo mejor de todos los tiempos
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            Rankings basados en valoraciones de la comunidad TMDB
          </p>
        </div>
      </div>

      <div className="page-inner" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 64 }}>

          {/* Top Movies */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 3, height: 22, background: 'rgba(239,68,68,0.8)', borderRadius: 2 }} />
              <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)', margin: 0 }}>Top Películas</h2>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20, paddingLeft: 15 }}>Las películas más valoradas de la historia</p>
            <div>
              {movies.slice(0, 50).map((item, i) => (
                <RankedCard key={item.id} item={item} rank={i + 1} type="movie" />
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <Link href="/discover?sort=vote_average.desc&type=movie&rating=7" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'var(--surface)', border: '1px solid var(--border)',
                color: 'var(--muted)', fontSize: 13, fontWeight: 600,
                padding: '10px 20px', borderRadius: 10, textDecoration: 'none',
              }}>Ver más películas →</Link>
            </div>
          </section>

          {/* Top TV */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 3, height: 22, background: 'rgba(99,102,241,0.8)', borderRadius: 2 }} />
              <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)', margin: 0 }}>Top Series</h2>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20, paddingLeft: 15 }}>Las series mejor valoradas de la historia</p>
            <div>
              {tvShows.slice(0, 50).map((item, i) => (
                <RankedCard key={item.id} item={item} rank={i + 1} type="tv" />
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <Link href="/discover?sort=vote_average.desc&type=tv&rating=7" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'var(--surface)', border: '1px solid var(--border)',
                color: 'var(--muted)', fontSize: 13, fontWeight: 600,
                padding: '10px 20px', borderRadius: 10, textDecoration: 'none',
              }}>Ver más series →</Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
