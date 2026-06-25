import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTmdbMovieDetail, getBackdropUrl, getPosterUrl } from '@/services/tmdb'
import CastSection from '@/components/CastSection'
import TmdbCarousel from '@/components/TmdbCarousel'
import WatchProvidersSection from '@/components/WatchProvidersSection'
import TrailerButton from '@/components/TrailerButton'

function pickTrailer(videos: { key: string; site: string; type: string; official: boolean }[]) {
  const yt = videos.filter(v => v.site === 'YouTube')
  return (yt.find(v => v.type === 'Trailer' && v.official) ?? yt.find(v => v.type === 'Trailer') ?? yt[0])?.key ?? null
}

export default async function TmdbMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const movie = await getTmdbMovieDetail(id)
  if (!movie) notFound()

  const poster = getPosterUrl(movie.poster_path, 'w500')
  const backdrop = getBackdropUrl(movie.backdrop_path, 'w1280')
  const trailerKey = pickTrailer(movie.videos?.results ?? [])
  const recs = (movie.recommendations?.results ?? []).filter(m => m.poster_path).slice(0, 12)
  const similar = (movie.similar?.results ?? []).filter(m => m.poster_path).slice(0, 12)
  const display = recs.length ? recs : similar

  const directors = (movie.credits?.crew ?? []).filter(c => c.job === 'Director').slice(0, 2)
  const writers = (movie.credits?.crew ?? []).filter(c => ['Screenplay', 'Writer', 'Story'].includes(c.job)).slice(0, 2)
  const cast = (movie.credits?.cast ?? []).slice(0, 12)

  const providers = movie['watch/providers']?.results?.['ES'] ?? movie['watch/providers']?.results?.['US'] ?? null

  const ratingPercent = movie.vote_average ? (movie.vote_average / 10) * 100 : null

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <div style={{ position: 'relative', height: 520, overflow: 'hidden' }}>
        {(backdrop || poster) && (
          <Image
            src={backdrop ?? poster!}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: 'cover',
              filter: backdrop ? 'brightness(0.55)' : 'blur(60px)',
              opacity: backdrop ? 1 : 0.3,
            }}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(20,24,32,0.1) 0%, var(--bg) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--bg) 0%, rgba(20,24,32,0.2) 55%, transparent 100%)' }} />
      </div>

      <div className="page-inner" style={{ marginTop: -440, position: 'relative', zIndex: 10 }}>

        <Link href="/discover" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600,
          textDecoration: 'none', marginBottom: 28,
          background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)',
          padding: '6px 14px', borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.1)',
        }}>← Descubrir</Link>

        <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {poster && (
            <div style={{
              flexShrink: 0, width: 'clamp(150px, 16vw, 240px)',
              borderRadius: 18, overflow: 'hidden',
              boxShadow: '0 40px 100px -10px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08)',
            }}>
              <Image src={poster} alt={movie.title} width={240} height={360} style={{ width: '100%', display: 'block' }} priority />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 14, paddingTop: poster ? 8 : 0 }}>

            {movie.genres?.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {movie.genres.slice(0, 4).map(g => (
                  <Link key={g.id} href={`/discover?genre=${g.id}&type=movie`} style={{
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 600,
                    padding: '4px 12px', borderRadius: 999, textDecoration: 'none',
                    backdropFilter: 'blur(8px)',
                  }}>{g.name}</Link>
                ))}
              </div>
            )}

            {movie.tagline && (
              <p style={{ fontSize: 13, color: 'var(--accent)', fontStyle: 'italic', opacity: 0.85 }}>&ldquo;{movie.tagline}&rdquo;</p>
            )}

            <h1 style={{ fontSize: 'clamp(28px, 4vw, 54px)', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', lineHeight: 0.95, textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
              {movie.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              {movie.vote_average > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ color: 'var(--accent)', fontSize: 20 }}>★</span>
                    <span style={{ color: '#fff', fontWeight: 900, fontSize: 24 }}>{movie.vote_average.toFixed(1)}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>/10 TMDB</span>
                  </div>
                  {ratingPercent !== null && (
                    <div style={{ width: 52, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${ratingPercent}%`, height: '100%', background: 'var(--accent)', borderRadius: 2 }} />
                    </div>
                  )}
                </div>
              )}
              {movie.release_date && <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: 13, padding: '3px 10px', borderRadius: 6 }}>{movie.release_date.slice(0,4)}</span>}
              {movie.runtime && <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{movie.runtime} min</span>}
            </div>

            {movie.overview && (
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '60ch' }}>
                {movie.overview}
              </p>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 2 }}>
              {trailerKey && <TrailerButton videoKey={trailerKey} />}
              {movie.imdb_id && (
                <Link href={`https://www.imdb.com/title/${movie.imdb_id}/`} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(245,197,24,0.12)', border: '1px solid rgba(245,197,24,0.3)',
                  color: 'var(--accent)', fontSize: 13, fontWeight: 700,
                  padding: '10px 18px', borderRadius: 10, textDecoration: 'none',
                }}>IMDb ↗</Link>
              )}
            </div>
          </div>
        </div>

        {/* Collection */}
        {movie.belongs_to_collection && (
          <Link href={`/tmdb/collection/${movie.belongs_to_collection.id}`} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            marginTop: 40,
            background: 'linear-gradient(135deg, rgba(245,197,24,0.06), rgba(245,197,24,0.02))',
            border: '1px solid rgba(245,197,24,0.12)',
            borderRadius: 16, padding: '18px 24px',
            textDecoration: 'none', flexWrap: 'wrap',
          }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Parte de la saga</p>
              <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)' }}>{movie.belongs_to_collection.name}</p>
            </div>
            <span style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700 }}>Ver saga completa →</span>
          </Link>
        )}

        <div style={{ marginTop: 52, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,300px)', gap: 48 }} className="detail-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {movie.overview && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Sinopsis</p>
                <p style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.8, opacity: 0.9 }}>{movie.overview}</p>
              </div>
            )}
            {cast.length > 0 && <CastSection cast={cast} />}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column' }}>
              {[
                { label: 'Dirección', value: directors.map(d => d.name).join(', ') || null },
                { label: 'Guion', value: writers.map(w => w.name).join(', ') || null },
                { label: 'Estreno', value: movie.release_date },
                { label: 'Duración', value: movie.runtime ? `${movie.runtime} min` : null },
                { label: 'Presupuesto', value: movie.budget ? `$${(movie.budget / 1e6).toFixed(0)}M` : null },
                { label: 'Recaudación', value: movie.revenue ? `$${(movie.revenue / 1e6).toFixed(0)}M` : null },
                { label: 'Idiomas', value: movie.spoken_languages?.map(l => l.name).join(', ') || null },
              ].filter(({ value }) => value).map(({ label, value }, i, arr) => (
                <div key={label} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', padding: '14px 0' }}>
                  <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5 }}>{label}</p>
                  <p style={{ color: 'var(--text)', fontSize: 13, lineHeight: 1.55, opacity: 0.9 }}>{value}</p>
                </div>
              ))}
            </div>
            {providers && <WatchProvidersSection providers={providers} />}
          </div>
        </div>

        <div style={{ height: 72 }} />
      </div>

      {display.length > 0 && (
        <div style={{ paddingBottom: 72 }}>
          <TmdbCarousel items={display} title="También te puede gustar" type="movie" />
        </div>
      )}

      <style>{`
        @media (max-width: 640px) { .detail-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
