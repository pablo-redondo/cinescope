import WatchlistClient from '@/components/WatchlistClient'

export default function WatchlistPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Mi Lista</h1>
      <WatchlistClient />
    </div>
  )
}
