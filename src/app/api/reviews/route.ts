import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createReviewSchema = z.object({
  dishId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = createReviewSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { dishId, rating, title, comment } = validation.data
    
    const dish = await prisma.dish.findUnique({
      where: { id: dishId },
      select: { id: true },
    })

    if (!dish) {
      return NextResponse.json({ success: false, error: 'Dish not found' }, { status: 404 })
    }
    const review = await prisma.review.create({
      data: {
        dishId,
        rating,
        title,
        comment,
        userId: session.user.id,
      },
    })

    try {
      await updateDishRating(dishId)
    } catch (ratingError) {
      console.error('Failed to update dish rating:', ratingError)
    }

    return NextResponse.json({ success: true, data: review })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { success: false, error: 'You have already reviewed this dish.' },
          { status: 409 }
        )
      }

      if (error.code === 'P2003') {
        return NextResponse.json(
          { success: false, error: 'Dish not found' },
          { status: 404 }
        )
      }

      if (error.code === 'P2025') {
        return NextResponse.json(
          { success: false, error: 'Review not found' },
          { status: 404 }
        )
      }
    }
    console.error('Error creating review:', error)
    return NextResponse.json({ success: false, error: 'Failed to create review' }, { status: 500 })
  }
}
