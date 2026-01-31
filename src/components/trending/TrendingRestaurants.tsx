import Link from 'next/link'
import { TrendingRestaurant } from '@/services/trending.service'
import { RestaurantGrid } from '@/components/restaurant/RestaurantGrid'

interface TrendingRestaurantsProps {
  restaurants: TrendingRestaurant[]
}

export function TrendingRestaurants({ restaurants }: TrendingRestaurantsProps) {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">🔥 Trending Restaurants</h2>
        <Link href="/restaurants?sort=trending" className="text-orange-500 hover:text-orange-600 font-medium">
          View All →
        </Link>
      </div>
      <RestaurantGrid restaurants={restaurants} variant="featured" />
    </section>
  )
}
