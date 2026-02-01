import { z } from 'zod'

export const reviewSchema = z.object({
  dishId: z.string().min(1).optional(),
  restaurantId: z.string().min(1).optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
}).refine(
  (data) => (data.dishId && !data.restaurantId) || (!data.dishId && data.restaurantId),
  { message: 'Provide either a dishId or restaurantId.' }
)
