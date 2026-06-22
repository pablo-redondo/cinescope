import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMovieDetail, searchMovies, normalizeSearchItem } from '@/services/movies'
import { normalizePoster } from '@/lib/omdb'
import WatchlistButton from '@/components/WatchlistButton'
import MediaCarousel from '@/components/ui/MediaCarousel'

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const movie = await getMovieDetail(id)
  if (!movie) notFound()

  const poster = normalizePoster(movie.Poster)

  const searchTerm = movie.Director !== 'N/A'
    ? movie.Director.split(', ')[0]
    : movie.Actors.split(', ')[0]
  const similarRes = searchTerm ? await searchMovies(searchTerm) : null
  const similar = similarRes?.Search
    ?.filter((s) => s.imdbID !== id)
    .slice(0, 12)
    .map(normalizeSearchItem) ?? []

  const genres = movie.Genre !== 'N/A' ? movie.Genre.split(', ') : []

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

      {/* Content — overlaps the backdrop */}
      <div className="page-inner" style={{
        marginTop: -340,
        position: 'relative', zIndex: 10,
      }}>

        {/* Back link */}
        <Link href="/movies" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'var(--muted)', fontSize: 13, fontWeight: 600,
          textDecoration: 'none', marginBottom: 24,
          transition: 'color .2s',
        }}>
          ← Volver a películas
        </Link>

        {/* Main card */}
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>

          {/* Poster */}
          {poster && (
            <div style={{
              flexShrink: 0,
              width: 'clamp(150px, 16vw, 260px)',
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: '0 40px 100px -10px rgba(0,0,0,0.9)',
              outline: '1px solid rgba(255,255,255,0.08)',
            }}>
              <Image src={poster} alt={movie.Title} width={260} height={390} style={{ width: '100%', display: 'block' }} priority />
            </div>
          )}

          {/* Info */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>

            {/* Genres */}
            {genres.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {genres.map((g) => (
                  <span key={g} style={{
                    background: 'var(--surface2)', border: '1px solid var(--border)',
                    color: 'var(--muted)', fontSize: 11, fontWeight: 600,
                    padding: '4px 12px', borderRadius: 999,
                  }}>{g}</span>
                ))}
              </div>
            )}

            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 900, color: '#fff',
              letterSpacing: '-1.5px', lineHeight: 0.95,
            }}>
              {movie.Title}
            </h1>

            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              {movie.imdbRating !== 'N/A' && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                  <span style={{ color: 'var(--accent)', fontSize: 18 }}>★</span>
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: 22 }}>{movie.imdbRating}</span>
                  <span style={{ color: 'var(--muted)', fontSize: 13 }}>/10 · IMDb</span>
                  {movie.imdbVotes && (
                    <span style={{ color: 'var(--muted)', fontSize: 12 }}>· {movie.imdbVotes} votos</span>
                  )}
                </div>
              )}
              {movie.Metascore && movie.Metascore !== 'N/A' && (
                <div style={{
                  background: parseInt(movie.Metascore) >= 61 ? '#2d6a2d' : parseInt(movie.Metascore) >= 40 ? '#7a6020' : '#6a2020',
                  color: '#fff', fontWeight: 900, fontSize: 13,
                  padding: '4px 10px', borderRadius: 6,
                }}>
                  {movie.Metascore} <span style={{ fontWeight: 500, opacity: 0.8 }}>Metascore</span>
                </div>
              )}
              {movie.Year && <span style={{ color: 'var(--muted)', fontSize: 14 }}>{movie.Year}</span>}
              {movie.Runtime !== 'N/A' && <span style={{ color: 'var(--muted)', fontSize: 14 }}>{movie.Runtime}</span>}
              {movie.Rated !== 'N/A' && (
                <span style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  color: 'var(--muted)', fontSize: 11, fontWeight: 700,
                  padding: '3px 8px', borderRadius: 5,
                }}>{movie.Rated}</span>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 4 }}>
              <WatchlistButton movie={movie} />
              <Link
                href={`https://www.imdb.com/title/${movie.imdbID}/`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  color: 'var(--text)', fontSize: 13, fontWeight: 600,
                  padding: '11px 20px', borderRadius: 10, textDecoration: 'none',
                  transition: 'border-color .2s',
                }}
              >
                <span style={{ color: 'var(--accent)', fontWeight: 900, fontSize: 12 }}>IMDb</span>
                Ver en IMDb ↗
              </Link>
            </div>

          </div>
        </div>

        {/* Details section */}
        <div style={{
          marginTop: 48,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 280px',
          gap: 48,
        }}>

          {/* Left — plot */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
                Sinopsis
              </p>
              <p style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.75, opacity: 0.9 }}>{movie.Plot}</p>
            </div>

            {movie.Awards && movie.Awards !== 'N/A' && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(245,197,24,0.08), rgba(245,197,24,0.03))',
                border: '1px solid rgba(245,197,24,0.15)',
                borderRadius: 14, padding: '16px 20px',
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <span style={{ fontSize: 20 }}>🏆</span>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Premios</p>
                  <p style={{ color: 'var(--text)', fontSize: 14, opacity: 0.85 }}>{movie.Awards}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right — credits */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16, padding: 24,
            display: 'flex', flexDirection: 'column', gap: 20,
            height: 'fit-content',
          }}>
            {[
              { label: 'Director', value: movie.Director },
              { label: 'Reparto', value: movie.Actors },
              { label: 'País', value: movie.Language },
              { label: 'Estreno', value: movie.Released },
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

      {/* Similar */}
      {similar.length > 0 && (
        <div style={{ paddingBottom: 64 }}>
          <MediaCarousel items={similar} title={`Más de ${searchTerm}`} subtitle="Puede que también te guste" />
        </div>
      )}

    </div>
  )
}
