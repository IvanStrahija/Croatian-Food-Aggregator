import { prisma } from '@/lib/prisma'

export async function listDishes() {
  return prisma.dish.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getDishById(id: string) {
  return prisma.dish.findUnique({
    where: { id },
  })
}
