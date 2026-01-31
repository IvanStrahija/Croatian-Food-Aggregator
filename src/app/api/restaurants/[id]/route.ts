import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/lib/utils'
import { z } from 'zod'

const updateRestaurantSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  postalCode: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  website: z.string().url().optional().or(z.literal('')),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  status: z.enum(['ACTIVE', 'PENDING_VERIFICATION', 'INACTIVE', 'CLOSED']).optional(),
  verified: z.boolean().optional(),
})

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id },
      include: {
        dishes: {
          include: {
            prices: {
              where: { isActive: true },
              orderBy: { updatedAt: 'desc' },
            },
          },
        },
      },
    })

    if (!restaurant) {
      return NextResponse.json({ success: false, error: 'Restaurant not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: restaurant })
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch restaurant' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const validation = updateRestaurantSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const data = validation.data
    const updateData: typeof data & { slug?: string } = { ...data }

    if (data.name) {
      updateData.slug = createSlug(data.name)
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: updatedRestaurant })
  } catch (error) {
    console.error('Error updating restaurant:', error)
    return NextResponse.json({ success: false, error: 'Failed to update restaurant' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
    }

    await prisma.restaurant.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting restaurant:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete restaurant' }, { status: 500 })
  }
}
