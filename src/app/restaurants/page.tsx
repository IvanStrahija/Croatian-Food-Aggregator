import { prisma } from '@/lib/prisma'
import { RestaurantGrid } from '@/components/restaurant/RestaurantGrid'

interface RestaurantsPageProps {
  searchParams?: {
    city?: string
  }
}

export default async function RestaurantsPage({ searchParams }: RestaurantsPageProps) {
  const city = searchParams?.city

  const restaurants = await prisma.restaurant.findMany({
    where: {
      status: 'ACTIVE',
      ...(city ? { city } : {}),
    },
    orderBy: {
      averageRating: 'desc',
    },
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-gray-600">
            {city ? `Showing restaurants in ${city}.` : 'Browse top-rated restaurants across Croatia.'}
          </p>
        </div>

        <RestaurantGrid
          restaurants={restaurants.map((restaurant) => ({
            id: restaurant.id,
            name: restaurant.name,
            slug: restaurant.slug,
            averageRating: restaurant.averageRating,
            totalReviews: restaurant.totalReviews,
            city: restaurant.city,
            address: restaurant.address,
            description: restaurant.description ?? 'No description available yet.',
          }))}
          emptyState="No restaurants found. Try another city or check back soon."
        />
      </div>
    </main>
  )
}
