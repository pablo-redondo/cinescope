import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTmdbMovieDetail, getBackdropUrl, getPosterUrl } from '@/services/tmdb'
import CastSection from '@/components/CastSection'
import TmdbCarousel from '@/components/TmdbCarousel'
import WatchProvidersSection from '@/components/WatchProvidersSection'
import TrailerButton from '@/components/TrailerButton'
import TmdbWatchlistButton from '@/components/TmdbWatchlistButton'
import type { TmdbReleaseDateEntry } from '@/services/tmdb'

function pickTrailer(videos: { key: string; site: string; type: string; official: boolean }[]) {
  const yt = videos.filter(v => v.site === 'YouTube')
  return (yt.find(v => v.type === 'Trailer' && v.official) ?? yt.find(v => v.type === 'Trailer') ?? yt[0])?.key ?? null
}

function pickCertification(releaseDates: { results: { iso_3166_1: string; release_dates: TmdbReleaseDateEntry[] }[] } | undefined): string | null {
  if (!releaseDates?.results) return null
  const byCountry = (code: string) => {
    const country = releaseDates.results.find(r => r.iso_3166_1 === code)
    if (!country) return null
    const theatrical = country.release_dates.find(d => d.release_type === 3 && d.certification)
    const any = country.release_dates.find(d => d.certification)
    return (theatrical ?? any)?.certification ?? null
  }
  return byCountry('ES') ?? byCountry('US') ?? null
}

export default async function TmdbMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const movie = await getTmdbMovieDetail(id)
  if (!movie) notFound()

  const poster = getPosterUrl(movie.poster_path, 'w500')
  const backdrop = getBackdropUrl(movie.backdrop_path, 'w1280')
  const trailerKey = pickTrailer(movie.videos?.results ?? [])
  const recs = (movie.recommendations?.results ?? []).filter(m => m.poster_path).slice(0, 14)
  const similar = (movie.similar?.results ?? []).filter(m => m.poster_path).slice(0, 14)
  const display = recs.length ? recs : similar

  const directors = (movie.credits?.crew ?? []).filter(c => c.job === 'Director').slice(0, 2)
  const writers = (movie.credits?.crew ?? []).filter(c => ['Screenplay', 'Writer', 'Story'].includes(c.job)).slice(0, 2)
  const cast = (movie.credits?.cast ?? []).slice(0, 16)

  const providers = movie['watch/providers']?.results?.['ES'] ?? movie['watch/providers']?.results?.['US'] ?? null
  const certification = pickCertification(movie.release_dates)

  const galleryBackdrops = (movie.images?.backdrops ?? [])
    .filter(b => b.vote_average > 0)
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 12)

  const companies = (movie.production_companies ?? []).filter(c => c.logo_path).slice(0, 6)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Cinematic backdrop */}
      <div style={{ position: 'relative', height: 540, overflow: 'hidden' }}>
        {(backdrop || poster) && (
          <Image src={backdrop ?? poster!} alt="" fill priority sizes="100vw"
            style={{ objectFit: 'cover', filter: 'brightness(0.35) saturate(1.2)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(9,9,15,0.15) 0%, rgba(9,9,15,0.6) 60%, var(--bg) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--bg) 0%, rgba(9,9,15,0.3) 50%, transparent 100%)' }} />
      </div>

      <div className="page-inner" style={{ marginTop: -480, position: 'relative', zIndex: 10 }}>

        {/* Back link */}
        <Link href="/discover" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600,
          textDecoration: 'none', marginBottom: 24,
        }}>← Descubrir</Link>

        {/* Hero row */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {poster && (
            <div style={{ flexShrink: 0, width: 'clamp(140px, 14vw, 220px)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 32px 80px -8px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.06)' }}>
              <Image src={poster} alt={movie.title} width={220} height={330} style={{ width: '100%', display: 'block' }} priority />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>

            {/* Genre chips */}
            {movie.genres?.length > 0 && (
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {movie.genres.slice(0, 4).map(g => (
                  <Link key={g.id} href={`/discover?genre=${g.id}&type=movie`} style={{
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 600,
                    padding: '3px 10px', borderRadius: 4, textDecoration: 'none',
                  }}>{g.name}</Link>
                ))}
              </div>
            )}

            {movie.tagline && (
              <p style={{ fontSize: 12, color: 'var(--accent)', fontStyle: 'italic', opacity: 0.8 }}>&ldquo;{movie.tagline}&rdquo;</p>
            )}

            <h1 style={{ fontSize: 'clamp(26px, 4vw, 52px)', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', lineHeight: 0.93, textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}>
              {movie.title}
            </h1>

            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              {movie.vote_average > 0 && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ color: 'var(--accent)', fontSize: 16 }}>★</span>
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: 22 }}>{movie.vote_average.toFixed(1)}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>/10</span>
                </div>
              )}
              {movie.vote_count > 0 && (
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{movie.vote_count.toLocaleString('es')} votos</span>
              )}
              {movie.release_date && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{movie.release_date.slice(0, 4)}</span>}
              {movie.runtime && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{movie.runtime} min</span>}
              {certification && (
                <span style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, letterSpacing: '0.05em' }}>{certification}</span>
              )}
            </div>

            {movie.overview && (
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '60ch' }}>
                {movie.overview}
              </p>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 4 }}>
              {trailerKey && <TrailerButton videoKey={trailerKey} />}
              <TmdbWatchlistButton
                tmdbId={movie.id} type="movie" title={movie.title}
                posterPath={movie.poster_path}
                year={movie.release_date?.slice(0, 4) ?? ''}
                rating={movie.vote_average > 0 ? movie.vote_average : null}
              />
              {movie.imdb_id && (
                <Link href={`https://www.imdb.com/title/${movie.imdb_id}/`} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.2)',
                  color: 'var(--accent)', fontSize: 12, fontWeight: 700,
                  padding: '9px 16px', borderRadius: 8, textDecoration: 'none',
                }}>IMDb ↗</Link>
              )}
            </div>
          </div>
        </div>

        {/* Collection banner */}
        {movie.belongs_to_collection && (
          <Link href={`/tmdb/collection/${movie.belongs_to_collection.id}`} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            marginTop: 32, background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '14px 20px', textDecoration: 'none', flexWrap: 'wrap',
          }}>
            <div>
              <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>Parte de la saga</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{movie.belongs_to_collection.name}</p>
            </div>
            <span style={{ color: 'var(--muted2)', fontSize: 12, fontWeight: 600 }}>Ver saga →</span>
          </Link>
        )}

        {/* Image gallery */}
        {galleryBackdrops.length > 1 && (
          <div style={{ marginTop: 36 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Imágenes</p>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }} className="scrollbar-hide">
              {galleryBackdrops.map((img, i) => (
                <div key={i} style={{ flexShrink: 0, borderRadius: 8, overflow: 'hidden', position: 'relative', width: 'clamp(200px, 26vw, 340px)', aspectRatio: '16/9', background: 'var(--surface2)' }}>
                  <Image src={`https://image.tmdb.org/t/p/w780${img.file_path}`} alt="" fill sizes="340px" style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main content grid */}
        <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,280px)', gap: 40 }} className="detail-grid">

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {movie.overview && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Sinopsis</p>
                <p style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.8, opacity: 0.85 }}>{movie.overview}</p>
              </div>
            )}

            {(movie.keywords?.keywords?.length ?? 0) > 0 && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Temas</p>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {movie.keywords.keywords.slice(0, 20).map(kw => (
                    <Link key={kw.id} href={`/search?q=${encodeURIComponent(kw.name)}`} style={{
                      background: 'var(--surface2)', border: '1px solid var(--border)',
                      color: 'var(--muted)', fontSize: 11, padding: '3px 10px', borderRadius: 4, textDecoration: 'none',
                    }}>{kw.name}</Link>
                  ))}
                </div>
              </div>
            )}

            {cast.length > 0 && <CastSection cast={cast} />}

            {(movie.reviews?.results?.length ?? 0) > 0 && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Reseñas</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {movie.reviews.results.slice(0, 3).map(r => (
                    <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                          {r.author.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{r.author}</p>
                          <p style={{ fontSize: 10, color: 'var(--muted)' }}>{new Date(r.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}</p>
                        </div>
                        {r.author_details?.rating != null && (
                          <span style={{ marginLeft: 'auto', background: 'var(--accent2)', border: '1px solid rgba(245,197,24,0.2)', color: 'var(--accent)', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6, flexShrink: 0 }}>★ {r.author_details.rating}/10</span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Info card */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
              {[
                { label: 'Dirección', value: directors.map(d => d.name).join(', ') || null },
                { label: 'Guion', value: writers.map(w => w.name).join(', ') || null },
                { label: 'Estreno', value: movie.release_date },
                { label: 'Duración', value: movie.runtime ? `${movie.runtime} min` : null },
                { label: 'Clasificación', value: certification },
                { label: 'Estado', value: movie.status === 'Released' ? 'Estrenada' : movie.status || null },
                { label: 'Presupuesto', value: movie.budget ? `$${(movie.budget / 1e6).toFixed(0)}M` : null },
                { label: 'Recaudación', value: movie.revenue ? `$${(movie.revenue / 1e6).toFixed(0)}M` : null },
                { label: 'Idiomas', value: movie.spoken_languages?.map(l => l.name).join(', ') || null },
              ].filter(({ value }) => value).map(({ label, value }, i, arr) => (
                <div key={label} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', padding: '11px 0' }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
                  <p style={{ color: 'var(--text)', fontSize: 12, lineHeight: 1.5, opacity: 0.85 }}>{value}</p>
                </div>
              ))}
            </div>

            {providers && <WatchProvidersSection providers={providers} />}

            {companies.length > 0 && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 18 }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Producción</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                  {companies.map(c => (
                    <div key={c.id} title={c.name} style={{ background: '#fff', borderRadius: 6, padding: '5px 9px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, width: 82, flexShrink: 0 }}>
                      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Image src={`https://image.tmdb.org/t/p/w185${c.logo_path}`} alt={c.name} fill sizes="82px" style={{ objectFit: 'contain' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ height: 64 }} />
      </div>

      {display.length > 0 && (
        <div style={{ paddingBottom: 64 }}>
          <TmdbCarousel items={display} title="También te puede gustar" type="movie" />
        </div>
      )}

      <style>{`
        @media (max-width: 680px) { .detail-grid { grid-template-columns: 1fr !important; } }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
