import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/lib/utils'
import { z } from 'zod'

const updateDishSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  price: z.number().optional(),
  isAvailable: z.boolean().optional(),
})

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const dish = await prisma.dish.findUnique({
      where: { id: params.id },
      include: {
        restaurant: true,
        prices: {
          where: { isActive: true },
          orderBy: { updatedAt: 'desc' },
        },
      },
    })

    if (!dish) {
      return NextResponse.json({ success: false, error: 'Dish not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: dish })
  } catch (error) {
    console.error('Error fetching dish:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch dish' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const validation = updateDishSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const data = validation.data

    const existingDish = await prisma.dish.findUnique({
      where: { id: params.id },
      include: { restaurant: true },
    })

    if (!existingDish) {
      return NextResponse.json({ success: false, error: 'Dish not found' }, { status: 404 })
    }

    const updateData: Record<string, any> = { ...data }

    if (data.name) {
      updateData.slug = createSlug(`${data.name}-${existingDish.restaurant.slug}`)
    }

    const dish = await prisma.dish.update({
      where: { id: params.id },
      data: {
        name: updateData.name,
        description: updateData.description,
        category: updateData.category,
        isAvailable: updateData.isAvailable,
        slug: updateData.slug,
        prices: data.price !== undefined ? {
          create: {
            service: 'MANUAL',
            price: data.price,
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
    console.error('Error updating dish:', error)
    return NextResponse.json({ success: false, error: 'Failed to update dish' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
    }

    await prisma.dish.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting dish:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete dish' }, { status: 500 })
  }
}
