import Link from 'next/link'

export default function AccountPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Your Account</h1>
      <p className="text-gray-600 mb-6">
        Manage your profile and review history from this dashboard.
      </p>
      <Link
        href="/account/reviews"
        className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-white"
      >
        View Reviews
      </Link>
    </main>
  )
}
