import Image from 'next/image'
import Link from 'next/link'
import { multiSearch, getPosterUrl } from '@/services/tmdb'
import type { TmdbMovieResult, TmdbPersonResult } from '@/services/tmdb'

function MovieCard({ item, type }: { item: TmdbMovieResult; type: 'movie' | 'tv' }) {
  const poster = getPosterUrl(item.poster_path, 'w342')
  const title = item.title ?? item.name ?? ''
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null

  return (
    <Link href={`/tmdb/${type}/${item.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ position: 'relative', aspectRatio: '2/3', borderRadius: 10, overflow: 'hidden', background: 'var(--surface2)' }} className="search-card">
        {poster
          ? <Image src={poster} alt={title} fill sizes="(max-width: 640px) 45vw, 180px" style={{ objectFit: 'cover' }} />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">{type === 'tv' ? <><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></> : <><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></>}</svg></div>
        }
        {rating && (
          <div style={{ position: 'absolute', top: 7, right: 7, background: 'rgba(0,0,0,0.85)', color: 'var(--accent)', fontSize: 10, fontWeight: 800, padding: '3px 7px', borderRadius: 7 }}>
            ★ {rating}
          </div>
        )}
        <div style={{ position: 'absolute', top: 7, left: 7, background: type === 'tv' ? 'rgba(99,102,241,0.85)' : 'rgba(239,68,68,0.85)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 5 }}>
          {type === 'tv' ? 'SERIE' : 'PEL.'}
        </div>
      </div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
        {year && <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{year}</p>}
      </div>
    </Link>
  )
}

function PersonCard({ person }: { person: TmdbPersonResult }) {
  const photo = person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : null
  const knownFor = person.known_for?.slice(0, 2).map(k => k.title ?? k.name).filter(Boolean).join(', ')

  return (
    <Link href={`/person/${person.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ position: 'relative', aspectRatio: '2/3', borderRadius: 10, overflow: 'hidden', background: 'var(--surface2)' }} className="search-card">
        {photo
          ? <Image src={photo} alt={person.name} fill sizes="180px" style={{ objectFit: 'cover' }} />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
        }
        <div style={{ position: 'absolute', top: 7, left: 7, background: 'rgba(15,23,42,0.85)', color: '#94a3b8', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 5 }}>
          PERSONA
        </div>
      </div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{person.name}</p>
        {knownFor && <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{knownFor}</p>}
      </div>
    </Link>
  )
}

function SectionGrid({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 2, height: 16, background: 'var(--accent)', borderRadius: 2 }} />
        <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{title}</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: 14 }}>
        {children}
      </div>
    </section>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  if (!q) {
    return (
      <div style={{ '--bg': '#0b0a0f', '--surface': '#131220', '--surface2': '#1a192a', '--surface3': '#222134', background: 'var(--bg)', minHeight: '100vh' } as unknown as React.CSSProperties}>
        <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', borderTop: '3px solid rgba(255,255,255,0.08)' }}>
          <div className="page-inner" style={{ paddingTop: 28, paddingBottom: 20 }}>
            <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.8px', lineHeight: 1 }}>Buscar</h1>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 5 }}>Películas, series y personas</p>
          </div>
        </div>
        <div className="page-inner" style={{ paddingTop: 32, paddingBottom: 40, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>Prueba con alguno de estos términos</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Inception', 'Breaking Bad', 'Parasite', 'Interstellar', 'Christopher Nolan'].map(term => (
              <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted2)', fontSize: 12, fontWeight: 600, padding: '7px 16px', borderRadius: 6, textDecoration: 'none' }}>
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const results = await multiSearch(q)
  const totalResults = results.movies.length + results.tv.length + results.people.length

  return (
    <div style={{ '--bg': '#0b0a0f', '--surface': '#131220', '--surface2': '#1a192a', '--surface3': '#222134', background: 'var(--bg)', minHeight: '100vh' } as unknown as React.CSSProperties}>

      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', borderTop: '3px solid rgba(255,255,255,0.08)' }}>
        <div className="page-inner" style={{ paddingTop: 28, paddingBottom: 20 }}>
          <h1 style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.6px', lineHeight: 1 }}>
            &ldquo;<span style={{ color: 'var(--accent)' }}>{q}</span>&rdquo;
          </h1>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 5 }}>
            {totalResults === 0
              ? 'Sin resultados'
              : `${results.movies.length} películas · ${results.tv.length} series · ${results.people.length} personas`}
          </p>
        </div>
      </div>

      <div className="page-inner" style={{ paddingTop: 28, paddingBottom: 40 }}>
        {totalResults === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 32, paddingBottom: 32 }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Sin resultados</p>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>No encontramos nada para &ldquo;{q}&rdquo;. Prueba con otro término.</p>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted2)', fontSize: 12, fontWeight: 700, padding: '8px 18px', borderRadius: 8, textDecoration: 'none' }}>
              ← Inicio
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {results.movies.length > 0 && (
              <SectionGrid title={`Películas (${results.movies.length})`}>
                {results.movies.map(m => <MovieCard key={m.id} item={m} type="movie" />)}
              </SectionGrid>
            )}
            {results.tv.length > 0 && (
              <SectionGrid title={`Series (${results.tv.length})`}>
                {results.tv.map(s => <MovieCard key={s.id} item={s} type="tv" />)}
              </SectionGrid>
            )}
            {results.people.length > 0 && (
              <SectionGrid title={`Personas (${results.people.length})`}>
                {results.people.map(p => <PersonCard key={p.id} person={p} />)}
              </SectionGrid>
            )}
          </div>
        )}
      </div>

      <style>{`
        .search-card { transition: transform .25s ease, box-shadow .25s ease; }
        .search-card:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 20px 50px rgba(0,0,0,0.7); }
      `}</style>
    </div>
  )
}
