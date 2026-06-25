export const dynamic = 'force-dynamic'

import { getTVByIds, normalizeDetail } from '@/services/tv'
import { CURATED_TV, CURATED_CRIME_TV, CURATED_COMEDY_TV, CURATED_SCIFI_TV } from '@/lib/curated'
import MediaCarousel from '@/components/ui/MediaCarousel'

export default async function TVPage() {
  const [top, crime, comedy, scifi] = await Promise.all([
    getTVByIds(CURATED_TV),
    getTVByIds(CURATED_CRIME_TV),
    getTVByIds(CURATED_COMEDY_TV),
    getTVByIds(CURATED_SCIFI_TV),
  ])

  const total = top.length + crime.length + comedy.length + scifi.length

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Cabecera de página */}
      <div style={{ background: 'linear-gradient(to bottom, var(--surface) 0%, var(--bg) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="page-inner" style={{ paddingTop: 48, paddingBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 13,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 8px 24px rgba(99,102,241,0.25)',
            }}>📺</div>
            <div>
              <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.8px', lineHeight: 1.1 }}>
                Series
              </h1>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>
                {total} series seleccionadas para ti
              </p>
            </div>
          </div>

          {/* Categorías */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: '⭐ Destacadas', count: top.length },
              { label: '🔍 Crimen',     count: crime.length },
              { label: '😂 Comedia',    count: comedy.length },
              { label: '🤖 Sci-Fi',     count: scifi.length },
            ].map(({ label, count }) => (
              <span key={label} style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                color: 'var(--muted)', fontSize: 12, fontWeight: 600,
                padding: '5px 14px', borderRadius: 999,
              }}>
                {label} <span style={{ color: '#818cf8', fontWeight: 800 }}>{count}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Carruseles */}
      <div style={{ paddingTop: 36, paddingBottom: 56, display: 'flex', flexDirection: 'column', gap: 36 }}>
        <MediaCarousel items={top.map(normalizeDetail)}    title="⭐ Lo mejor de siempre"          subtitle="Series que debes ver antes de morir" />
        <MediaCarousel items={crime.map(normalizeDetail)}  title="🔍 Crimen & Misterio"            subtitle="Intriga y suspenso hasta el final" />
        <MediaCarousel items={comedy.map(normalizeDetail)} title="😂 Comedia"                      subtitle="Para reír sin parar" />
        <MediaCarousel items={scifi.map(normalizeDetail)}  title="🤖 Ciencia Ficción & Fantasía"   subtitle="Mundos más allá de la imaginación" />
      </div>

    </div>
  )
}
