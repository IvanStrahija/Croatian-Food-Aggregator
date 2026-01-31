import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Rating } from '@/components/ui/Rating'
import { Card } from '@/components/ui/Card'

export interface RestaurantSummary {
  id: string
  name: string
  slug: string
  imageUrl?: string | null
  averageRating: number
  totalReviews: number
  city?: string | null
  address?: string | null
  description?: string | null
  trendingScore?: number | null
}

interface RestaurantCardProps {
  restaurant: RestaurantSummary
  variant?: 'featured' | 'compact'
}

export function RestaurantCard({ restaurant, variant = 'compact' }: RestaurantCardProps) {
  if (variant === 'featured') {
    return (
      <Link href={`/restaurants/${restaurant.slug}`} className="group">
        <Card className="overflow-hidden transition-shadow hover:shadow-xl">
          <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
            {restaurant.imageUrl ? (
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <span className="text-6xl">🍽️</span>
            )}
            <div className="absolute top-3 right-3 rounded-full bg-white px-3 py-1 text-sm font-medium">
              ⭐ {restaurant.averageRating.toFixed(1)}
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-500 transition-colors">
              {restaurant.name}
            </h3>
            <p className="mt-1 text-sm text-gray-600">📍 {restaurant.city}</p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-500">{restaurant.totalReviews} reviews</span>
              {restaurant.trendingScore !== undefined && restaurant.trendingScore !== null && (
                <span className="font-medium text-orange-500">🔥 {restaurant.trendingScore} pts</span>
              )}
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/restaurants/${restaurant.slug}`}>
      <Card className="p-6 transition hover:shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{restaurant.name}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {restaurant.address ? `${restaurant.address}, ` : ''}
              {restaurant.city}
            </p>
          </div>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
            ⭐ {restaurant.averageRating.toFixed(1)}
          </span>
        </div>
        {restaurant.description && (
          <p className={cn('mt-4 text-sm text-gray-600 line-clamp-3')}>
            {restaurant.description}
          </p>
        )}
        <Rating value={restaurant.averageRating} label={`${restaurant.totalReviews} reviews`} className="mt-4" />
      </Card>
    </Link>
  )
}
