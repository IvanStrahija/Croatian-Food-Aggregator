export interface GeocodingResult {
  latitude: number
  longitude: number
  displayName: string
}

export async function geocodeAddress(
  address: string
): Promise<GeocodingResult | null> {
  const query = encodeURIComponent(address)
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'croatian-food-aggregator/1.0',
    },
  })

  if (!response.ok) {
    return null
  }

  const results = (await response.json()) as Array<{
    lat: string
    lon: string
    display_name: string
  }>

  const first = results[0]
  if (!first) {
    return null
  }

  return {
    latitude: parseFloat(first.lat),
    longitude: parseFloat(first.lon),
    displayName: first.display_name,
  }
}
