import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPersonDetail, getPosterUrl } from '@/services/tmdb'
import type { TmdbPersonCredit } from '@/services/tmdb'

function CreditCard({ credit, type, role }: { credit: TmdbPersonCredit; type: 'movie' | 'tv'; role?: string }) {
  const poster = getPosterUrl(credit.poster_path, 'w342')
  const title = credit.title ?? credit.name ?? ''
  const year = (credit.release_date ?? credit.first_air_date ?? '').slice(0, 4)

  return (
    <Link href={`/tmdb/${type}/${credit.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 6 }} className="credit-card">
      <div style={{ position: 'relative', aspectRatio: '2/3', borderRadius: 10, overflow: 'hidden', background: 'var(--surface2)' }} className="credit-img">
        {poster ? (
          <Image src={poster} alt={title} fill sizes="180px" style={{ objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 28 }}>🎬</div>
        )}
        {credit.vote_average > 0 && (
          <div style={{ position: 'absolute', top: 7, right: 7, background: 'rgba(0,0,0,0.85)', color: 'var(--accent)', fontSize: 10, fontWeight: 800, padding: '3px 7px', borderRadius: 7 }}>
            ★ {credit.vote_average.toFixed(1)}
          </div>
        )}
        <div style={{ position: 'absolute', top: 7, left: 7, background: type === 'tv' ? 'rgba(99,102,241,0.85)' : 'rgba(239,68,68,0.85)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 5 }}>
          {type === 'tv' ? 'SERIE' : 'PEL.'}
        </div>
      </div>
      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {year && <p style={{ fontSize: 11, color: 'var(--muted)' }}>{year}</p>}
        {(credit.character || role) && (
          <p style={{ fontSize: 10, color: 'var(--muted)', opacity: 0.65, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {credit.character ?? role}
          </p>
        )}
      </div>
    </Link>
  )
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <div style={{ width: 3, height: 20, background: 'var(--accent)', borderRadius: 2, flexShrink: 0 }} />
      <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.2px' }}>{title}</h2>
      {count !== undefined && <span style={{ fontSize: 12, color: 'var(--muted)', opacity: 0.7 }}>{count}</span>}
    </div>
  )
}

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getPersonDetail(id)
  if (!data) notFound()

  const { detail, credits, images } = data
  const photo = detail.profile_path ? `https://image.tmdb.org/t/p/w342${detail.profile_path}` : null

  const sortByPop = (a: TmdbPersonCredit, b: TmdbPersonCredit) => (b.vote_count ?? 0) - (a.vote_count ?? 0)

  const allMovies = credits.cast
    .filter(c => c.media_type === 'movie' && c.poster_path)
    .sort(sortByPop)

  const allTV = credits.cast
    .filter(c => c.media_type === 'tv' && c.poster_path)
    .sort(sortByPop)

  const allDirected = credits.crew
    .filter(c => c.job === 'Director' && c.poster_path)
    .sort(sortByPop)

  // "Known for" — top 6 works across all media, best rated
  const knownFor = [...credits.cast]
    .filter(c => c.poster_path && (c.media_type === 'movie' || c.media_type === 'tv'))
    .sort(sortByPop)
    .slice(0, 6)

  // Profile images gallery (other photos of this person)
  const profileGallery = (images.profiles ?? [])
    .filter(p => p.file_path !== detail.profile_path)
    .slice(0, 8)

  const age = detail.birthday
    ? Math.floor((Date.now() - new Date(detail.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null

  const deptLabel = detail.known_for_department === 'Acting'
    ? 'Actor / Actriz'
    : detail.known_for_department === 'Directing'
      ? 'Director/a'
      : detail.known_for_department === 'Writing'
        ? 'Guionista'
        : detail.known_for_department ?? 'Artista'

  const totalWorks = allMovies.length + allTV.length + allDirected.length

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(to bottom, var(--surface) 0%, var(--bg) 100%)', borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        <div className="page-inner" style={{ paddingTop: 48, paddingBottom: 40 }}>
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Photo */}
            <div style={{ flexShrink: 0 }}>
              {photo ? (
                <div style={{ width: 'clamp(120px, 13vw, 190px)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 64px -8px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.07)', position: 'relative' }}>
                  <Image src={photo} alt={detail.name} width={190} height={285} style={{ width: '100%', display: 'block' }} priority />
                </div>
              ) : (
                <div style={{ width: 'clamp(120px, 13vw, 190px)', aspectRatio: '2/3', borderRadius: 16, background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, fontWeight: 900, color: 'var(--accent)' }}>
                  {detail.name[0]}
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <span style={{ display: 'inline-block', background: 'rgba(245,197,24,0.12)', border: '1px solid rgba(245,197,24,0.25)', color: 'var(--accent)', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 999, marginBottom: 10 }}>
                  {deptLabel}
                </span>
                <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-1.2px', lineHeight: 1.05 }}>
                  {detail.name}
                </h1>
              </div>

              {/* Stats badges */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {detail.birthday && (
                  <span style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 12, padding: '5px 12px', borderRadius: 999 }}>
                    🎂 {detail.birthday}{age && !detail.deathday ? ` · ${age} años` : ''}
                  </span>
                )}
                {detail.deathday && (
                  <span style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: 12, padding: '5px 12px', borderRadius: 999 }}>
                    † {detail.deathday}
                  </span>
                )}
                {detail.place_of_birth && (
                  <span style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 12, padding: '5px 12px', borderRadius: 999 }}>
                    📍 {detail.place_of_birth}
                  </span>
                )}
                {totalWorks > 0 && (
                  <span style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 12, padding: '5px 12px', borderRadius: 999 }}>
                    🎬 {totalWorks} obras
                  </span>
                )}
              </div>

              {detail.biography && (
                <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.75, maxWidth: '65ch' }}>
                  {detail.biography.slice(0, 480)}{detail.biography.length > 480 ? '…' : ''}
                </p>
              )}

              {detail.imdb_id && (
                <Link href={`https://www.imdb.com/name/${detail.imdb_id}/`} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
                  background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.25)',
                  color: 'var(--accent)', fontSize: 13, fontWeight: 700,
                  padding: '8px 16px', borderRadius: 10, textDecoration: 'none',
                }}>IMDb ↗</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="page-inner" style={{ paddingTop: 48, paddingBottom: 80 }}>

        {/* ── Conocido por ─────────────────────────────────────────────── */}
        {knownFor.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <SectionHeader title="Conocido por" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
              {knownFor.map(credit => (
                <CreditCard key={`kf-${credit.id}-${credit.media_type}`} credit={credit} type={credit.media_type as 'movie' | 'tv'} />
              ))}
            </div>
          </section>
        )}

        {/* ── Profile gallery ───────────────────────────────────────────── */}
        {profileGallery.length > 1 && (
          <section style={{ marginBottom: 56 }}>
            <SectionHeader title="Fotos" count={profileGallery.length} />
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }} className="scrollbar-hide">
              {profileGallery.map((p, i) => (
                <div key={i} style={{ flexShrink: 0, width: 'clamp(80px, 9vw, 120px)', borderRadius: 10, overflow: 'hidden', aspectRatio: '2/3', position: 'relative', background: 'var(--surface2)' }}>
                  <Image src={`https://image.tmdb.org/t/p/w185${p.file_path}`} alt="" fill sizes="120px" style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Películas ─────────────────────────────────────────────────── */}
        {allMovies.length > 0 && (
          <section style={{ marginBottom: 52 }}>
            <SectionHeader title="Películas" count={allMovies.length} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
              {allMovies.map(credit => (
                <CreditCard key={`m-${credit.id}`} credit={credit} type="movie" />
              ))}
            </div>
          </section>
        )}

        {/* ── Como director/a ───────────────────────────────────────────── */}
        {allDirected.length > 0 && (
          <section style={{ marginBottom: 52 }}>
            <SectionHeader title="Como director/a" count={allDirected.length} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
              {allDirected.map(credit => (
                <CreditCard key={`d-${credit.id}`} credit={{ ...credit, character: undefined }} type="movie" role="Director/a" />
              ))}
            </div>
          </section>
        )}

        {/* ── Series ────────────────────────────────────────────────────── */}
        {allTV.length > 0 && (
          <section style={{ marginBottom: 52 }}>
            <SectionHeader title="Series" count={allTV.length} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
              {allTV.map(credit => (
                <CreditCard key={`t-${credit.id}`} credit={credit} type="tv" />
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        .credit-img { transition: transform .22s ease, box-shadow .22s ease; }
        .credit-card:hover .credit-img { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.7); }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
