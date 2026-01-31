import { z } from 'zod'

export const reviewSchema = z.object({
  dishId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})
