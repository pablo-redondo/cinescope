import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTmdbTVDetail, getBackdropUrl, getPosterUrl } from '@/services/tmdb'
import CastSection from '@/components/CastSection'
import TmdbCarousel from '@/components/TmdbCarousel'
import WatchProvidersSection from '@/components/WatchProvidersSection'
import TrailerButton from '@/components/TrailerButton'

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
  const recs = (show.recommendations?.results ?? []).filter(s => s.poster_path).slice(0, 12)
  const similar = (show.similar?.results ?? []).filter(s => s.poster_path).slice(0, 12)
  const display = recs.length ? recs : similar
  const cast = (show.credits?.cast ?? []).slice(0, 16)
  const providers = show['watch/providers']?.results?.['ES'] ?? show['watch/providers']?.results?.['US'] ?? null
  const ratingPercent = show.vote_average ? (show.vote_average / 10) * 100 : null
  const contentRating = pickContentRating(show.content_ratings)

  const seasons = (show.seasons ?? []).filter(s => s.season_number > 0)

  const galleryBackdrops = (show.images?.backdrops ?? [])
    .filter(b => b.vote_average > 0)
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 10)

  const companies = (show.production_companies ?? []).filter(c => c.logo_path).slice(0, 5)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <div style={{ position: 'relative', height: 520, overflow: 'hidden' }}>
        {(backdrop || poster) && (
          <Image src={backdrop ?? poster!} alt="" fill priority sizes="100vw" style={{ objectFit: 'cover', filter: backdrop ? 'brightness(0.55)' : 'blur(60px)', opacity: backdrop ? 1 : 0.3 }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(20,24,32,0.1) 0%, var(--bg) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--bg) 0%, rgba(20,24,32,0.2) 55%, transparent 100%)' }} />
      </div>

      <div className="page-inner" style={{ marginTop: -440, position: 'relative', zIndex: 10 }}>

        <Link href="/discover?type=tv" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600,
          textDecoration: 'none', marginBottom: 28,
          background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)',
          padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)',
        }}>← Series</Link>

        <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {poster && (
            <div style={{ flexShrink: 0, width: 'clamp(150px, 16vw, 240px)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 40px 100px -10px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08)' }}>
              <Image src={poster} alt={show.name} width={240} height={360} style={{ width: '100%', display: 'block' }} priority />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 14, paddingTop: poster ? 8 : 0 }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc', fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 999, letterSpacing: '0.1em', textTransform: 'uppercase', backdropFilter: 'blur(8px)' }}>Serie</span>
              {show.genres?.slice(0,3).map(g => (
                <Link key={g.id} href={`/discover?genre=${g.id}&type=tv`} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 999, textDecoration: 'none', backdropFilter: 'blur(8px)' }}>{g.name}</Link>
              ))}
            </div>

            {show.tagline && <p style={{ fontSize: 13, color: 'var(--accent)', fontStyle: 'italic', opacity: 0.85 }}>&ldquo;{show.tagline}&rdquo;</p>}

            <h1 style={{ fontSize: 'clamp(28px, 4vw, 54px)', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', lineHeight: 0.95, textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
              {show.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              {show.vote_average > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ color: 'var(--accent)', fontSize: 20 }}>★</span>
                    <span style={{ color: '#fff', fontWeight: 900, fontSize: 24 }}>{show.vote_average.toFixed(1)}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>/10 TMDB</span>
                  </div>
                  {ratingPercent !== null && (
                    <div style={{ width: 52, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${ratingPercent}%`, height: '100%', background: 'var(--accent)', borderRadius: 2 }} />
                    </div>
                  )}
                </div>
              )}
              {show.first_air_date && <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: 13, padding: '3px 10px', borderRadius: 6 }}>{show.first_air_date.slice(0,4)}</span>}
              {show.number_of_seasons > 0 && (
                <span style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', fontSize: 13, fontWeight: 700, padding: '3px 12px', borderRadius: 8 }}>
                  {show.number_of_seasons} temp.
                </span>
              )}
              {contentRating && (
                <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6 }}>{contentRating}</span>
              )}
              {show.status && (
                <span style={{ background: show.status === 'Ended' || show.status === 'Canceled' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', border: `1px solid ${show.status === 'Ended' || show.status === 'Canceled' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, color: show.status === 'Ended' || show.status === 'Canceled' ? '#fca5a5' : '#86efac', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 6 }}>
                  {show.status === 'Ended' ? 'Finalizada' : show.status === 'Canceled' ? 'Cancelada' : 'En emisión'}
                </span>
              )}
            </div>

            {show.vote_count > 0 && (
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{show.vote_count.toLocaleString('es')} valoraciones</p>
            )}

            {show.overview && (
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '60ch' }}>
                {show.overview}
              </p>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 2 }}>
              {trailerKey && <TrailerButton videoKey={trailerKey} />}
            </div>
          </div>
        </div>

        {/* Seasons with episode guide links */}
        {seasons.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Temporadas</p>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }} className="scrollbar-hide">
              {seasons.map(season => {
                const sp = getPosterUrl(season.poster_path, 'w185')
                return (
                  <Link key={season.id} href={`/tmdb/tv/${id}/temporada/${season.season_number}`} style={{ flexShrink: 0, width: 110, display: 'flex', flexDirection: 'column', gap: 6, textDecoration: 'none' }} className="season-card">
                    <div style={{ borderRadius: 8, overflow: 'hidden', background: 'var(--surface2)', aspectRatio: '2/3', position: 'relative' }}>
                      {sp ? (
                        <Image src={sp} alt={season.name} fill sizes="110px" style={{ objectFit: 'cover' }} />
                      ) : (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 11, textAlign: 'center', padding: 8 }}>
                          T{season.season_number}
                        </div>
                      )}
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background .2s' }} className="season-overlay" />
                    </div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{season.name}</p>
                    <p style={{ fontSize: 10, color: 'var(--muted)' }}>{season.episode_count} ep · {season.air_date?.slice(0,4)}</p>
                  </Link>
                )
              })}
            </div>
          </div>
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
            {show.overview && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Sinopsis</p>
                <p style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.8, opacity: 0.9 }}>{show.overview}</p>
              </div>
            )}

            {(show.keywords?.results?.length ?? 0) > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Temas</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {show.keywords.results.slice(0, 20).map(kw => (
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

            {(show.reviews?.results?.length ?? 0) > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Reseñas</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {show.reviews.results.slice(0, 3).map(r => (
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
                { label: 'Creadores', value: show.created_by?.map(c => c.name).join(', ') || null },
                { label: 'Red', value: show.networks?.map(n => n.name).join(', ') || null },
                { label: 'Estreno', value: show.first_air_date },
                { label: 'Último episodio', value: show.last_air_date || null },
                { label: 'Episodios', value: show.number_of_episodes ? `${show.number_of_episodes} episodios` : null },
                { label: 'Duración ep.', value: show.episode_run_time?.[0] ? `${show.episode_run_time[0]} min` : null },
                { label: 'Clasificación', value: contentRating },
                { label: 'Idiomas', value: show.spoken_languages?.map(l => l.name).join(', ') || null },
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
          <TmdbCarousel items={display} title="También te puede gustar" type="tv" />
        </div>
      )}

      <style>{`
        @media (max-width: 640px) { .detail-grid { grid-template-columns: 1fr !important; } }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .season-card:hover .season-overlay { background: rgba(245,197,24,0.08) !important; }
      `}</style>
    </div>
  )
}
