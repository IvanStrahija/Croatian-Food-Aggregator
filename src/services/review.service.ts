import { prisma } from '@/lib/prisma'

export async function createReview({
  userId,
  dishId,
  rating,
  comment,
}: {
  userId: string
  dishId: string
  rating: number
  comment?: string
}) {
  return prisma.review.create({
    data: {
      userId,
      dishId,
      rating,
      comment,
    },
  })
}

export async function getReviewsForDish(dishId: string) {
  return prisma.review.findMany({
    where: { dishId },
    orderBy: { createdAt: 'desc' },
  })
}
