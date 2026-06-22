import { searchMovies, normalizeSearchItem as normalizeMovieItem } from '@/services/movies'
import { searchTV, normalizeSearchItem as normalizeTVItem } from '@/services/tv'
import MediaGrid from '@/components/ui/MediaGrid'

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
          <div style={{ fontSize: 72, marginBottom: 24 }}>🔍</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 12 }}>
            Busca lo que quieras ver
          </h1>
          <p style={{ fontSize: 15, color: 'var(--muted)', maxWidth: 400, margin: '0 auto' }}>
            Usa la barra de búsqueda para encontrar películas y series de tu gusto
          </p>
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
      <div className="page-inner" style={{ paddingTop: 48, paddingBottom: 80 }}>

        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: 'var(--text)' }}>
            Resultados para{' '}
            <span style={{ color: 'var(--accent)' }}>"{q}"</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>
            {totalResults} {totalResults === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </p>
        </div>

        {totalResults === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 80, paddingBottom: 80 }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>😕</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>Sin resultados</h2>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>
              No encontramos nada para "{q}". Prueba con otro término.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
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
