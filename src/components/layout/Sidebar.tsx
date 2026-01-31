import Link from 'next/link'

export function Sidebar() {
  return (
    <aside className="hidden w-64 border-r border-gray-200 bg-white p-6 md:block">
      <nav className="space-y-3 text-sm">
        <Link href="/account" className="block hover:text-orange-500">
          Account
        </Link>
        <Link href="/account/reviews" className="block hover:text-orange-500">
          Reviews
        </Link>
        <Link href="/admin/restaurants" className="block hover:text-orange-500">
          Admin
        </Link>
      </nav>
    </aside>
  )
}
