import { RestaurantMarker } from '@/components/map/RestaurantMarker'

interface MapMarker {
  id: string
  name: string
  city?: string | null
}

interface MapViewProps {
  markers?: MapMarker[]
}

export function MapView({ markers = [] }: MapViewProps) {
  return (
    <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-6">
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-gray-500">
        <p>Interactive map integration is coming next.</p>
        {markers.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {markers.map((marker) => (
              <RestaurantMarker key={marker.id} name={`${marker.name}${marker.city ? `, ${marker.city}` : ''}`} />
            ))}
          </div>
        ) : (
          <span className="text-sm">Map placeholder</span>
        )}
      </div>
    </div>
  )
}
