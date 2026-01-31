import { getTrendingRestaurants, getTrendingDishes } from '@/services/trending.service'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export default async function HomePage() {
  const [trendingRestaurants, trendingDishes] = await Promise.all([
    getTrendingRestaurants(6),
    getTrendingDishes(8),
  ])

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Find the Best Food in{' '}
          <span className="text-orange-500">Croatia</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Compare prices across Wolt, Glovo, and local restaurants. Read reviews from real food lovers.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <form action="/search" method="GET" className="relative">
            <input
              type="text"
              name="q"
              placeholder="Search for restaurants or dishes..."
              className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors font-medium"
            >
              Search
            </button>
          </form>
        </div>

        {/* Quick Links */}
        <div className="flex gap-4 justify-center mt-8 flex-wrap">
          <Link
            href="/map"
            className="px-6 py-2 border-2 border-gray-300 rounded-full hover:border-orange-500 hover:text-orange-500 transition-colors"
          >
            🗺️ Browse Map
          </Link>
          <Link
            href="/restaurants"
            className="px-6 py-2 border-2 border-gray-300 rounded-full hover:border-orange-500 hover:text-orange-500 transition-colors"
          >
            🍽️ All Restaurants
          </Link>
        </div>
      </section>

      {/* Trending Restaurants */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">🔥 Trending Restaurants</h2>
          <Link
            href="/restaurants?sort=trending"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingRestaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/restaurants/${restaurant.slug}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                {restaurant.imageUrl ? (
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-6xl">🍽️</span>
                )}
                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  ⭐ {restaurant.averageRating.toFixed(1)}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 group-hover:text-orange-500 transition-colors">
                  {restaurant.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">📍 {restaurant.city}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {restaurant.totalReviews} reviews
                  </span>
                  <span className="text-orange-500 font-medium">
                    🔥 {restaurant.trendingScore} pts
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Dishes */}
      <section className="container mx-auto px-4 py-12 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">🍕 Trending Dishes</h2>
          <Link
            href="/dishes?sort=trending"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingDishes.map((dish) => (
            <Link
              key={dish.id}
              href={`/dishes/${dish.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="relative h-40 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                {dish.imageUrl ? (
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-5xl">🍽️</span>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-bold text-base mb-1 group-hover:text-orange-500 transition-colors line-clamp-1">
                  {dish.name}
                </h3>
                <p className="text-gray-600 text-xs mb-2 line-clamp-1">
                  {dish.restaurantName}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    {dish.lowestPrice && (
                      <p className="font-bold text-green-600">
                        {formatPrice(dish.lowestPrice)}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-xs">
                      <span>⭐ {dish.averageRating.toFixed(1)}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">
                        {dish.totalReviews} reviews
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Reviewing Your Favorite Dishes</h2>
          <p className="text-lg mb-8 opacity-90">
            Join our community and share your food experiences with others
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-orange-500 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              Sign Up Free
            </Link>
            <Link
              href="/login"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-orange-500 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
