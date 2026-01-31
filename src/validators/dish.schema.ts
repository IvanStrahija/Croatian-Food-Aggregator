import { z } from 'zod'

export const dishSchema = z.object({
  restaurantId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  imageUrl: z.string().url().optional(),
})
