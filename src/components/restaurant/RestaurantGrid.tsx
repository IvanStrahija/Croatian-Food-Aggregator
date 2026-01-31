import { RestaurantCard } from './RestaurantCard'

const sampleRestaurants = [
  { name: 'Pizzeria Napoli', city: 'Zagreb', rating: 4.5 },
  { name: 'Burger House', city: 'Zagreb', rating: 4.2 },
]

export function RestaurantGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sampleRestaurants.map(restaurant => (
        <RestaurantCard key={restaurant.name} {...restaurant} />
      ))}
    </div>
  )
}
