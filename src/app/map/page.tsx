import { MapView } from '@/components/map/MapView'
import { prisma } from '@/lib/prisma'

export default async function MapPage() {
  const restaurants = await prisma.restaurant.findMany({
    where: {
      status: 'ACTIVE',
      latitude: {
        not: null,
      },
      longitude: {
        not: null,
      },
    },
    orderBy: {
      averageRating: 'desc',
    },
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Map View</h1>
        <p className="mt-2 text-gray-600">
          Explore restaurants across Croatia and tap a pin to see the address.
        </p>
        <MapView
          markers={restaurants.map((restaurant) => ({
            id: restaurant.id,
            name: restaurant.name,
            address: restaurant.address,
            city: restaurant.city,
            latitude: restaurant.latitude ?? 0,
            longitude: restaurant.longitude ?? 0,
          }))}
        />
      </div>
    </main>
  )
}
