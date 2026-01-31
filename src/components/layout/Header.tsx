import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-orange-500">
          Croatian Food Aggregator
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/restaurants" className="hover:text-orange-500">
            Restaurants
          </Link>
          <Link href="/dishes" className="hover:text-orange-500">
            Dishes
          </Link>
          <Link href="/map" className="hover:text-orange-500">
            Map
          </Link>
        </nav>
      </div>
    </header>
  )
}
