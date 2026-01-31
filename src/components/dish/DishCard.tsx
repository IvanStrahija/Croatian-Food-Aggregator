import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Rating } from '@/components/ui/Rating'
import { formatPrice } from '@/lib/utils'

export interface DishSummary {
  id: string
  name: string
  slug?: string
  imageUrl?: string | null
  averageRating: number
  totalReviews: number
  restaurantName?: string | null
  restaurantSlug?: string | null
  category?: string | null
  description?: string | null
  lowestPrice?: number | null
  currency?: string
}

interface DishCardProps {
  dish: DishSummary
  variant?: 'featured' | 'compact'
}

export function DishCard({ dish, variant = 'compact' }: DishCardProps) {
  const href = dish.slug ? `/dishes/${dish.slug}` : `/dishes/${dish.id}`

  if (variant === 'featured') {
    return (
      <Link href={href} className="group">
        <Card className="overflow-hidden transition-shadow hover:shadow-xl">
          <div className="relative h-40 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
            {dish.imageUrl ? (
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <span className="text-5xl">🍽️</span>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-base font-bold text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-1">
              {dish.name}
            </h3>
            {dish.restaurantName && (
              <p className="mt-1 text-xs text-gray-600 line-clamp-1">{dish.restaurantName}</p>
            )}
            <div className="mt-3 flex items-center justify-between">
              <div>
                {dish.lowestPrice && (
                  <p className="font-bold text-green-600">
                    {formatPrice(dish.lowestPrice, dish.currency ?? 'EUR')}
                  </p>
                )}
                <Rating value={dish.averageRating} label={`${dish.totalReviews} reviews`} className="mt-1" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={href}>
      <Card className="p-6 transition hover:shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{dish.name}</h3>
            {dish.restaurantName && (
              <p className="mt-1 text-sm text-gray-500">{dish.restaurantName}</p>
            )}
          </div>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
            ⭐ {dish.averageRating.toFixed(1)}
          </span>
        </div>
        <p className="mt-3 text-sm text-gray-600">{dish.category || 'Featured dish'}</p>
        {dish.description && <p className="mt-2 text-sm text-gray-600 line-clamp-3">{dish.description}</p>}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{dish.totalReviews} reviews</span>
          {dish.lowestPrice && (
            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-600">
              {formatPrice(dish.lowestPrice, dish.currency ?? 'EUR')}
            </span>
          )}
        </div>
      </Card>
    </Link>
  )
}
