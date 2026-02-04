'use client'

import Link from 'next/link'
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
  slug: string
  latitude: number
  longitude: number
}

interface MapViewProps {
  markers?: MapMarker[]
  containerClassName?: string
  mapClassName?: string
  zoom?: number
}

export function MapView({ markers = [], containerClassName, mapClassName, zoom = 12 }: MapViewProps) {
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

  const limitedMarkers = useMemo(() => markers.slice(0, 50), [markers])

  const center = useMemo(() => {
    if (limitedMarkers.length === 0) {
      return [45.815, 15.9819] as [number, number]
    }

    const { latSum, lngSum } = limitedMarkers.reduce(
      (acc, marker) => ({
        latSum: acc.latSum + marker.latitude,
        lngSum: acc.lngSum + marker.longitude,
      }),
      { latSum: 0, lngSum: 0 }
    )

    return [latSum / limitedMarkers.length, lngSum / limitedMarkers.length] as [number, number]
  }, [limitedMarkers])
  return (
     <div className={`mt-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${containerClassName ?? ''}`.trim()}>
      <div className={`h-[32rem] w-full overflow-hidden rounded-lg ${mapClassName ?? ''}`.trim()}>
        <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {limitedMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.latitude, marker.longitude]}
            >
              <Popup>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-gray-900">{marker.name}</p>
                  <Link
                    className="inline-flex items-center justify-center rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-600"
                    href={`/restaurants/${marker.slug}`}
                  >
                    Open restaurant
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {limitedMarkers.length === 0 && (
        <p className="mt-4 text-center text-sm text-gray-500">
          No restaurants with location data yet. Add latitude and longitude to see pins here.
        </p>
      )}
    </div>
  )
}
