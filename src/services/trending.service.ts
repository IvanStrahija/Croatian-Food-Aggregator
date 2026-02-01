import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'

interface TrendingWeights {
  views: number
  favorites: number
  reviews: number
  rating: number
}

const DEFAULT_WEIGHTS: TrendingWeights = {
  views: parseFloat(process.env.TRENDING_WEIGHT_VIEWS || '1.0'),
  favorites: parseFloat(process.env.TRENDING_WEIGHT_FAVORITES || '2.0'),
  reviews: parseFloat(process.env.TRENDING_WEIGHT_REVIEWS || '3.0'),
  rating: parseFloat(process.env.TRENDING_WEIGHT_RATING || '10.0'),
}

const CACHE_TTL = parseInt(process.env.TRENDING_CACHE_TTL || '900')

export interface TrendingRestaurant {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  averageRating: number
  totalReviews: number
  city: string
  trendingScore: number
}

export interface TrendingDish {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  averageRating: number
  totalReviews: number
  restaurantName: string
  restaurantSlug: string
  trendingScore: number
  lowestPrice: number | null
}

/**
 * Calculate trending score for a restaurant
 * Formula: (views * W1 + favorites * W2 + reviews * W3 + avgRating * W4) / daysOld
 */
function calculateTrendingScore(
  views: number,
  favorites: number,
  reviews: number,
  avgRating: number,
  createdAt: Date,
  weights: TrendingWeights = DEFAULT_WEIGHTS
): number {
  const now = new Date()
  const ageInDays = Math.max(
    1,
    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  )

  const score =
    (views * weights.views +
      favorites * weights.favorites +
      reviews * weights.reviews +
      avgRating * weights.rating) /
    ageInDays

  return Math.round(score * 100) / 100
}

/**
 * Get trending restaurants (last 7 days)
 */
export async function getTrendingRestaurants(
  limit: number = 10,
  weights?: TrendingWeights
): Promise<TrendingRestaurant[]> {
  const cacheKey = `trending:restaurants:${limit}`
  const cached = cache.get<TrendingRestaurant[]>(cacheKey)
  
  if (cached) {
    return cached
  }

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // Get restaurants with their stats
  const restaurants = await prisma.restaurant.findMany({
    where: {
      status: 'ACTIVE',
      verified: true,
    },
    include: {
      _count: {
        select: {
          viewEvents: {
            where: {
              createdAt: {
                gte: sevenDaysAgo,
              },
            },
          },
          favorites: {
            where: {
              createdAt: {
                gte: sevenDaysAgo,
              },
            },
          },
        },
      },
      dishes: {
        include: {
          _count: {
            select: {
              reviews: {
                where: {
                  createdAt: {
                    gte: sevenDaysAgo,
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  const restaurantReviewCounts = await prisma.review.groupBy({
    by: ['restaurantId'],
    where: {
      restaurantId: {
        in: restaurants.map((restaurant) => restaurant.id),
        not: null,
      },
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    _count: {
      _all: true,
    },
  })

  const restaurantReviewCountMap = restaurantReviewCounts.reduce<Record<string, number>>(
    (acc, item) => {
      if (item.restaurantId) {
        acc[item.restaurantId] = item._count._all
      }
      return acc
    },
    {}
  )

  // Calculate scores and format
  const trending = restaurants
    .map(restaurant => {
      const views = restaurant._count.viewEvents
      const favorites = restaurant._count.favorites
      const dishReviews = restaurant.dishes.reduce(
        (sum, dish) => sum + dish._count.reviews,
        0
      )
      const reviews = dishReviews + (restaurantReviewCountMap[restaurant.id] ?? 0)

      const trendingScore = calculateTrendingScore(
        views,
        favorites,
        reviews,
        restaurant.averageRating,
        restaurant.createdAt,
        weights
      )

      return {
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug,
        imageUrl: restaurant.imageUrl,
        averageRating: restaurant.averageRating,
        totalReviews: restaurant.totalReviews,
        city: restaurant.city,
        trendingScore,
      }
    })
    .filter(r => r.trendingScore > 0)
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit)

  cache.set(cacheKey, trending, CACHE_TTL)
  return trending
}

/**
 * Get trending dishes (last 7 days)
 */
export async function getTrendingDishes(
  limit: number = 10,
  weights?: TrendingWeights
): Promise<TrendingDish[]> {
  const cacheKey = `trending:dishes:${limit}`
  const cached = cache.get<TrendingDish[]>(cacheKey)
  
  if (cached) {
    return cached
  }

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const dishes = await prisma.dish.findMany({
    where: {
      verified: true,
      isAvailable: true,
      restaurant: {
        status: 'ACTIVE',
        verified: true,
      },
    },
    include: {
      restaurant: {
        select: {
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          reviews: {
            where: {
              createdAt: {
                gte: sevenDaysAgo,
              },
            },
          },
        },
      },
      prices: {
        where: {
          isActive: true,
        },
        orderBy: {
          price: 'asc',
        },
        take: 1,
      },
    },
  })

  // Get view events for dishes (via restaurant)
  const dishIds = dishes.map(d => d.id)
  const viewEvents = await prisma.viewEvent.findMany({
    where: {
      dishId: {
        in: dishIds,
      },
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      dishId: true,
    },
  })

  const viewCounts = viewEvents.reduce((acc, event) => {
    if (event.dishId) {
      acc[event.dishId] = (acc[event.dishId] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const trending = dishes
    .map(dish => {
      const views = viewCounts[dish.id] || 0
      const reviews = dish._count.reviews
      // Dishes don't have favorites in current schema, using 0
      const favorites = 0

      const trendingScore = calculateTrendingScore(
        views,
        favorites,
        reviews,
        dish.averageRating,
        dish.createdAt,
        weights
      )

      return {
        id: dish.id,
        name: dish.name,
        slug: dish.slug,
        imageUrl: dish.imageUrl,
        averageRating: dish.averageRating,
        totalReviews: dish.totalReviews,
        restaurantName: dish.restaurant.name,
        restaurantSlug: dish.restaurant.slug,
        trendingScore,
        lowestPrice: dish.prices[0]?.price || null,
      }
    })
    .filter(d => d.trendingScore > 0)
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit)

  cache.set(cacheKey, trending, CACHE_TTL)
  return trending
}

/**
 * Track a view event
 */
export async function trackView(
  type: 'restaurant' | 'dish',
  id: string,
  sessionId?: string,
  userId?: string
): Promise<void> {
  try {
    await prisma.viewEvent.create({
      data: {
        viewType: type === 'restaurant' ? 'RESTAURANT_VIEW' : 'DISH_VIEW',
        restaurantId: type === 'restaurant' ? id : undefined,
        dishId: type === 'dish' ? id : undefined,
        sessionId,
        userId,
      },
    })
  } catch (error) {
    // Silently fail - view tracking shouldn't break the app
    console.error('Failed to track view:', error)
  }
}
