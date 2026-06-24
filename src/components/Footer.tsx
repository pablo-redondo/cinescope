import Link from 'next/link'

const LINKS = [
  { label: 'Películas', href: '/movies' },
  { label: 'Series', href: '/tv' },
  { label: 'Mi Lista', href: '/watchlist' },
]

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      marginTop: 'auto',
    }}>
      <div className="page-inner" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32 }}>

          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{
                width: 30, height: 30,
                background: 'linear-gradient(135deg, var(--accent) 0%, #e6a800 100%)',
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 13, color: '#000',
              }}>C</div>
              <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>CineScope</span>
            </Link>
            <p style={{ fontSize: 12, color: 'var(--muted)', maxWidth: 240, lineHeight: 1.6 }}>
              Tu guía definitiva de cine y series. Descubre, valora y guarda los mejores títulos.
            </p>
            <p style={{ fontSize: 11, color: 'rgba(136,146,164,0.5)' }}>
              Datos: OMDb & TMDB
            </p>
          </div>

          {/* Nav */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
              Explorar
            </p>
            {LINKS.map(({ label, href }) => (
              <Link key={href} href={href} style={{
                fontSize: 13, color: 'var(--muted)', textDecoration: 'none',
                transition: 'color .15s',
              }}>
                {label}
              </Link>
            ))}
          </div>

        </div>

        <div style={{
          marginTop: 32, paddingTop: 20,
          borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8,
        }}>
          <p style={{ fontSize: 11, color: 'rgba(136,146,164,0.5)' }}>
            © {new Date().getFullYear()} CineScope. Proyecto personal.
          </p>
          <p style={{ fontSize: 11, color: 'rgba(136,146,164,0.4)' }}>
            Datos de películas proporcionados por{' '}
            <a href="https://www.omdbapi.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(136,146,164,0.6)', textDecoration: 'none' }}>OMDb</a>
            {' '}&{' '}
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(136,146,164,0.6)', textDecoration: 'none' }}>TMDB</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
