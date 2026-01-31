import { prisma } from '@/lib/prisma'

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
