import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AdminRestaurantsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'ADMIN') {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900">Admin</h1>
          <p className="mt-2 text-gray-600">You do not have access to this area.</p>
        </div>
      </main>
    )
  }

  const restaurants = await prisma.restaurant.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Restaurants</h1>
            <p className="mt-2 text-gray-600">Review and edit restaurant listings.</p>
          </div>
          <Link
            href="/admin/restaurants/new"
            className="rounded-full bg-purple-600 px-5 py-2 text-white hover:bg-purple-700"
          >
            Add Restaurant
          </Link>
        </div>

        {restaurants.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600">
            No restaurants available.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{restaurant.name}</h2>
                    <p className="text-sm text-gray-500">{restaurant.city}</p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                    {restaurant.status}
                  </span>
                </div>
                <Link
                  href={`/restaurants/${restaurant.slug}`}
                  className="mt-3 inline-flex text-sm text-orange-500 hover:text-orange-600"
                >
                  View public page →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
