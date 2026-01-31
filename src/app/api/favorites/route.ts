import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const favoriteSchema = z.object({
  restaurantId: z.string().optional(),
  dishId: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        restaurant: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: favorites })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch favorites' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = favoriteSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { restaurantId, dishId } = validation.data

    if (!restaurantId && !dishId) {
      return NextResponse.json({ success: false, error: 'Provide a restaurantId or dishId' }, { status: 400 })
    }

    const existing = await prisma.favorite.findFirst({
      where: {
        userId: session.user.id,
        restaurantId: restaurantId || undefined,
        dishId: dishId || undefined,
      },
    })

    if (existing) {
      return NextResponse.json({ success: true, data: existing })
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        restaurantId: restaurantId || null,
        dishId: dishId || null,
      },
    })

    return NextResponse.json({ success: true, data: favorite })
  } catch (error) {
    console.error('Error creating favorite:', error)
    return NextResponse.json({ success: false, error: 'Failed to create favorite' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = favoriteSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { restaurantId, dishId } = validation.data

    if (!restaurantId && !dishId) {
      return NextResponse.json({ success: false, error: 'Provide a restaurantId or dishId' }, { status: 400 })
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: session.user.id,
        restaurantId: restaurantId || undefined,
        dishId: dishId || undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting favorite:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete favorite' }, { status: 500 })
  }
}
