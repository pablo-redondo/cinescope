import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPersonDetail, getPosterUrl } from '@/services/tmdb'
import type { TmdbPersonCredit } from '@/services/tmdb'

function CreditCard({ credit, type }: { credit: TmdbPersonCredit; type: 'movie' | 'tv' }) {
  const poster = getPosterUrl(credit.poster_path, 'w342')
  const title = credit.title ?? credit.name ?? ''
  const year = (credit.release_date ?? credit.first_air_date ?? '').slice(0, 4)
  const href = `/tmdb/${type}/${credit.id}`

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ position: 'relative', aspectRatio: '2/3', borderRadius: 10, overflow: 'hidden', background: 'var(--surface2)' }}>
        {poster ? (
          <Image src={poster} alt={title} fill sizes="180px" style={{ objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 28 }}>🎬</div>
        )}
        {credit.vote_average > 0 && (
          <div style={{ position: 'absolute', top: 7, right: 7, background: 'rgba(0,0,0,0.85)', color: 'var(--accent)', fontSize: 10, fontWeight: 800, padding: '3px 7px', borderRadius: 7, border: '1px solid rgba(245,197,24,0.2)' }}>
            ★ {credit.vote_average.toFixed(1)}
          </div>
        )}
      </div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{year}</p>
        {credit.character && <p style={{ fontSize: 10, color: 'rgba(136,146,164,0.7)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{credit.character}</p>}
      </div>
    </Link>
  )
}

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getPersonDetail(id)
  if (!data) notFound()

  const { detail, credits } = data
  const photo = getPosterUrl(detail.profile_path, 'w342')

  const sortByPop = (a: TmdbPersonCredit, b: TmdbPersonCredit) => (b.vote_count ?? 0) - (a.vote_count ?? 0)

  const movies = credits.cast
    .filter(c => c.media_type === 'movie' && c.poster_path)
    .sort(sortByPop)
    .slice(0, 20)

  const tvShows = credits.cast
    .filter(c => c.media_type === 'tv' && c.poster_path)
    .sort(sortByPop)
    .slice(0, 12)

  const directed = credits.crew
    .filter(c => c.job === 'Director' && c.poster_path)
    .sort(sortByPop)
    .slice(0, 12)

  const age = detail.birthday
    ? Math.floor((Date.now() - new Date(detail.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365))
    : null

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <div className="page-inner" style={{ paddingTop: 48, paddingBottom: 80 }}>

        {/* Header */}
        <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 56 }}>
          {photo ? (
            <div style={{ flexShrink: 0, width: 'clamp(120px, 14vw, 200px)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px -10px rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Image src={photo} alt={detail.name} width={200} height={300} style={{ width: '100%', display: 'block' }} priority />
            </div>
          ) : (
            <div style={{ flexShrink: 0, width: 'clamp(120px, 14vw, 200px)', aspectRatio: '2/3', borderRadius: 16, background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: 'var(--muted)' }}>
              {detail.name[0]}
            </div>
          )}

          <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                {detail.known_for_department === 'Acting' ? 'Actor / Actriz' : detail.known_for_department}
              </p>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, color: '#fff', letterSpacing: '-1.2px', lineHeight: 1 }}>
                {detail.name}
              </h1>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {detail.birthday && (
                <span style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 12, padding: '4px 12px', borderRadius: 999 }}>
                  {detail.birthday}{age && !detail.deathday ? ` · ${age} años` : ''}
                </span>
              )}
              {detail.deathday && (
                <span style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: 12, padding: '4px 12px', borderRadius: 999 }}>
                  † {detail.deathday}
                </span>
              )}
              {detail.place_of_birth && (
                <span style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 12, padding: '4px 12px', borderRadius: 999 }}>
                  📍 {detail.place_of_birth}
                </span>
              )}
            </div>

            {detail.biography && (
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7, maxWidth: '65ch', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {detail.biography}
              </p>
            )}

            {detail.imdb_id && (
              <Link href={`https://www.imdb.com/name/${detail.imdb_id}/`} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
                background: 'rgba(245,197,24,0.12)', border: '1px solid rgba(245,197,24,0.3)',
                color: 'var(--accent)', fontSize: 13, fontWeight: 700,
                padding: '8px 16px', borderRadius: 10, textDecoration: 'none',
              }}>IMDb ↗</Link>
            )}
          </div>
        </div>

        {/* Filmografía */}
        {movies.length > 0 && (
          <section style={{ marginBottom: 52 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 3, height: 20, background: 'var(--accent)', borderRadius: 2 }} />
              <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)', margin: 0 }}>Películas</h2>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{movies.length} títulos</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
              {movies.map(credit => (
                <CreditCard key={`m-${credit.id}`} credit={credit} type="movie" />
              ))}
            </div>
          </section>
        )}

        {directed.length > 0 && (
          <section style={{ marginBottom: 52 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 3, height: 20, background: 'var(--accent)', borderRadius: 2 }} />
              <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)', margin: 0 }}>Como director</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
              {directed.map(credit => (
                <CreditCard key={`d-${credit.id}`} credit={{ ...credit, character: undefined }} type="movie" />
              ))}
            </div>
          </section>
        )}

        {tvShows.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 3, height: 20, background: 'var(--accent)', borderRadius: 2 }} />
              <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)', margin: 0 }}>Series</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
              {tvShows.map(credit => (
                <CreditCard key={`t-${credit.id}`} credit={credit} type="tv" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
