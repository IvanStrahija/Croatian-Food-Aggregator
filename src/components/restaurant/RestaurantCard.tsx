interface RestaurantCardProps {
  name: string
  city: string
  rating: number
}

export function RestaurantCard({ name, city, rating }: RestaurantCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{city}</p>
      <p className="mt-2 text-sm">⭐ {rating.toFixed(1)}</p>
    </div>
  )
}
