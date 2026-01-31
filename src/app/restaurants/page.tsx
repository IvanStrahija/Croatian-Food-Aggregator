import Link from 'next/link'

const sampleRestaurants = [
  { slug: 'pizzeria-napoli', name: 'Pizzeria Napoli', city: 'Zagreb' },
  { slug: 'burger-house', name: 'Burger House', city: 'Zagreb' },
]

export default function RestaurantsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Restaurants</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {sampleRestaurants.map(restaurant => (
          <Link
            key={restaurant.slug}
            href={`/restaurants/${restaurant.slug}`}
            className="rounded-lg border border-gray-200 p-4 hover:border-orange-500"
          >
            <h2 className="text-xl font-semibold">{restaurant.name}</h2>
            <p className="text-sm text-gray-600">{restaurant.city}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
