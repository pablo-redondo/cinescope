import Link from 'next/link'

const LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Películas', href: '/movies' },
  { label: 'Series', href: '/tv' },
  { label: 'Estrenos', href: '/estrenos' },
  { label: 'Streaming', href: '/streaming' },
  { label: 'Descubrir', href: '/discover' },
  { label: 'Top', href: '/top' },
]

export default function Footer() {
  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
      <div className="page-inner" style={{ paddingTop: 28, paddingBottom: 28 }}>

        {/* Single row: logo + nav links + data attribution */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="13" stroke="#d4982a" strokeWidth="1.5" opacity="0.9"/>
              <circle cx="16" cy="16" r="7" stroke="#d4982a" strokeWidth="1.2" opacity="0.5"/>
              <circle cx="16" cy="16" r="2.5" fill="#d4982a"/>
              <circle cx="11.5" cy="11.5" r="1.4" fill="#f0ece3" opacity="0.45"/>
              <circle cx="20.5" cy="11.5" r="1.4" fill="#f0ece3" opacity="0.45"/>
              <circle cx="11.5" cy="20.5" r="1.4" fill="#f0ece3" opacity="0.45"/>
              <circle cx="20.5" cy="20.5" r="1.4" fill="#f0ece3" opacity="0.45"/>
            </svg>
            <span style={{
              fontFamily: 'var(--font-bebas), sans-serif',
              fontSize: 16,
              letterSpacing: '4px',
              color: 'var(--text)',
              lineHeight: 1,
              paddingTop: 2,
            }}>LA SALA</span>
          </Link>

          {/* Nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', flex: 1 }}>
            {LINKS.map(({ label, href }) => (
              <Link key={href} href={href} className="footer-nav-link" style={{
                fontSize: 12, color: 'var(--muted)', textDecoration: 'none',
                padding: '4px 12px',
                transition: 'color .15s',
              }}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Data attribution */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: 'var(--muted)', opacity: 0.5 }}>Datos:</span>
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 10, color: 'var(--muted)', opacity: 0.5, textDecoration: 'none' }}>TMDB</a>
            <span style={{ fontSize: 10, color: 'var(--muted)', opacity: 0.3 }}>·</span>
            <a href="https://www.omdbapi.com" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 10, color: 'var(--muted)', opacity: 0.5, textDecoration: 'none' }}>OMDb</a>
          </div>
        </div>

        {/* Divider + copyright */}
        <div style={{ borderTop: '1px solid var(--border)', marginTop: 20, paddingTop: 16 }}>
          <p style={{ fontSize: 11, color: 'var(--muted)', opacity: 0.45, textAlign: 'center' }}>
            © {new Date().getFullYear()} La Sala — Proyecto personal, no afiliado a TMDB ni OMDb.
          </p>
        </div>
      </div>

      <style>{`
        .footer-nav-link:hover { color: var(--text) !important; }
      `}</style>
    </footer>
  )
}
