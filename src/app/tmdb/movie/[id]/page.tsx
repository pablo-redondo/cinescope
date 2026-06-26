import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTmdbMovieDetail, getBackdropUrl, getPosterUrl } from '@/services/tmdb'
import CastSection from '@/components/CastSection'
import TmdbCarousel from '@/components/TmdbCarousel'
import WatchProvidersSection from '@/components/WatchProvidersSection'
import TrailerButton from '@/components/TrailerButton'
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
  const recs = (movie.recommendations?.results ?? []).filter(m => m.poster_path).slice(0, 12)
  const similar = (movie.similar?.results ?? []).filter(m => m.poster_path).slice(0, 12)
  const display = recs.length ? recs : similar

  const directors = (movie.credits?.crew ?? []).filter(c => c.job === 'Director').slice(0, 2)
  const writers = (movie.credits?.crew ?? []).filter(c => ['Screenplay', 'Writer', 'Story'].includes(c.job)).slice(0, 2)
  const cast = (movie.credits?.cast ?? []).slice(0, 16)

  const providers = movie['watch/providers']?.results?.['ES'] ?? movie['watch/providers']?.results?.['US'] ?? null
  const ratingPercent = movie.vote_average ? (movie.vote_average / 10) * 100 : null
  const certification = pickCertification(movie.release_dates)

  const galleryBackdrops = (movie.images?.backdrops ?? [])
    .filter(b => b.vote_average > 0)
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 10)

  const companies = (movie.production_companies ?? []).filter(c => c.logo_path).slice(0, 5)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <div style={{ position: 'relative', height: 520, overflow: 'hidden' }}>
        {(backdrop || poster) && (
          <Image src={backdrop ?? poster!} alt="" fill priority sizes="100vw"
            style={{ objectFit: 'cover', filter: backdrop ? 'brightness(0.55)' : 'blur(60px)', opacity: backdrop ? 1 : 0.3 }} />
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
          padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)',
        }}>← Descubrir</Link>

        <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {poster && (
            <div style={{ flexShrink: 0, width: 'clamp(150px, 16vw, 240px)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 40px 100px -10px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08)' }}>
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
                    padding: '4px 12px', borderRadius: 999, textDecoration: 'none', backdropFilter: 'blur(8px)',
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
              {certification && (
                <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, letterSpacing: '0.05em' }}>{certification}</span>
              )}
            </div>

            {movie.vote_count > 0 && (
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{movie.vote_count.toLocaleString('es')} valoraciones</p>
            )}

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

        {/* Image gallery */}
        {galleryBackdrops.length > 1 && (
          <div style={{ marginTop: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Imágenes</p>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }} className="scrollbar-hide">
              {galleryBackdrops.map((img, i) => (
                <div key={i} style={{ flexShrink: 0, borderRadius: 10, overflow: 'hidden', position: 'relative', width: 'clamp(240px, 30vw, 380px)', aspectRatio: '16/9' }}>
                  <Image src={`https://image.tmdb.org/t/p/w780${img.file_path}`} alt="" fill sizes="380px" style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 52, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,300px)', gap: 48 }} className="detail-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {movie.overview && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Sinopsis</p>
                <p style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.8, opacity: 0.9 }}>{movie.overview}</p>
              </div>
            )}

            {(movie.keywords?.keywords?.length ?? 0) > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Temas</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {movie.keywords.keywords.slice(0, 20).map(kw => (
                    <Link key={kw.id} href={`/search?q=${encodeURIComponent(kw.name)}`} style={{
                      background: 'var(--surface2)', border: '1px solid var(--border)',
                      color: 'var(--muted)', fontSize: 11, fontWeight: 500,
                      padding: '4px 12px', borderRadius: 999, textDecoration: 'none',
                    }}>{kw.name}</Link>
                  ))}
                </div>
              </div>
            )}

            {cast.length > 0 && <CastSection cast={cast} />}

            {(movie.reviews?.results?.length ?? 0) > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Reseñas</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {movie.reviews.results.slice(0, 3).map(r => (
                    <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                          {r.author.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{r.author}</p>
                          <p style={{ fontSize: 11, color: 'var(--muted)' }}>{new Date(r.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}</p>
                        </div>
                        {r.author_details?.rating != null && (
                          <span style={{ marginLeft: 'auto', background: 'rgba(245,197,24,0.12)', border: '1px solid rgba(245,197,24,0.25)', color: 'var(--accent)', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 8, flexShrink: 0 }}>★ {r.author_details.rating}/10</span>
                        )}
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column' }}>
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
                <div key={label} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', padding: '14px 0' }}>
                  <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5 }}>{label}</p>
                  <p style={{ color: 'var(--text)', fontSize: 13, lineHeight: 1.55, opacity: 0.9 }}>{value}</p>
                </div>
              ))}
            </div>

            {providers && <WatchProvidersSection providers={providers} />}

            {companies.length > 0 && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
                <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Producción</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                  {companies.map(c => (
                    <div key={c.id} title={c.name} style={{ position: 'relative', height: 28, width: 80, flexShrink: 0 }}>
                      <Image src={`https://image.tmdb.org/t/p/w185${c.logo_path}`} alt={c.name} fill sizes="80px" style={{ objectFit: 'contain', filter: 'brightness(0) invert(0.6)' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
