export const revalidate = 3600

import Image from 'next/image'
import Link from 'next/link'
import { getTopRatedMovies, getTopRatedTV, getTrendingMovies, discoverMovies, discoverTV, getPosterUrl } from '@/services/tmdb'
import type { TmdbMovieResult } from '@/services/tmdb'

function PodiumCard({ item, rank, type }: { item: TmdbMovieResult; rank: number; type: 'movie' | 'tv' }) {
  const poster = getPosterUrl(item.poster_path, 'w342')
  const title = item.title ?? item.name ?? ''
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)
  const medal = rank === 1 ? { color: '#f5c518', glow: 'rgba(245,197,24,0.15)', num: '01' }
              : rank === 2 ? { color: '#94a3b8', glow: 'rgba(148,163,184,0.1)', num: '02' }
              : { color: '#c97c3e', glow: 'rgba(201,124,62,0.1)', num: '03' }

  return (
    <Link href={`/tmdb/${type}/${item.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 14, alignItems: 'center', padding: '12px 14px', borderRadius: 10, background: `linear-gradient(135deg, ${medal.glow}, transparent)`, border: `1px solid rgba(255,255,255,0.05)`, marginBottom: 6 }} className="top-row">
      <span style={{ fontSize: 10, fontWeight: 900, color: medal.color, fontVariantNumeric: 'tabular-nums', flexShrink: 0, width: 20, textAlign: 'right', opacity: 0.6, fontFamily: 'var(--font-syne), system-ui' }}>{medal.num}</span>
      <div style={{ width: 40, height: 60, borderRadius: 5, overflow: 'hidden', background: 'var(--surface2)', flexShrink: 0, position: 'relative', boxShadow: `0 4px 12px rgba(0,0,0,0.5), 0 0 0 1px ${medal.color}1a` }}>
        {poster && <Image src={poster} alt={title} fill sizes="40px" style={{ objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{title}</p>
        <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>{year}</p>
      </div>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
        <span style={{ color: medal.color, fontSize: 10 }}>★</span>
        <span style={{ color: medal.color, fontWeight: 800, fontSize: 14 }}>{item.vote_average.toFixed(1)}</span>
      </div>
    </Link>
  )
}

function RankedRow({ item, rank, type }: { item: TmdbMovieResult; rank: number; type: 'movie' | 'tv' }) {
  const poster = getPosterUrl(item.poster_path, 'w185')
  const title = item.title ?? item.name ?? ''
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)

  return (
    <Link href={`/tmdb/${type}/${item.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }} className="top-row">
      <span style={{
        fontSize: 11, fontWeight: 700,
        color: 'var(--muted)',
        opacity: rank <= 10 ? 0.7 : 0.35,
        width: 26, textAlign: 'right', flexShrink: 0,
        fontVariantNumeric: 'tabular-nums',
        fontFamily: 'var(--font-syne), system-ui',
      }}>{rank}</span>
      <div style={{ width: 34, height: 51, borderRadius: 4, overflow: 'hidden', background: 'var(--surface2)', flexShrink: 0, position: 'relative' }}>
        {poster && <Image src={poster} alt={title} fill sizes="34px" style={{ objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
        <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{year}</p>
      </div>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
        <span style={{ color: 'var(--accent)', fontSize: 9 }}>★</span>
        <span style={{ color: 'var(--muted2)', fontWeight: 700, fontSize: 11 }}>{item.vote_average.toFixed(1)}</span>
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
      <div style={{ marginTop: 4 }}>
        {rest.map((item, i) => <RankedRow key={item.id} item={item} rank={i + 4} type={type} />)}
      </div>
    </div>
  )
}

function MiniRankedRow({ item, rank, type }: { item: TmdbMovieResult; rank: number; type: 'movie' | 'tv' }) {
  const poster = getPosterUrl(item.poster_path, 'w185')
  const title = item.title ?? item.name ?? ''
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)

  return (
    <Link href={`/tmdb/${type}/${item.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border)' }} className="top-row">
      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', opacity: 0.5, width: 18, textAlign: 'right', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{rank}</span>
      <div style={{ width: 28, height: 42, borderRadius: 3, overflow: 'hidden', background: 'var(--surface2)', flexShrink: 0, position: 'relative' }}>
        {poster && <Image src={poster} alt={title} fill sizes="28px" style={{ objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
        <p style={{ fontSize: 9, color: 'var(--muted)', marginTop: 1 }}>{year}</p>
      </div>
      <span style={{ color: 'var(--accent)', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>★ {item.vote_average.toFixed(1)}</span>
    </Link>
  )
}

function GenreTopList({ items, title, accentColor, href, type }: {
  items: TmdbMovieResult[]
  title: string
  accentColor: string
  href: string
  type: 'movie' | 'tv'
}) {
  const top = items.slice(0, 12)
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 18px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 3, height: 14, background: accentColor, borderRadius: 2, flexShrink: 0 }} />
        <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', flex: 1 }}>{title}</h3>
        <Link href={href} style={{ fontSize: 10, color: 'var(--muted)', textDecoration: 'none', flexShrink: 0 }}>Ver más →</Link>
      </div>
      {top.map((item, i) => <MiniRankedRow key={item.id} item={item} rank={i + 1} type={type} />)}
    </div>
  )
}

export default async function TopPage() {
  const [
    moviesP1, moviesP2, tvP1, tvP2,
    trending,
    documentary, animation, scifi, thriller, comedy, horror,
    dramaTV, crimeTV,
  ] = await Promise.all([
    getTopRatedMovies(1), getTopRatedMovies(2),
    getTopRatedTV(1), getTopRatedTV(2),
    getTrendingMovies(),
    discoverMovies({ with_genres: '99', sort_by: 'vote_average.desc', 'vote_count.gte': '300' }),
    discoverMovies({ with_genres: '16', sort_by: 'vote_average.desc', 'vote_count.gte': '300' }),
    discoverMovies({ with_genres: '878', sort_by: 'vote_average.desc', 'vote_count.gte': '400' }),
    discoverMovies({ with_genres: '53', sort_by: 'vote_average.desc', 'vote_count.gte': '400' }),
    discoverMovies({ with_genres: '35', sort_by: 'vote_average.desc', 'vote_count.gte': '400' }),
    discoverMovies({ with_genres: '27', sort_by: 'vote_average.desc', 'vote_count.gte': '300' }),
    discoverTV({ with_genres: '18', sort_by: 'vote_average.desc', 'vote_count.gte': '500' }),
    discoverTV({ with_genres: '80', sort_by: 'vote_average.desc', 'vote_count.gte': '200' }),
  ])

  const movies = [...moviesP1, ...moviesP2].filter((m: TmdbMovieResult) => m.poster_path).slice(0, 50)
  const tvShows = [...tvP1, ...tvP2].filter((s: TmdbMovieResult) => s.poster_path).slice(0, 50)
  const trendingFiltered = trending.filter((m: TmdbMovieResult) => m.poster_path)

  const f = (d: { results: TmdbMovieResult[] }) => d.results.filter(m => m.poster_path)

  const GENRE_TOPS = [
    { title: 'Top Documentales', items: f(documentary), href: '/discover?genre=99&type=movie&sort=vote_average.desc', color: '#60a5fa', type: 'movie' as const },
    { title: 'Top Animación', items: f(animation), href: '/discover?genre=16&type=movie&sort=vote_average.desc', color: '#f472b6', type: 'movie' as const },
    { title: 'Top Ciencia Ficción', items: f(scifi), href: '/discover?genre=878&type=movie&sort=vote_average.desc', color: '#a78bfa', type: 'movie' as const },
    { title: 'Top Thriller', items: f(thriller), href: '/discover?genre=53&type=movie&sort=vote_average.desc', color: '#fb923c', type: 'movie' as const },
    { title: 'Top Comedia', items: f(comedy), href: '/discover?genre=35&type=movie&sort=vote_average.desc', color: '#4ade80', type: 'movie' as const },
    { title: 'Top Terror', items: f(horror), href: '/discover?genre=27&type=movie&sort=vote_average.desc', color: '#f87171', type: 'movie' as const },
    { title: 'Top Drama (Series)', items: f(dramaTV), href: '/discover?genre=18&type=tv&sort=vote_average.desc', color: '#e879f9', type: 'tv' as const },
    { title: 'Top Crimen (Series)', items: f(crimeTV), href: '/discover?genre=80&type=tv&sort=vote_average.desc', color: '#94a3b8', type: 'tv' as const },
  ]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="page-inner" style={{ paddingTop: 28, paddingBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.8px', lineHeight: 1 }}>Lo mejor de todos los tiempos</h1>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 5 }}>Rankings basados en valoraciones de la comunidad TMDB</p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Link href="#movies" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted2)', fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 4, textDecoration: 'none' }}>Películas</Link>
              <Link href="#tv" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted2)', fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 4, textDecoration: 'none' }}>Series</Link>
              <Link href="#generos" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted2)', fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 4, textDecoration: 'none' }}>Géneros</Link>
              <Link href="#trending" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted2)', fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 4, textDecoration: 'none' }}>Tendencias</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="page-inner" style={{ paddingTop: 28, paddingBottom: 48, display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* All-time tops */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 48, alignItems: 'start' }}>

          <section id="movies">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 2, height: 16, background: 'rgba(239,68,68,0.7)', borderRadius: 2 }} />
              <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Top Películas</h2>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>{movies.length}</span>
            </div>
            <TopList items={movies} type="movie" />
            <div style={{ marginTop: 14 }}>
              <Link href="/discover?sort=vote_average.desc&type=movie&rating=7" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 11, fontWeight: 600, padding: '7px 14px', borderRadius: 6, textDecoration: 'none' }}>
                Ver todas →
              </Link>
            </div>
          </section>

          <section id="tv">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 2, height: 16, background: 'rgba(99,102,241,0.7)', borderRadius: 2 }} />
              <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Top Series</h2>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>{tvShows.length}</span>
            </div>
            <TopList items={tvShows} type="tv" />
            <div style={{ marginTop: 14 }}>
              <Link href="/discover?sort=vote_average.desc&type=tv&rating=7" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 11, fontWeight: 600, padding: '7px 14px', borderRadius: 6, textDecoration: 'none' }}>
                Ver todas →
              </Link>
            </div>
          </section>
        </div>

        {/* Genre tops */}
        <section id="generos">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 2, height: 16, background: 'var(--accent)', borderRadius: 2 }} />
            <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Rankings por Género</h2>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>Top 12 en cada categoría</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {GENRE_TOPS.map(g => (
              <GenreTopList key={g.title} items={g.items} title={g.title} accentColor={g.color} href={g.href} type={g.type} />
            ))}
          </div>
        </section>

        {/* Trending this week */}
        {trendingFiltered.length > 0 && (
          <section id="trending">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 2, height: 16, background: 'rgba(251,146,60,0.8)', borderRadius: 2 }} />
              <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Tendencias esta semana</h2>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>Lo más visto en TMDB</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 4, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '4px 12px' }}>
              {trendingFiltered.slice(0, 20).map((item: TmdbMovieResult, i: number) => (
                <RankedRow key={item.id} item={item} rank={i + 1} type={item.title ? 'movie' : 'tv'} />
              ))}
            </div>
          </section>
        )}

      </div>

      <style>{`
        .top-row { transition: background .1s; }
        .top-row:hover { background: var(--surface2) !important; border-radius: 6px; }
      `}</style>
    </div>
  )
}
