import Link from 'next/link'

interface SidebarItem {
  label: string
  href: string
}

interface SidebarProps {
  title?: string
  items: SidebarItem[]
}

export function Sidebar({ title = 'Admin', items }: SidebarProps) {
  return (
    <aside className="hidden h-full w-64 flex-shrink-0 border-r border-gray-200 bg-white p-6 lg:block">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h2>
      <nav className="mt-4 space-y-2 text-sm text-gray-700">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2 hover:bg-orange-50 hover:text-orange-600">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
