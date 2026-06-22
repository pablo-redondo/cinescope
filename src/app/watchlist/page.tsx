import WatchlistClient from '@/components/WatchlistClient'

export default function WatchlistPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(to bottom, var(--surface) 0%, var(--bg) 100%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="page-inner" style={{ paddingTop: 48, paddingBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 46, height: 46,
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              borderRadius: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 8px 24px rgba(239,68,68,0.25)',
            }}>❤️</div>
            <div>
              <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.8px', lineHeight: 1.1 }}>
                Mi Lista
              </h1>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>
                Películas y series que quieres ver
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="page-inner" style={{ paddingTop: 36, paddingBottom: 80 }}>
        <WatchlistClient />
      </div>

    </div>
  )
}
