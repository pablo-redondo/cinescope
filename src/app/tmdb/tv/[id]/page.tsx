import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTmdbTVDetail, getBackdropUrl, getPosterUrl } from '@/services/tmdb'
import CastSection from '@/components/CastSection'
import TmdbCarousel from '@/components/TmdbCarousel'
import WatchProvidersSection from '@/components/WatchProvidersSection'
import TrailerButton from '@/components/TrailerButton'
import TmdbWatchlistButton from '@/components/TmdbWatchlistButton'

function pickTrailer(videos: { key: string; site: string; type: string; official: boolean }[]) {
  const yt = videos.filter(v => v.site === 'YouTube')
  return (yt.find(v => v.type === 'Trailer' && v.official) ?? yt.find(v => v.type === 'Trailer') ?? yt[0])?.key ?? null
}

function pickContentRating(contentRatings: { results: { iso_3166_1: string; rating: string }[] } | undefined): string | null {
  if (!contentRatings?.results) return null
  const es = contentRatings.results.find(r => r.iso_3166_1 === 'ES')?.rating
  const us = contentRatings.results.find(r => r.iso_3166_1 === 'US')?.rating
  return es ?? us ?? null
}

export default async function TmdbTVPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const show = await getTmdbTVDetail(id)
  if (!show) notFound()

  const poster = getPosterUrl(show.poster_path, 'w500')
  const backdrop = getBackdropUrl(show.backdrop_path, 'w1280')
  const trailerKey = pickTrailer(show.videos?.results ?? [])
  const recs = (show.recommendations?.results ?? []).filter(s => s.poster_path).slice(0, 14)
  const similar = (show.similar?.results ?? []).filter(s => s.poster_path).slice(0, 14)
  const display = recs.length ? recs : similar
  const cast = (show.credits?.cast ?? []).slice(0, 16)
  const providers = show['watch/providers']?.results?.['ES'] ?? show['watch/providers']?.results?.['US'] ?? null
  const contentRating = pickContentRating(show.content_ratings)

  const seasons = (show.seasons ?? []).filter(s => s.season_number > 0)

  const galleryBackdrops = (show.images?.backdrops ?? [])
    .filter(b => b.vote_average > 0)
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 10)

  const companies = (show.production_companies ?? []).filter(c => c.logo_path).slice(0, 6)

  const isEnded = show.status === 'Ended' || show.status === 'Canceled'

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
        <Link href="/tv" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600,
          textDecoration: 'none', marginBottom: 24,
        }}>← Series</Link>

        {/* Hero row */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {poster && (
            <div style={{ flexShrink: 0, width: 'clamp(140px, 14vw, 220px)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 32px 80px -8px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.06)' }}>
              <Image src={poster} alt={show.name} width={220} height={330} style={{ width: '100%', display: 'block' }} priority />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>

            {/* Genre chips */}
            {show.genres?.length > 0 && (
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {show.genres.slice(0, 4).map(g => (
                  <Link key={g.id} href={`/discover?genre=${g.id}&type=tv`} style={{
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 600,
                    padding: '3px 10px', borderRadius: 4, textDecoration: 'none',
                  }}>{g.name}</Link>
                ))}
              </div>
            )}

            {show.tagline && (
              <p style={{ fontSize: 12, color: 'var(--accent)', fontStyle: 'italic', opacity: 0.8 }}>&ldquo;{show.tagline}&rdquo;</p>
            )}

            <h1 style={{ fontSize: 'clamp(26px, 4vw, 52px)', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', lineHeight: 0.95, textShadow: '0 2px 24px rgba(0,0,0,0.6)' }}>
              {show.name}
            </h1>

            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {show.vote_average > 0 && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ color: 'var(--accent)', fontSize: 16 }}>★</span>
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>{show.vote_average.toFixed(1)}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
                    /10 · {show.vote_count > 0 ? show.vote_count.toLocaleString('es') + ' votos' : 'TMDB'}
                  </span>
                </div>
              )}
              {show.first_air_date && (
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>·</span>
              )}
              {show.first_air_date && (
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>{show.first_air_date.slice(0, 4)}</span>
              )}
              {show.number_of_seasons > 0 && (
                <>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>·</span>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>{show.number_of_seasons} temp.</span>
                </>
              )}
              {show.number_of_episodes > 0 && (
                <>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>·</span>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>{show.number_of_episodes} ep.</span>
                </>
              )}
              {contentRating && (
                <span style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>{contentRating}</span>
              )}
              {show.status && (
                <span style={{
                  background: isEnded ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
                  border: `1px solid ${isEnded ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`,
                  color: isEnded ? '#fca5a5' : '#86efac',
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                }}>
                  {show.status === 'Ended' ? 'Finalizada' : show.status === 'Canceled' ? 'Cancelada' : 'En emisión'}
                </span>
              )}
            </div>

            {show.overview && (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '60ch' }}>
                {show.overview}
              </p>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 4 }}>
              {trailerKey && <TrailerButton videoKey={trailerKey} />}
              <TmdbWatchlistButton
                tmdbId={show.id}
                type="tv"
                title={show.name}
                posterPath={show.poster_path}
                year={show.first_air_date?.slice(0, 4) ?? ''}
                rating={show.vote_average > 0 ? show.vote_average : null}
              />
            </div>
          </div>
        </div>

        {/* Seasons */}
        {seasons.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Temporadas</p>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }} className="scrollbar-hide">
              {seasons.map(season => {
                const sp = getPosterUrl(season.poster_path, 'w185')
                return (
                  <Link key={season.id} href={`/tmdb/tv/${id}/temporada/${season.season_number}`} style={{ flexShrink: 0, width: 100, display: 'flex', flexDirection: 'column', gap: 6, textDecoration: 'none' }} className="season-card">
                    <div style={{ borderRadius: 8, overflow: 'hidden', background: 'var(--surface2)', aspectRatio: '2/3', position: 'relative' }}>
                      {sp ? (
                        <Image src={sp} alt={season.name} fill sizes="100px" style={{ objectFit: 'cover', transition: 'transform .4s ease' }} className="season-poster" />
                      ) : (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 11, textAlign: 'center', padding: 8 }}>
                          T{season.season_number}
                        </div>
                      )}
                    </div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{season.name}</p>
                    <p style={{ fontSize: 9, color: 'var(--muted)' }}>{season.episode_count} ep{season.air_date ? ` · ${season.air_date.slice(0, 4)}` : ''}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Image gallery */}
        {galleryBackdrops.length > 1 && (
          <div style={{ marginTop: 32 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Imágenes</p>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="scrollbar-hide">
              {galleryBackdrops.map((img, i) => (
                <div key={i} style={{ flexShrink: 0, borderRadius: 8, overflow: 'hidden', position: 'relative', width: 'clamp(200px, 26vw, 340px)', aspectRatio: '16/9' }}>
                  <Image src={`https://image.tmdb.org/t/p/w780${img.file_path}`} alt="" fill sizes="340px" style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main content + sidebar */}
        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: 36, alignItems: 'start' }} className="detail-grid">

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            {show.overview && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Sinopsis</p>
                <p style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.75, opacity: 0.85 }}>{show.overview}</p>
              </div>
            )}

            {(show.created_by?.length ?? 0) > 0 && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Creado por</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {show.created_by!.map(c => (
                    <span key={c.id} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 4 }}>{c.name}</span>
                  ))}
                </div>
              </div>
            )}

            {(show.keywords?.results?.length ?? 0) > 0 && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Temas</p>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {show.keywords.results.slice(0, 20).map(kw => (
                    <Link key={kw.id} href={`/search?q=${encodeURIComponent(kw.name)}`} style={{
                      background: 'var(--surface2)', border: '1px solid var(--border)',
                      color: 'var(--muted)', fontSize: 11, fontWeight: 500,
                      padding: '3px 10px', borderRadius: 4, textDecoration: 'none',
                    }}>{kw.name}</Link>
                  ))}
                </div>
              </div>
            )}

            {cast.length > 0 && <CastSection cast={cast} />}

            {(show.reviews?.results?.length ?? 0) > 0 && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Reseñas</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {show.reviews.results.slice(0, 3).map(r => (
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
                          <span style={{ marginLeft: 'auto', background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.2)', color: 'var(--accent)', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>★ {r.author_details.rating}/10</span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '4px 18px', display: 'flex', flexDirection: 'column' }}>
              {[
                { label: 'Red', value: show.networks?.map(n => n.name).join(', ') || null },
                { label: 'Estreno', value: show.first_air_date },
                { label: 'Último ep.', value: show.last_air_date || null },
                { label: 'Duración ep.', value: show.episode_run_time?.[0] ? `${show.episode_run_time[0]} min` : null },
                { label: 'Clasificación', value: contentRating },
                { label: 'Idioma orig.', value: show.original_name ? show.original_name : null },
                { label: 'Idiomas', value: show.spoken_languages?.map(l => l.name).join(', ') || null },
              ].filter(({ value }) => value).map(({ label, value }, i, arr) => (
                <div key={label} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', padding: '11px 0' }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
                  <p style={{ color: 'var(--text)', fontSize: 12, lineHeight: 1.5, opacity: 0.85 }}>{value}</p>
                </div>
              ))}
            </div>

            {providers && <WatchProvidersSection providers={providers} />}

            {companies.length > 0 && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px' }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Producción</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                  {companies.map(c => (
                    <div key={c.id} title={c.name} style={{ background: '#fff', borderRadius: 6, padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, width: 82, flexShrink: 0 }}>
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

        <div style={{ height: 60 }} />
      </div>

      {display.length > 0 && (
        <div style={{ paddingBottom: 64 }}>
          <TmdbCarousel items={display} title="También te puede gustar" type="tv" />
        </div>
      )}

      <style>{`
        @media (max-width: 640px) { .detail-grid { grid-template-columns: 1fr !important; } }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .season-card:hover .season-poster { transform: scale(1.05); }
      `}</style>
    </div>
  )
}
