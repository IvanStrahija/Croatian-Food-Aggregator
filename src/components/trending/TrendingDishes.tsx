import Link from 'next/link'
import { TrendingDish } from '@/services/trending.service'
import { DishGrid } from '@/components/dish/DishGrid'

interface TrendingDishesProps {
  dishes: TrendingDish[]
}

export function TrendingDishes({ dishes }: TrendingDishesProps) {
  return (
    <section className="container mx-auto px-4 py-12 pb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">🍕 Trending Dishes</h2>
        <Link href="/dishes?sort=trending" className="text-orange-500 hover:text-orange-600 font-medium">
          View All →
        </Link>
      </div>
      <DishGrid dishes={dishes} variant="featured" />
    </section>
  )
}
