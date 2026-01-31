import { prisma } from '@/lib/prisma'
import { getTrendingDishes } from '@/services/trending.service'
import { DishGrid } from '@/components/dish/DishGrid'

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

        <DishGrid
          dishes={dishes.map((dish) => {
            const latestPrice = dish.prices[0]
            return {
              id: dish.id,
              name: dish.name,
              averageRating: dish.averageRating,
              totalReviews: dish.totalReviews,
              restaurantName: dish.restaurant.name,
              category: dish.category,
              description: dish.description,
              lowestPrice: latestPrice ? latestPrice.price : null,
              currency: latestPrice ? latestPrice.currency : undefined,
            }
          })}
          emptyState="No dishes found. Check back soon for the latest additions."
        />
      </div>
    </main>
  )
}
