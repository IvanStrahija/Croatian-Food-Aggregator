import Link from 'next/link'

export default function AdminRestaurantsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Restaurants</h1>
        <Link
          href="/admin/restaurants/new"
          className="rounded-md bg-orange-500 px-4 py-2 text-white"
        >
          Add Restaurant
        </Link>
      </div>
      <p className="text-gray-600">
        Admin tooling for managing restaurants will be shown here.
      </p>
    </main>
  )
}
