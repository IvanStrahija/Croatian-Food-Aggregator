import { z } from 'zod'

export const restaurantSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(2),
  city: z.string().min(2),
})
