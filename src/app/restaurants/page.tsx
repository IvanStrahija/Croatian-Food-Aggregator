import Link from 'next/link'
import { prisma } from '@/lib/prisma'

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

        {restaurants.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
            No restaurants found. Try another city or check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.slug}`}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {restaurant.name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {restaurant.address}, {restaurant.city}
                    </p>
                  </div>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
                    ⭐ {restaurant.averageRating.toFixed(1)}
                  </span>
                </div>
                <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                  {restaurant.description || 'No description available yet.'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
