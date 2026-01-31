import { getTrendingRestaurants, getTrendingDishes } from '@/services/trending.service'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { TrendingRestaurants } from '@/components/trending/TrendingRestaurants'
import { TrendingDishes } from '@/components/trending/TrendingDishes'

export default async function HomePage() {
  const [trendingRestaurants, trendingDishes, session] = await Promise.all([
    getTrendingRestaurants(6),
    getTrendingDishes(8),
    getServerSession(authOptions),
  ])

  const isAdmin = session?.user?.role === 'ADMIN'

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
            <Input
              name="q"
              placeholder="Search for restaurants or dishes..."
              className="w-full rounded-full border-2 border-gray-200 px-6 py-4 text-lg focus:border-orange-500"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-8 py-3 font-medium"
            >
              Search
            </Button>
          </form>
        </div>

        {/* Quick Links */}
        <div className="flex gap-4 justify-center mt-8 flex-wrap">
          <Link
            href="/map"
            className="px-6 py-2 border-2 text-gray-800 border-gray-300 rounded-full hover:border-orange-500 hover:text-orange-500 transition-colors"
          >
            🗺️ Browse Map
          </Link>
          <Link
            href="/restaurants"
            className="px-6 py-2 border-2 text-gray-800 border-gray-300 rounded-full hover:border-orange-500 hover:text-orange-500 transition-colors"
          >
            🍽️ All Restaurants
          </Link>
          
          {/* Admin Button - Only visible to admins */}
          {isAdmin && (
            <Link
              href="/admin/restaurants/new"
              className="px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors font-medium"
            >
              ⚙️ Add Restaurant
            </Link>
          )}
        </div>
      </section>

      {/* Admin Quick Access - Alternative placement at top right */}
      {isAdmin && (
        <div className="fixed top-4 right-4 z-50">
          <Link
            href="/admin/restaurants/new"
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-all hover:shadow-xl"
          >
            <span className="text-xl">⚙️</span>
            <span className="font-medium">Admin: Add Restaurant</span>
          </Link>
        </div>
      )}

      {/* Trending Restaurants */}
      <TrendingRestaurants restaurants={trendingRestaurants} />
      <TrendingDishes dishes={trendingDishes} />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Reviewing Your Favorite Dishes</h2>
          <p className="text-lg mb-8 opacity-90">
            Join our community and share your food experiences with others
          </p>
          <div className="flex gap-4 justify-center">
            {!session ? (
              <>
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
              </>
            ) : (
              <div className="text-white">
                <p className="text-xl">Welcome back, {session.user?.name || session.user?.email}!</p>
                {isAdmin && (
                  <p className="text-sm mt-2 opacity-90">You have admin access</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
