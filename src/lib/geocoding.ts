export interface GeocodingResult {
  latitude: number
  longitude: number
}

export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  if (!address) {
    return null
  }

  return null
}
