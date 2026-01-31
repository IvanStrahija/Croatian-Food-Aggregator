import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900">Your Account</h1>
          <p className="mt-2 text-gray-600">
            Please sign in to view your profile and favorites.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center rounded-full bg-orange-500 px-6 py-2 text-white hover:bg-orange-600"
          >
            Sign in
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {session.user?.name || 'Food lover'}!</h1>
        <p className="mt-2 text-gray-600">Manage your account details and reviews.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
            <p className="mt-2 text-sm text-gray-600">Email: {session.user?.email}</p>
            <p className="mt-1 text-sm text-gray-600">Role: {session.user?.role}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Your activity</h2>
            <p className="mt-2 text-sm text-gray-600">
              See all of your reviews and ratings.
            </p>
            <Link
              href="/account/reviews"
              className="mt-4 inline-flex items-center text-orange-500 hover:text-orange-600"
            >
              View reviews →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
