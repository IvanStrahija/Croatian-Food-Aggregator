import { RestaurantCard, RestaurantSummary } from '@/components/restaurant/RestaurantCard'

interface RestaurantGridProps {
  restaurants: RestaurantSummary[]
  variant?: 'featured' | 'compact'
  emptyState?: string
}

export function RestaurantGrid({
  restaurants,
  variant = 'compact',
  emptyState,
}: RestaurantGridProps) {
  if (restaurants.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
        {emptyState ?? 'No restaurants found.'}
      </div>
    )
  }

  const gridClass =
    variant === 'featured'
      ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
      : 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={gridClass}>
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} variant={variant} />
      ))}
    </div>
  )
}
