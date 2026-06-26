import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTVSeason, getTmdbTVDetail, getPosterUrl } from '@/services/tmdb'

export default async function SeasonPage({ params }: { params: Promise<{ id: string; n: string }> }) {
  const { id, n } = await params
  const seasonNumber = parseInt(n)
  if (isNaN(seasonNumber)) notFound()

  const [season, show] = await Promise.all([
    getTVSeason(id, seasonNumber),
    getTmdbTVDetail(id),
  ])
  if (!season) notFound()

  const showPoster = getPosterUrl(show?.poster_path ?? null, 'w185')
  const seasonPoster = getPosterUrl(season.poster_path, 'w342')
  const episodes = season.episodes ?? []

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(to bottom, var(--surface) 0%, var(--bg) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="page-inner" style={{ paddingTop: 36, paddingBottom: 28 }}>
          <Link href={`/tmdb/tv/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 20 }}>
            ← {show?.name ?? 'Serie'}
          </Link>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            {seasonPoster && (
              <div style={{ flexShrink: 0, width: 90, borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                <Image src={seasonPoster} alt={season.name} width={90} height={135} style={{ width: '100%', display: 'block' }} />
              </div>
            )}
            <div>
              <p style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 4 }}>{show?.name}</p>
              <h1 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: 8 }}>{season.name}</h1>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', fontSize: 12, fontWeight: 700, padding: '3px 12px', borderRadius: 999 }}>{episodes.length} episodios</span>
                {season.air_date && <span style={{ fontSize: 13, color: 'var(--muted)' }}>{season.air_date.slice(0,4)}</span>}
              </div>
              {season.overview && (
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginTop: 10, maxWidth: '60ch' }}>{season.overview}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Episode list */}
      <div className="page-inner" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {episodes.map(ep => {
            const still = ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : null
            const hasRating = ep.vote_average > 0
            return (
              <div key={ep.id} style={{
                display: 'flex', gap: 16, alignItems: 'flex-start',
                padding: '16px 0', borderBottom: '1px solid var(--border)',
              }}>
                <div style={{ flexShrink: 0, width: 34, textAlign: 'right', paddingTop: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>{ep.episode_number}</span>
                </div>
                {still ? (
                  <div style={{ flexShrink: 0, width: 'clamp(100px, 14vw, 160px)', aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden', background: 'var(--surface2)', position: 'relative' }}>
                    <Image src={still} alt={ep.name} fill sizes="160px" style={{ objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ flexShrink: 0, width: 'clamp(100px, 14vw, 160px)', aspectRatio: '16/9', borderRadius: 8, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📺</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>{ep.name}</p>
                    {hasRating && (
                      <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 800, flexShrink: 0 }}>★ {ep.vote_average.toFixed(1)}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginBottom: ep.overview ? 8 : 0 }}>
                    {ep.air_date && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{new Date(ep.air_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                    {ep.runtime && <span style={{ fontSize: 11, color: 'var(--muted)' }}>· {ep.runtime} min</span>}
                  </div>
                  {ep.overview && (
                    <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ep.overview}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Season navigation */}
        {show && show.number_of_seasons > 1 && (
          <div style={{ marginTop: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Otras temporadas</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Array.from({ length: show.number_of_seasons }, (_, i) => i + 1).map(s => (
                <Link key={s} href={`/tmdb/tv/${id}/temporada/${s}`} style={{
                  padding: '8px 16px', borderRadius: 8,
                  background: s === seasonNumber ? 'var(--accent)' : 'var(--surface2)',
                  color: s === seasonNumber ? '#000' : 'var(--muted)',
                  fontSize: 13, fontWeight: s === seasonNumber ? 800 : 500,
                  textDecoration: 'none', border: '1px solid var(--border)',
                }}>T{s}</Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
