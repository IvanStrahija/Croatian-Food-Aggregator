import { prisma } from '@/lib/prisma'
import { createSlug } from '@/lib/utils'

export async function listRestaurants() {
  return prisma.restaurant.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getRestaurantBySlug(slug: string) {
  return prisma.restaurant.findUnique({
    where: { slug },
  })
}

export async function createRestaurant(data: {
  name: string
  description?: string
  address: string
  city: string
  postalCode?: string
  latitude?: number
  longitude?: number
  phoneNumber?: string
  website?: string
  imageUrl?: string
}) {
  return prisma.restaurant.create({
    data: {
      name: data.name,
      slug: createSlug(data.name),
      description: data.description,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      latitude: data.latitude,
      longitude: data.longitude,
      phoneNumber: data.phoneNumber,
      website: data.website,
      imageUrl: data.imageUrl,
      verified: false,
      status: 'ACTIVE',
    },
  })
}
