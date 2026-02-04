import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DishGrid } from '@/components/dish/DishGrid'
import { MapView } from '@/components/map/MapView'
import { RestaurantReviews } from '@/components/restaurant/RestaurantReviews'

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
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })

  if (!restaurant) {
    notFound()
  }

  const hasLocation = restaurant.latitude !== null && restaurant.longitude !== null

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
              {restaurant.openingHours && <span>🕒 {restaurant.openingHours}</span>}
	      {restaurant.website && <span>🌐 {restaurant.website}</span>}
            </div>
          </div>

          {restaurant.description && (
            <p className="mt-4 text-gray-700">{restaurant.description}</p>
          )}
        </div>

        <RestaurantReviews
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          restaurantSubtitle={`${restaurant.address}, ${restaurant.city}`}
          reviews={restaurant.reviews.map((review) => ({
            id: review.id,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            subjectName: restaurant.name,
            subtitle: `${restaurant.address}, ${restaurant.city}`,
            username: review.user.name ?? review.user.email ?? 'Anonymous',
            createdAt: review.createdAt.toISOString(),
          }))}
        />

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Location</h2>
            <span className="text-sm text-gray-500">{restaurant.city}</span>
          </div>
          {hasLocation ? (
            <MapView
              markers={[
                {
                  id: restaurant.id,
                  name: restaurant.name,
                  address: restaurant.address,
                  city: restaurant.city,
                  latitude: restaurant.latitude ?? 0,
                  longitude: restaurant.longitude ?? 0,
                },
              ]}
              zoom={15}
              containerClassName="mt-6"
              mapClassName="h-72"
            />
          ) : (
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
              Location details are not available yet.
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Menu highlights</h2>
            <span className="text-sm text-gray-500">{restaurant.dishes.length} dishes</span>
          </div>

          <div className="mt-6">
            <DishGrid
              dishes={restaurant.dishes.map((dish) => {
                const latestPrice = dish.prices[0]
                return {
                  id: dish.id,
                  name: dish.name,
                  averageRating: dish.averageRating,
                  totalReviews: dish.totalReviews,
                  category: dish.category ?? 'Popular dish',
                  description: dish.description,
                  lowestPrice: latestPrice ? latestPrice.price : null,
                  currency: latestPrice ? latestPrice.currency : undefined,
                }
              })}
              emptyState="No dishes available yet."
            />
          </div>
        </section>
      </div>
    </main>
  )
}
