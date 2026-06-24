import { searchMovies, normalizeSearchItem as normalizeMovieItem } from '@/services/movies'
import { searchTV, normalizeSearchItem as normalizeTVItem } from '@/services/tv'
import MediaGrid from '@/components/ui/MediaGrid'
import Link from 'next/link'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  if (!q) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <div className="page-inner" style={{ paddingTop: 120, paddingBottom: 80, textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            background: 'var(--surface2)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, margin: '0 auto 24px',
          }}>🔍</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 12 }}>
            Busca lo que quieras ver
          </h1>
          <p style={{ fontSize: 15, color: 'var(--muted)', maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.6 }}>
            Usa la barra de búsqueda para encontrar películas y series de tu gusto
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Inception', 'Breaking Bad', 'Parasite', 'Interstellar'].map(term => (
              <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                color: 'var(--muted)', fontSize: 13, fontWeight: 600,
                padding: '8px 18px', borderRadius: 999, textDecoration: 'none',
                transition: 'border-color .15s, color .15s',
              }}>
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const [movies, shows] = await Promise.all([
    searchMovies(q),
    searchTV(q),
  ])

  const movieItems = movies.Search ? movies.Search.map(normalizeMovieItem) : []
  const tvItems = shows.Search ? shows.Search.map(normalizeTVItem) : []
  const totalResults = movieItems.length + tvItems.length

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(to bottom, var(--surface) 0%, var(--bg) 100%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="page-inner" style={{ paddingTop: 40, paddingBottom: 28 }}>
          <p style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 6 }}>
            Resultados de búsqueda
          </p>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.5px' }}>
            &ldquo;<span style={{ color: 'var(--accent)' }}>{q}</span>&rdquo;
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8 }}>
            {totalResults === 0
              ? 'Sin resultados'
              : `${totalResults} ${totalResults === 1 ? 'resultado' : 'resultados'} — ${movieItems.length} ${movieItems.length === 1 ? 'película' : 'películas'}, ${tvItems.length} ${tvItems.length === 1 ? 'serie' : 'series'}`}
          </p>
        </div>
      </div>

      <div className="page-inner" style={{ paddingTop: 40, paddingBottom: 80 }}>

        {totalResults === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 80, paddingBottom: 80 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20,
              background: 'var(--surface2)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, margin: '0 auto 20px',
            }}>😕</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>Sin resultados</h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
              No encontramos nada para &ldquo;{q}&rdquo;. Prueba con otro término.
            </p>
            <Link href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--accent)', color: '#000',
              fontSize: 13, fontWeight: 800,
              padding: '10px 22px', borderRadius: 10, textDecoration: 'none',
            }}>
              ← Volver al inicio
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 52 }}>
            {movieItems.length > 0 && (
              <MediaGrid items={movieItems} title={`🎬 Películas (${movieItems.length})`} />
            )}
            {tvItems.length > 0 && (
              <MediaGrid items={tvItems} title={`📺 Series (${tvItems.length})`} />
            )}
          </div>
        )}

      </div>
    </div>
  )
}
