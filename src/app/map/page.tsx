import { MapView } from '@/components/map/MapView'

export default function MapPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Map View</h1>
        <p className="mt-2 text-gray-600">
          Explore restaurants on the map. Interactive map integration is coming next.
        </p>
        <MapView />
      </div>
    </main>
  )
}
