import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { getTrendingDishes } from '@/services/trending.service'

interface DishesPageProps {
  searchParams?: {
    sort?: string
  }
}

export default async function DishesPage({ searchParams }: DishesPageProps) {
  const sort = searchParams?.sort
  const baseWhere = {
    verified: true,
    isAvailable: true,
    restaurant: {
      status: 'ACTIVE' as const,
      verified: true,
    },
  }

  const dishes = await prisma.dish.findMany({
    where: baseWhere,
    include: {
      restaurant: {
        select: {
          name: true,
          slug: true,
        },
      },
      prices: {
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
        take: 1,
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  if (sort === 'trending' && dishes.length > 0) {
    const trending = await getTrendingDishes(dishes.length)
    const trendingOrder = new Map(trending.map((dish, index) => [dish.id, index]))

    dishes.sort((a, b) => {
      const aRank = trendingOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER
      const bRank = trendingOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER

      if (aRank !== bRank) {
        return aRank - bRank
      }

      return a.name.localeCompare(b.name)
    })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dishes</h1>
          <p className="text-gray-600">
            {sort === 'trending'
              ? 'Showing dishes sorted by what is trending right now.'
              : 'Browse dishes from verified restaurants across Croatia.'}
          </p>
        </div>

        {dishes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
            No dishes found. Check back soon for the latest additions.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dishes.map((dish) => {
              const latestPrice = dish.prices[0]
              return (
                <Link
                  key={dish.id}
                  href={`/dishes/${dish.id}`}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {dish.name}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {dish.restaurant.name}
                      </p>
                    </div>
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
                      ⭐ {dish.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    {dish.category || 'Featured dish'}
                  </p>
                  {dish.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                      {dish.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                    <span>{dish.totalReviews} reviews</span>
                    {latestPrice && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-600">
                        {formatPrice(latestPrice.price, latestPrice.currency)}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
