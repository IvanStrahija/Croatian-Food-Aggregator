import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AccountReviewsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900">Your Reviews</h1>
          <p className="mt-2 text-gray-600">Please sign in to view your reviews.</p>
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

  const reviews = await prisma.review.findMany({
    where: { userId: session.user.id },
    include: {
      dish: {
        include: {
          restaurant: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Your Reviews</h1>
        <p className="mt-2 text-gray-600">All the dishes you have reviewed.</p>

        {reviews.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600">
            You have not posted any reviews yet.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{review.dish.name}</h2>
                    <p className="text-sm text-gray-500">{review.dish.restaurant.name}</p>
                  </div>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
                    ⭐ {review.rating}
                  </span>
                </div>
                {review.title && (
                  <p className="mt-3 font-medium text-gray-900">{review.title}</p>
                )}
                {review.comment && (
                  <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
