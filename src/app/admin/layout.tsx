import { Sidebar } from '@/components/layout/Sidebar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <Sidebar
        title="Admin"
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Restaurants', href: '/admin/restaurants' },
          { label: 'Add Restaurant', href: '/admin/restaurants/new' },
        ]}
      />
      <div className="flex-1">{children}</div>
    </div>
  )
}
