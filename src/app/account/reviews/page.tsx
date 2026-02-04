import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ReviewList } from '@/components/review/ReviewList'

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
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      dish: {
        include: {
          restaurant: true,
        },
      },
      restaurant: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Your Reviews</h1>
        <p className="mt-2 text-gray-600">All the dishes and restaurants you have reviewed.</p>

        <div className="mt-6">
          <ReviewList
            reviews={reviews.map((review) => ({
              id: review.id,
              rating: review.rating,
              title: review.title,
              comment: review.comment,
              subjectName: review.dish ? review.dish.name : (review.restaurant?.name ?? 'Restaurant'),
              subtitle: review.dish
                ? review.dish.restaurant.name
                : review.restaurant
                  ? `${review.restaurant.city}${review.restaurant.address ? ` · ${review.restaurant.address}` : ''}`
                  : undefined,
              username: review.user.name ?? review.user.email ?? 'Anonymous',
              createdAt: review.createdAt.toISOString(),
            }))}
            emptyState="You have not posted any reviews yet."
          />
        </div>
      </div>
    </main>
  )
}
