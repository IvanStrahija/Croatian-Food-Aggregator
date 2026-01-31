import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const createReviewSchema = z.object({
  dishId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(100).optional(),
  comment: z.string().max(2000).optional(),
})

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Rate limiting
    const rateLimitResponse = await checkRateLimit(
      request,
      `review:${session.user.id}`,
      parseInt(process.env.RATE_LIMIT_REVIEW_PER_HOUR || '5', 10),
      3600
    )
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = createReviewSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: validation.error.errors,
        },
        { status: 400 }
      )
    }

    const { dishId, rating, title, comment } = validation.data

    // Check if dish exists
    const dish = await prisma.dish.findUnique({
      where: { id: dishId },
    })

    if (!dish) {
      return NextResponse.json(
        { success: false, error: 'Dish not found' },
        { status: 404 }
      )
    }

    // Check if user already reviewed this dish
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_dishId: {
          userId: session.user.id,
          dishId,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          error: 'You have already reviewed this dish. Please edit your existing review.',
        },
        { status: 409 }
      )
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        dishId,
        rating,
        title,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: false,
          },
        },
      },
    })

    // Update dish rating
    const reviews = await prisma.review.findMany({
      where: { dishId },
      select: { rating: true },
    })

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    await prisma.dish.update({
      where: { id: dishId },
      data: {
        averageRating: avgRating,
        totalReviews: reviews.length,
      },
    })

    // Update restaurant rating
    const restaurantReviews = await prisma.review.findMany({
      where: {
        dish: {
          restaurantId: dish.restaurantId,
        },
      },
      select: { rating: true },
    })

    const restaurantAvgRating =
      restaurantReviews.reduce((sum, r) => sum + r.rating, 0) /
      restaurantReviews.length

    await prisma.restaurant.update({
      where: { id: dish.restaurantId },
      data: {
        averageRating: restaurantAvgRating,
        totalReviews: restaurantReviews.length,
      },
    })

    return NextResponse.json({
      success: true,
      data: review,
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dishId = searchParams.get('dishId')
    const userId = searchParams.get('userId')

    const where: any = {}
    if (dishId) where.dishId = dishId
    if (userId) where.userId = userId

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: false,
          },
        },
        dish: {
          select: {
            id: true,
            name: true,
            restaurant: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: reviews,
      count: reviews.length,
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
