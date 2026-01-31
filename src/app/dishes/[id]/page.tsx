import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Rating } from '@/components/ui/Rating'
import { PriceComparison } from '@/components/restaurant/PriceComparison'
import { DishReviews } from '@/components/dish/DishReviews'

interface DishDetailPageProps {
  params: {
    id: string
  }
}

export default async function DishDetailPage({ params }: DishDetailPageProps) {
  const dish = await prisma.dish.findFirst({
    where: {
      OR: [
        { id: params.id },
        { slug: params.id },
      ],
    },
    include: {
      restaurant: true,
      prices: {
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
      },
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 6,
      },
    },
  })

  if (!dish) {
    notFound()
  }

  const latestPrice = dish.prices[0]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <Link href={`/restaurants/${dish.restaurant.slug}`} className="text-orange-500 hover:text-orange-600">
          ← Back to {dish.restaurant.name}
        </Link>

        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">{dish.name}</h1>
          <p className="mt-1 text-gray-500">{dish.category || 'Featured dish'}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <Rating value={dish.averageRating} label={`${dish.totalReviews} reviews`} />
            {latestPrice && (
              <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-600">
                {formatPrice(latestPrice.price, latestPrice.currency)}
              </span>
            )}
          </div>

          {dish.description && (
            <p className="mt-4 text-gray-700">{dish.description}</p>
          )}
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">Where to order</h2>
          <p className="mt-2 text-sm text-gray-600">
            Compare the latest prices across delivery services.
          </p>
          <div className="mt-4">
            <PriceComparison
              prices={dish.prices.map((price) => ({
                id: price.id,
                service: price.service,
                price: price.price,
                currency: price.currency,
                updatedAt: price.updatedAt,
              }))}
            />
          </div>
        </section>

        <DishReviews
          dishName={dish.name}
          reviews={dish.reviews.map((review) => ({
            id: review.id,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            dishName: dish.name,
            restaurantName: dish.restaurant.name,
            createdAt: review.createdAt.toISOString(),
          }))}
        />
      </div>
    </main>
  )
}
