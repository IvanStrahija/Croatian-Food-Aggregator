import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function AdminImportPage() {
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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <Link href="/admin/restaurants" className="text-orange-500 hover:text-orange-600">
          ← Back to admin
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Import Restaurants</h1>
        <p className="mt-2 text-gray-600">Upload CSV files to bulk import restaurants and dishes.</p>

        <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white p-6 text-gray-600">
          CSV import tooling will be connected here. Use the API endpoint
          <span className="font-semibold"> /api/connectors/import</span> to wire up automated imports.
        </div>
      </div>
    </main>
  )
}
