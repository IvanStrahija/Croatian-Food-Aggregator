import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'

interface RestaurantDetailPageProps {
  params: {
    slug: string
  }
}

export default async function RestaurantDetailPage({ params }: RestaurantDetailPageProps) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: params.slug },
    include: {
      dishes: {
        include: {
          prices: {
            where: { isActive: true },
            orderBy: { updatedAt: 'desc' },
          },
        },
      },
    },
  })

  if (!restaurant) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <Link href="/restaurants" className="text-orange-500 hover:text-orange-600">
          ← Back to restaurants
        </Link>

        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
            <p className="text-gray-600">{restaurant.address}, {restaurant.city}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>⭐ {restaurant.averageRating.toFixed(1)} rating</span>
              <span>{restaurant.totalReviews} reviews</span>
              {restaurant.phoneNumber && <span>📞 {restaurant.phoneNumber}</span>}
            </div>
          </div>

          {restaurant.description && (
            <p className="mt-4 text-gray-700">{restaurant.description}</p>
          )}
        </div>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Menu highlights</h2>
            <span className="text-sm text-gray-500">{restaurant.dishes.length} dishes</span>
          </div>

          {restaurant.dishes.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600">
              No dishes available yet.
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {restaurant.dishes.map((dish) => {
                const latestPrice = dish.prices[0]
                return (
                  <Link
                    key={dish.id}
                    href={`/dishes/${dish.id}`}
                    className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{dish.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {dish.category || 'Popular dish'}
                        </p>
                      </div>
                      {latestPrice && (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-600">
                          {formatPrice(latestPrice.price, latestPrice.currency)}
                        </span>
                      )}
                    </div>
                    {dish.description && (
                      <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                        {dish.description}
                      </p>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
