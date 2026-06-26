import WatchlistClient from '@/components/WatchlistClient'

export default function WatchlistPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="page-inner" style={{ paddingTop: 28, paddingBottom: 20 }}>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.8px', lineHeight: 1 }}>
            Mi Lista
          </h1>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 5 }}>
            Películas y series guardadas
          </p>
        </div>
      </div>

      <div className="page-inner" style={{ paddingTop: 28, paddingBottom: 48 }}>
        <WatchlistClient />
      </div>

    </div>
  )
}
