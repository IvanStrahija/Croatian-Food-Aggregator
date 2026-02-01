import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().optional().nullable(),
  comment: z.string().optional().nullable(),
})

async function updateDishRating(dishId: string) {
  const aggregate = await prisma.review.aggregate({
    where: { dishId },
    _avg: { rating: true },
    _count: { rating: true },
  })

  await prisma.dish.update({
    where: { id: dishId },
    data: {
      averageRating: aggregate._avg.rating || 0,
      totalReviews: aggregate._count.rating,
    },
  })
}

async function updateRestaurantRating(restaurantId: string) {
  const aggregate = await prisma.review.aggregate({
    where: {
      OR: [
        { restaurantId },
        {
          dish: {
            restaurantId,
          },
        },
      ],
    },
    _avg: { rating: true },
    _count: { rating: true },
  })

  await prisma.restaurant.update({
    where: { id: restaurantId },
    data: {
      averageRating: aggregate._avg.rating || 0,
      totalReviews: aggregate._count.rating,
    },
  })
}

interface RouteParams {
  params: {
    id: string
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = updateReviewSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const existingReview = await prisma.review.findUnique({
      where: { id: params.id },
      include: {
        dish: {
          select: {
            restaurantId: true,
          },
        },
      },
    })

    if (!existingReview) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 })
    }

    if (existingReview.userId !== session.user.id && session.user?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const review = await prisma.review.update({
      where: { id: params.id },
      data: {
        ...validation.data,
        isEdited: true,
      },
    })

    if (existingReview.dishId) {
      await updateDishRating(existingReview.dishId)
      if (existingReview.dish?.restaurantId) {
        await updateRestaurantRating(existingReview.dish.restaurantId)
      }
    }

    if (existingReview.restaurantId) {
      await updateRestaurantRating(existingReview.restaurantId)
    }

    return NextResponse.json({ success: true, data: review })
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json({ success: false, error: 'Failed to update review' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const existingReview = await prisma.review.findUnique({
      where: { id: params.id },
      include: {
        dish: {
          select: {
            restaurantId: true,
          },
        },
      },
    })

    if (!existingReview) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 })
    }

    if (existingReview.userId !== session.user.id && session.user?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    await prisma.review.delete({
      where: { id: params.id },
    })

    if (existingReview.dishId) {
      await updateDishRating(existingReview.dishId)
      if (existingReview.dish?.restaurantId) {
        await updateRestaurantRating(existingReview.dish.restaurantId)
      }
    }

    if (existingReview.restaurantId) {
      await updateRestaurantRating(existingReview.restaurantId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete review' }, { status: 500 })
  }
}
