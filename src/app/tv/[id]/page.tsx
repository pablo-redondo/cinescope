import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTVDetail, searchTV, normalizeSearchItem } from '@/services/tv'
import { normalizePoster } from '@/lib/omdb'
import WatchlistButton from '@/components/WatchlistButton'
import MediaCarousel from '@/components/ui/MediaCarousel'

export default async function TVDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const show = await getTVDetail(id)
  if (!show) notFound()

  const poster = normalizePoster(show.Poster)

  const searchTerm = show.Actors !== 'N/A' ? show.Actors.split(', ')[0] : null
  const similarRes = searchTerm ? await searchTV(searchTerm) : null
  const similar = similarRes?.Search
    ?.filter((s) => s.imdbID !== id)
    .slice(0, 12)
    .map(normalizeSearchItem) ?? []

  const genres = show.Genre !== 'N/A' ? show.Genre.split(', ') : []

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Cinematic backdrop */}
      <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
        {poster ? (
          <Image src={poster} alt="" fill priority
            sizes="100vw"
            style={{ objectFit: 'cover', transform: 'scale(1.1)', filter: 'blur(60px)', opacity: 0.3 }}
          />
        ) : null}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, var(--bg) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--bg) 0%, transparent 50%)' }} />
      </div>

      <div className="page-inner" style={{
        marginTop: -340,
        position: 'relative', zIndex: 10,
      }}>

        <Link href="/tv" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'var(--muted)', fontSize: 13, fontWeight: 600,
          textDecoration: 'none', marginBottom: 24,
        }}>
          ← Volver a series
        </Link>

        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>

          {poster && (
            <div style={{
              flexShrink: 0,
              width: 'clamp(150px, 16vw, 260px)',
              borderRadius: 18, overflow: 'hidden',
              boxShadow: '0 40px 100px -10px rgba(0,0,0,0.9)',
              outline: '1px solid rgba(255,255,255,0.08)',
            }}>
              <Image src={poster} alt={show.Title} width={260} height={390} style={{ width: '100%', display: 'block' }} priority />
            </div>
          )}

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>

            {/* Series badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                color: '#818cf8', fontSize: 10, fontWeight: 800,
                padding: '4px 12px', borderRadius: 999, letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>Serie</span>
              {genres.map((g) => (
                <span key={g} style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  color: 'var(--muted)', fontSize: 11, fontWeight: 600,
                  padding: '4px 12px', borderRadius: 999,
                }}>{g}</span>
              ))}
            </div>

            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 900, color: '#fff',
              letterSpacing: '-1.5px', lineHeight: 0.95,
            }}>
              {show.Title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              {show.imdbRating !== 'N/A' && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                  <span style={{ color: 'var(--accent)', fontSize: 18 }}>★</span>
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: 22 }}>{show.imdbRating}</span>
                  <span style={{ color: 'var(--muted)', fontSize: 13 }}>/10 · IMDb</span>
                  {show.imdbVotes && (
                    <span style={{ color: 'var(--muted)', fontSize: 12 }}>· {show.imdbVotes} votos</span>
                  )}
                </div>
              )}
              {show.Year && <span style={{ color: 'var(--muted)', fontSize: 14 }}>{show.Year}</span>}
              {show.totalSeasons && (
                <span style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  color: 'var(--text)', fontSize: 13, fontWeight: 700,
                  padding: '4px 12px', borderRadius: 8,
                }}>
                  {show.totalSeasons} temporadas
                </span>
              )}
              {show.Runtime && show.Runtime !== 'N/A' && (
                <span style={{ color: 'var(--muted)', fontSize: 14 }}>{show.Runtime}/ep</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 4 }}>
              <WatchlistButton movie={show} />
              <Link
                href={`https://www.imdb.com/title/${show.imdbID}/`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  color: 'var(--text)', fontSize: 13, fontWeight: 600,
                  padding: '11px 20px', borderRadius: 10, textDecoration: 'none',
                }}
              >
                <span style={{ color: 'var(--accent)', fontWeight: 900, fontSize: 12 }}>IMDb</span>
                Ver en IMDb ↗
              </Link>
            </div>

          </div>
        </div>

        {/* Details */}
        <div style={{
          marginTop: 48,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 280px',
          gap: 48,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
                Sinopsis
              </p>
              <p style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.75, opacity: 0.9 }}>{show.Plot}</p>
            </div>

            {show.Awards && show.Awards !== 'N/A' && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(245,197,24,0.08), rgba(245,197,24,0.03))',
                border: '1px solid rgba(245,197,24,0.15)',
                borderRadius: 14, padding: '16px 20px',
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <span style={{ fontSize: 20 }}>🏆</span>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Premios</p>
                  <p style={{ color: 'var(--text)', fontSize: 14, opacity: 0.85 }}>{show.Awards}</p>
                </div>
              </div>
            )}
          </div>

          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16, padding: 24,
            display: 'flex', flexDirection: 'column', gap: 20,
            height: 'fit-content',
          }}>
            {[
              { label: 'Reparto', value: show.Actors },
              { label: 'Idioma', value: show.Language },
              { label: 'Estreno', value: show.Released },
            ].filter(({ value }) => value && value !== 'N/A').map(({ label, value }) => (
              <div key={label} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                  {label}
                </p>
                <p style={{ color: 'var(--text)', fontSize: 13, lineHeight: 1.55, opacity: 0.9 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 64 }} />
      </div>

      {similar.length > 0 && (
        <div style={{ paddingBottom: 64 }}>
          <MediaCarousel items={similar} title={`Más con ${searchTerm}`} subtitle="Puede que también te guste" />
        </div>
      )}

    </div>
  )
}
