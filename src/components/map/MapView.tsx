'use client'

import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
interface MapMarker {
  id: string
  name: string
  address: string
  city: string
  latitude: number
  longitude: number
}

interface MapViewProps {
  markers?: MapMarker[]
}

export function MapView({ markers = [] }: MapViewProps) {
  useEffect(() => {
    const iconRetinaUrl = typeof markerIcon2x === 'string' ? markerIcon2x : markerIcon2x.src
    const iconUrl = typeof markerIcon === 'string' ? markerIcon : markerIcon.src
    const shadowUrl = typeof markerShadow === 'string' ? markerShadow : markerShadow.src

    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    })
  }, [])

  const center = useMemo(() => {
    if (markers.length === 0) {
      return [45.815, 15.9819] as [number, number]
    }

    const { latSum, lngSum } = markers.reduce(
      (acc, marker) => ({
        latSum: acc.latSum + marker.latitude,
        lngSum: acc.lngSum + marker.longitude,
      }),
      { latSum: 0, lngSum: 0 }
    )

    return [latSum / markers.length, lngSum / markers.length] as [number, number]
  }, [markers])
  return (
     <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="h-[32rem] w-full overflow-hidden rounded-lg">
        <MapContainer center={center} zoom={12} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.latitude, marker.longitude]}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-gray-900">{marker.name}</p>
                  <p className="text-gray-600">{marker.address}</p>
                  <p className="text-gray-500">{marker.city}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {markers.length === 0 && (
        <p className="mt-4 text-center text-sm text-gray-500">
          No restaurants with location data yet. Add latitude and longitude to see pins here.
        </p>
      )}
    </div>
  )
}
