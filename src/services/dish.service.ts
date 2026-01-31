import { prisma } from '@/lib/prisma'
import { createSlug } from '@/lib/utils'

export async function getDishById(id: string) {
  return prisma.dish.findUnique({
    where: { id },
    include: { restaurant: true, prices: true },
  })
}

export async function createDish(data: {
  restaurantId: string
  name: string
  description?: string
  category?: string
  imageUrl?: string
}) {
  return prisma.dish.create({
    data: {
      restaurantId: data.restaurantId,
      name: data.name,
      slug: createSlug(`${data.name}-${data.restaurantId}`),
      description: data.description,
      category: data.category,
      imageUrl: data.imageUrl,
      isAvailable: true,
      verified: false,
    },
  })
}
