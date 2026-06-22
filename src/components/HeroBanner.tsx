import Image from 'next/image'
import Link from 'next/link'
import { normalizePoster } from '@/lib/omdb'
import type { OmdbDetail } from '@/types/omdb'

export default function HeroBanner({ movie }: { movie: OmdbDetail }) {
  const poster = normalizePoster(movie.Poster)
  const genres = movie.Genre !== 'N/A' ? movie.Genre.split(', ').slice(0, 3) : []

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      height: 'clamp(480px, 60vh, 640px)',
    }}>

      {/* Fondo desenfocado */}
      {poster && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image src={poster} alt="" fill priority
            style={{ objectFit: 'cover', transform: 'scale(1.15)', filter: 'blur(80px)', opacity: 0.3 }}
            sizes="100vw"
          />
        </div>
      )}

      {/* Gradientes */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #141820 30%, rgba(20,24,32,0.7) 65%, transparent)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #141820 0%, transparent 55%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #141820 0%, transparent 20%)' }} />

      {/* Contenido */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
        <div className="page-inner" style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 48,
        }}>

          {/* Izquierda */}
          <div style={{ flex: 1, maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.35)',
                color: 'var(--accent)', fontSize: 10, fontWeight: 800,
                padding: '4px 12px', borderRadius: 999, letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                <span style={{ width: 5, height: 5, background: 'var(--accent)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                Destacado
              </span>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>{movie.Year}</span>
              {movie.Runtime !== 'N/A' && <span style={{ color: 'var(--muted)', fontSize: 13 }}>{movie.Runtime}</span>}
              {movie.Rated !== 'N/A' && (
                <span style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                  {movie.Rated}
                </span>
              )}
            </div>

            {/* Título */}
            <h1 style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-2px', color: '#fff', margin: 0 }}>
              {movie.Title}
            </h1>

            {/* Rating IMDb */}
            {movie.imdbRating !== 'N/A' && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ color: 'var(--accent)', fontSize: 20 }}>★</span>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 24 }}>{movie.imdbRating}</span>
                <span style={{ color: 'var(--muted)', fontSize: 13 }}>/10 · IMDb</span>
                {movie.imdbVotes && <span style={{ color: 'var(--muted)', fontSize: 12 }}>· {movie.imdbVotes} votos</span>}
              </div>
            )}

            {/* Géneros */}
            {genres.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {genres.map(g => (
                  <span key={g} style={{
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--muted)', fontSize: 12, fontWeight: 500,
                    padding: '4px 14px', borderRadius: 999,
                  }}>{g}</span>
                ))}
              </div>
            )}

            {/* Sinopsis */}
            <p style={{
              color: 'var(--muted)', fontSize: 14, lineHeight: 1.65, maxWidth: 480, margin: 0,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {movie.Plot}
            </p>

            {/* Botones */}
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <Link href={`/movie/${movie.imdbID}`} style={{
                background: '#fff', color: '#000', fontWeight: 800, fontSize: 13,
                padding: '12px 28px', borderRadius: 10, textDecoration: 'none',
                letterSpacing: '0.01em',
                boxShadow: '0 8px 32px rgba(255,255,255,0.12)',
              }}>
                Ver detalles
              </Link>
              <Link href={`/movie/${movie.imdbID}`} style={{
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)',
                color: '#fff', fontWeight: 600, fontSize: 13,
                padding: '12px 24px', borderRadius: 10, textDecoration: 'none',
                backdropFilter: 'blur(12px)',
              }}>
                + Mi lista
              </Link>
            </div>
          </div>

          {/* Derecha — Poster */}
          {poster && (
            <div style={{ flexShrink: 0, display: 'none' }} className="hero-poster">
              <div style={{
                width: 'clamp(160px, 13vw, 230px)',
                borderRadius: 18, overflow: 'hidden',
                boxShadow: '0 40px 100px -20px rgba(0,0,0,0.95)',
                outline: '1px solid rgba(255,255,255,0.08)',
                transform: 'rotate(1.5deg)',
              }}>
                <Image src={poster} alt={movie.Title} width={230} height={345} style={{ width: '100%', display: 'block' }} priority />
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) { .hero-poster { display: block !important; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>
    </section>
  )
}
