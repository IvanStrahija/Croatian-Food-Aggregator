interface RestaurantMarkerProps {
  name: string
}

export function RestaurantMarker({ name }: RestaurantMarkerProps) {
  return <span className="text-sm text-orange-500">📍 {name}</span>
}
