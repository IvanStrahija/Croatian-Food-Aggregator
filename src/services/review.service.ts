import { prisma } from '@/lib/prisma'

export async function createReview(data: {
  userId: string
  dishId?: string
  restaurantId?: string
  rating: number
  comment?: string
}) {
  return prisma.review.create({
    data: {
      userId: data.userId,
      dishId: data.dishId,
      restaurantId: data.restaurantId,
      rating: data.rating,
      comment: data.comment,
    },
  })
}

export async function updateReview(reviewId: string, data: {
  rating?: number
  comment?: string | null
}) {
  return prisma.review.update({
    where: { id: reviewId },
    data,
  })
}

export async function deleteReview(reviewId: string) {
  return prisma.review.delete({
    where: { id: reviewId },
  })
}
