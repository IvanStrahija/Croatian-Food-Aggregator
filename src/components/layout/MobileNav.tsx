import Link from 'next/link'

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-gray-200 bg-white/95 py-3 text-xs text-gray-600 shadow-lg md:hidden">
      <Link href="/" className="flex flex-col items-center gap-1">
        <span className="text-base">🏠</span>
        Home
      </Link>
      <Link href="/restaurants" className="flex flex-col items-center gap-1">
        <span className="text-base">🍽️</span>
        Restaurants
      </Link>
      <Link href="/dishes" className="flex flex-col items-center gap-1">
        <span className="text-base">🍲</span>
        Dishes
      </Link>
      <Link href="/account" className="flex flex-col items-center gap-1">
        <span className="text-base">👤</span>
        Account
      </Link>
    </nav>
  )
}
