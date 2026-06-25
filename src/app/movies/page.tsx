export const dynamic = 'force-dynamic'

import { getMoviesByIds, normalizeDetail } from '@/services/movies'
import {
  CURATED_MOVIES,
  CURATED_CLASSIC_MOVIES,
  CURATED_SCIFI_MOVIES,
  CURATED_THRILLER_MOVIES,
  CURATED_ANIMATION_MOVIES,
} from '@/lib/curated'
import MediaCarousel from '@/components/ui/MediaCarousel'

export default async function MoviesPage() {
  const [popular, classics, scifi, thriller, animation] = await Promise.all([
    getMoviesByIds(CURATED_MOVIES),
    getMoviesByIds(CURATED_CLASSIC_MOVIES),
    getMoviesByIds(CURATED_SCIFI_MOVIES),
    getMoviesByIds(CURATED_THRILLER_MOVIES),
    getMoviesByIds(CURATED_ANIMATION_MOVIES),
  ])

  const total = popular.length + classics.length + scifi.length + thriller.length + animation.length

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Cabecera de página */}
      <div style={{ background: 'linear-gradient(to bottom, var(--surface) 0%, var(--bg) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="page-inner" style={{ paddingTop: 48, paddingBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 13,
              background: 'linear-gradient(135deg, var(--accent), #e6a800)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 8px 24px rgba(245,197,24,0.25)',
            }}>🎬</div>
            <div>
              <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.8px', lineHeight: 1.1 }}>
                Películas
              </h1>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>
                {total} títulos seleccionados para ti
              </p>
            </div>
          </div>

          {/* Categorías */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: '🔥 Populares',   count: popular.length },
              { label: '🚀 Sci-Fi',      count: scifi.length },
              { label: '🔪 Thriller',    count: thriller.length },
              { label: '🏆 Clásicos',    count: classics.length },
              { label: '✨ Animación',   count: animation.length },
            ].map(({ label, count }) => (
              <span key={label} style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                color: 'var(--muted)', fontSize: 12, fontWeight: 600,
                padding: '5px 14px', borderRadius: 999,
              }}>
                {label} <span style={{ color: 'var(--accent)', fontWeight: 800 }}>{count}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Carruseles */}
      <div style={{ paddingTop: 36, paddingBottom: 56, display: 'flex', flexDirection: 'column', gap: 36 }}>
        <MediaCarousel items={popular.map(normalizeDetail)}   title="🔥 Populares ahora"            subtitle="Lo más visto del momento" />
        <MediaCarousel items={scifi.map(normalizeDetail)}     title="🚀 Ciencia Ficción"             subtitle="Viajes al futuro y más allá" />
        <MediaCarousel items={thriller.map(normalizeDetail)}  title="🔪 Crimen & Thriller"           subtitle="Suspenso hasta el final" />
        <MediaCarousel items={classics.map(normalizeDetail)}  title="🏆 Clásicos imprescindibles"    subtitle="Historia del séptimo arte" />
        <MediaCarousel items={animation.map(normalizeDetail)} title="✨ Animación"                   subtitle="Para todas las edades" />
      </div>

    </div>
  )
}
