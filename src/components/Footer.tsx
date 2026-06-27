import Link from 'next/link'

const NAV = [
  {
    title: 'Explorar',
    links: [
      { label: 'Inicio', href: '/' },
      { label: 'Películas', href: '/movies' },
      { label: 'Series', href: '/tv' },
      { label: 'Cartelera', href: '/estrenos' },
      { label: 'Streaming', href: '/streaming' },
    ],
  },
  {
    title: 'Rankings',
    links: [
      { label: 'Lo mejor de todos los tiempos', href: '/top' },
      { label: 'Descubrir', href: '/discover' },
      { label: 'Top Películas', href: '/top#movies' },
      { label: 'Top Series', href: '/top#tv' },
      { label: 'Por Género', href: '/top#generos' },
    ],
  },
  {
    title: 'Mi Cuenta',
    links: [
      { label: 'Mi Lista', href: '/watchlist' },
      { label: 'Buscar', href: '/search' },
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{ background: 'var(--surface)', marginTop: 'auto' }}>
      {/* Top accent line */}
      <div style={{ height: 1, background: 'linear-gradient(to right, transparent 0%, var(--border2) 15%, var(--accent) 50%, var(--border2) 85%, transparent 100%)', opacity: 0.4 }} />

      <div className="page-inner" style={{ paddingTop: 56, paddingBottom: 40 }}>

        {/* Main footer grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }} className="footer-grid">

          {/* Brand column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="12" stroke="#d4982a" strokeWidth="1.8" opacity="0.85"/>
                <circle cx="16" cy="16" r="6.5" stroke="#d4982a" strokeWidth="1.4" opacity="0.55"/>
                <circle cx="16" cy="16" r="2.5" fill="#d4982a"/>
                <circle cx="13" cy="13" r="1.2" fill="#f0ece3" opacity="0.5"/>
              </svg>
              <span style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 16, color: 'var(--text)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                La Sala
              </span>
            </Link>

            <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.75, maxWidth: 220 }}>
              Tu guía definitiva de cine y series. Descubre, valora y guarda los mejores títulos del mundo.
            </p>

            {/* TMDB badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 4, background: 'rgba(1,180,228,0.08)', border: '1px solid rgba(1,180,228,0.2)', borderRadius: 8, padding: '7px 12px', alignSelf: 'flex-start' }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: 'linear-gradient(135deg, #01b4e4, #0d253f)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 8, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>T</span>
              </div>
              <span style={{ fontSize: 10, color: 'rgba(1,180,228,0.8)', fontWeight: 600, letterSpacing: '0.02em' }}>Datos por TMDB &amp; OMDb</span>
            </div>
          </div>

          {/* Nav columns */}
          {NAV.map(col => (
            <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                {col.title}
              </p>
              {col.links.map(({ label, href }) => (
                <Link key={href} href={href} style={{
                  fontSize: 13, color: 'var(--muted2)', textDecoration: 'none',
                  transition: 'color .15s',
                }} className="footer-link">
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: 20,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          <p style={{ fontSize: 11, color: 'var(--muted)', opacity: 0.6 }}>
            © {new Date().getFullYear()} La Sala — Proyecto personal, no afiliado a TMDB ni OMDb.
          </p>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 11, color: 'var(--muted)', opacity: 0.5, textDecoration: 'none' }}>
              TMDB
            </a>
            <a href="https://www.omdbapi.com" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 11, color: 'var(--muted)', opacity: 0.5, textDecoration: 'none' }}>
              OMDb
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: var(--text) !important; }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
