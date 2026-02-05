'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
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

interface MarkerCluster {
  id: string
  count: number
  latitude: number
  longitude: number
  bounds: L.LatLngBounds
  markers: MapMarker[]
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

  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null)
  const [mapZoom, setMapZoom] = useState(zoom)

  const markersInView = useMemo(() => {
    if (!bounds) {
      return markers
    }

    return markers.filter((marker) => bounds.contains(L.latLng(marker.latitude, marker.longitude)))
  }, [bounds, markers])

  const maxPins = 190
  const shouldCluster = markers.length > maxPins && mapZoom <= zoom

  const clusters = useMemo(() => {
    if (!shouldCluster || markers.length === 0) {
      return [] as MarkerCluster[]
    }

    const overallBounds = L.latLngBounds(markers.map((marker) => [marker.latitude, marker.longitude]))
    const latSpan = overallBounds.getNorth() - overallBounds.getSouth()
    const lngSpan = overallBounds.getEast() - overallBounds.getWest()
    let cellCount = Math.min(10, Math.max(2, Math.ceil(Math.sqrt(markers.length / 60))))
    let clustersResult: MarkerCluster[] = []
    let maxClusterSize = Infinity

    while (cellCount <= 30 && maxClusterSize > maxPins) {
      const latStep = latSpan / cellCount || 0.1
      const lngStep = lngSpan / cellCount || 0.1
      const clustersMap = new Map<string, MapMarker[]>()

      markers.forEach((marker) => {
        const row = Math.floor((marker.latitude - overallBounds.getSouth()) / latStep)
        const col = Math.floor((marker.longitude - overallBounds.getWest()) / lngStep)
        const key = `${row}-${col}`
        const existing = clustersMap.get(key) ?? []
        existing.push(marker)
        clustersMap.set(key, existing)
      })

      clustersResult = Array.from(clustersMap.entries()).map(([key, clusterMarkers]) => {
        const { latSum, lngSum } = clusterMarkers.reduce(
          (acc, marker) => ({
            latSum: acc.latSum + marker.latitude,
            lngSum: acc.lngSum + marker.longitude,
          }),
          { latSum: 0, lngSum: 0 }
        )
        const latitude = latSum / clusterMarkers.length
        const longitude = lngSum / clusterMarkers.length
        const clusterBounds = L.latLngBounds(clusterMarkers.map((marker) => [marker.latitude, marker.longitude]))

        return {
          id: key,
          count: clusterMarkers.length,
          latitude,
          longitude,
          bounds: clusterBounds,
          markers: clusterMarkers,
        }
      })

      maxClusterSize = clustersResult.length
        ? Math.max(...clustersResult.map((cluster) => cluster.count))
        : 0
      if (maxClusterSize > maxPins) {
        cellCount += 1
      }
    }

    return clustersResult
  }, [markers, maxPins, shouldCluster])

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
    <div className={`mt-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${containerClassName ?? ''}`.trim()}>
      <div className={`h-[32rem] w-full overflow-hidden rounded-lg ${mapClassName ?? ''}`.trim()}>
        <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapBoundsListener onViewChange={(nextBounds, nextZoom) => {
            setBounds(nextBounds)
            setMapZoom(nextZoom)
          }} />
          {shouldCluster
            ? clusters
              .filter((cluster) => !bounds || bounds.contains(cluster.bounds.getCenter()))
              .map((cluster) => (
              <ClusterMarker
                key={cluster.id}
                cluster={cluster}
                currentZoom={mapZoom}
              />
            ))
            : markersInView.slice(0, maxPins).map((marker) => (
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
      {markers.length === 0 && (
        <p className="mt-4 text-center text-sm text-gray-500">
          No restaurants with location data yet. Add latitude and longitude to see pins here.
        </p>
      )}
    </div>
  )
}

interface MapBoundsListenerProps {
  onViewChange: (bounds: L.LatLngBounds, zoom: number) => void
}

function MapBoundsListener({ onViewChange }: MapBoundsListenerProps) {
  const map = useMapEvents({
    moveend: () => onViewChange(map.getBounds(), map.getZoom()),
    zoomend: () => onViewChange(map.getBounds(), map.getZoom()),
  })

  useEffect(() => {
    onViewChange(map.getBounds(), map.getZoom())
  }, [map, onViewChange])

  return null
}

interface ClusterMarkerProps {
  cluster: MarkerCluster
  currentZoom: number
}

function ClusterMarker({ cluster, currentZoom }: ClusterMarkerProps) {
  const map = useMap()
  const countLabel = `${cluster.count}`
  const icon = useMemo(
    () =>
      L.divIcon({
        html: `
          <div style="align-items:center;background:#f97316;border:2px solid #ea580c;border-radius:9999px;color:#fff;display:flex;font-weight:700;height:42px;justify-content:center;min-width:42px;padding:0 8px;box-shadow:0 6px 12px rgba(0,0,0,0.2);">
            ${countLabel}
          </div>
        `,
        className: '',
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      }),
    [countLabel]
  )

  return (
    <Marker
      position={[cluster.latitude, cluster.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => {
          map.fitBounds(cluster.bounds, { padding: [40, 40] })
          if (map.getZoom() === currentZoom) {
            map.setZoom(currentZoom + 2)
          }
        },
      }}
    />
  )
}
