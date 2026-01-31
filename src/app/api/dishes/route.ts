import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/lib/utils'
import { z } from 'zod'

const createDishSchema = z.object({
  restaurantId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get('restaurantId') || undefined
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    const dishes = await prisma.dish.findMany({
      where: restaurantId ? { restaurantId } : undefined,
      take: limit,
      orderBy: { averageRating: 'desc' },
      include: {
        restaurant: true,
        prices: {
          where: { isActive: true },
          orderBy: { updatedAt: 'desc' },
        },
      },
    })

    return NextResponse.json({ success: true, data: dishes, count: dishes.length })
  } catch (error) {
    console.error('Error fetching dishes:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch dishes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const validation = createDishSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { restaurantId, name, description, category, price } = validation.data

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { slug: true },
    })

    if (!restaurant) {
      return NextResponse.json({ success: false, error: 'Restaurant not found' }, { status: 404 })
    }

    const dish = await prisma.dish.create({
      data: {
        restaurantId,
        name,
        slug: createSlug(`${name}-${restaurant.slug}`),
        description,
        category,
        verified: true,
        prices: price !== undefined ? {
          create: {
            service: 'MANUAL',
            price,
            currency: 'EUR',
          },
        } : undefined,
      },
      include: {
        prices: true,
      },
    })

    return NextResponse.json({ success: true, data: dish })
  } catch (error) {
    console.error('Error creating dish:', error)
    return NextResponse.json({ success: false, error: 'Failed to create dish' }, { status: 500 })
  }
}
