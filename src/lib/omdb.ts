const API_KEY = process.env.OMDB_API_KEY
const BASE_URL = 'https://www.omdbapi.com'

export async function omdbFetch<T>(params: Record<string, string>): Promise<T> {
  const url = new URL(BASE_URL)
  url.searchParams.set('apikey', API_KEY!)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`OMDb error: ${res.status}`)
  return res.json()
}

export function normalizePoster(poster: string): string | null {
  if (!poster || poster === 'N/A') return null
  return poster
}
