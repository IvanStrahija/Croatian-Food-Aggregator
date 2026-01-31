import Link from 'next/link'

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white md:hidden">
      <div className="flex items-center justify-around py-3 text-sm">
        <Link href="/" className="hover:text-orange-500">
          Home
        </Link>
        <Link href="/restaurants" className="hover:text-orange-500">
          Restaurants
        </Link>
        <Link href="/map" className="hover:text-orange-500">
          Map
        </Link>
      </div>
    </nav>
  )
}
