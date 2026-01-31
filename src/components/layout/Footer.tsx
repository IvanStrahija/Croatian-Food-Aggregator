import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">Croatian Food Aggregator</p>
          <p className="mt-1 text-sm text-gray-500">
            Compare prices, explore trending dishes, and share reviews.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-gray-600">
          <Link href="/restaurants" className="hover:text-orange-500">Restaurants</Link>
          <Link href="/dishes" className="hover:text-orange-500">Dishes</Link>
          <Link href="/map" className="hover:text-orange-500">Map</Link>
          <Link href="/account" className="hover:text-orange-500">Account</Link>
        </nav>
      </div>
    </footer>
  )
}
