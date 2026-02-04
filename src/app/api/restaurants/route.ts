import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { geocodeAddress } from '@/lib/geocoding'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/lib/utils'
import { z } from 'zod'

const dishSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().min(0),
})

const createRestaurantSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  dishes: z.array(dishSchema).optional(),
})

// GET - List restaurants
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    const where: any = {
      status: 'ACTIVE',
    }

    if (city) {
      where.city = city
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      take: limit,
      orderBy: {
        averageRating: 'desc',
      },
      include: {
        _count: {
          select: {
            dishes: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: restaurants,
      count: restaurants.length,
    })
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restaurants' },
      { status: 500 }
    )
  }
}

// POST - Create restaurant (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validation = createRestaurantSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid data',
          details: validation.error.errors,
        },
        { status: 400 }
      )
    }

    const { dishes, ...restaurantData } = validation.data
    const slug = createSlug(restaurantData.name)

    // Check if restaurant already exists
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { slug },
    })

    if (existingRestaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant with this name already exists' },
        { status: 409 }
      )
    }

    // Create restaurant with dishes
    let latitude = restaurantData.latitude ?? null
    let longitude = restaurantData.longitude ?? null

    if (latitude === null || longitude === null) {
      const locationParts = [
        restaurantData.address,
        restaurantData.postalCode,
        restaurantData.city,
        'Croatia',
      ].filter(Boolean)
      const geocoded = await geocodeAddress(locationParts.join(', '))

      if (geocoded) {
        latitude = geocoded.latitude
        longitude = geocoded.longitude
      }
    }
    const restaurant = await prisma.restaurant.create({
      data: {
        ...restaurantData,
        latitude,
	longitude,
	slug,
        verified: true,
        status: 'ACTIVE',
        dishes: dishes && dishes.length > 0 ? {
          create: dishes.map((dish) => ({
            name: dish.name,
            slug: createSlug(`${dish.name}-${slug}`),
            description: dish.description,
            category: dish.category,
            verified: true,
            prices: {
              create: {
                service: 'MANUAL',
                price: dish.price,
                currency: 'EUR',
              },
            },
          })),
        } : undefined,
      },
      include: {
        dishes: {
          include: {
            prices: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: restaurant,
      message: 'Restaurant created successfully',
    })
  } catch (error) {
    console.error('Error creating restaurant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create restaurant' },
      { status: 500 }
    )
  }
}
