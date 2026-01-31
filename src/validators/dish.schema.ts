import { z } from 'zod'

export const dishSchema = z.object({
  name: z.string().min(2),
  price: z.number().nonnegative(),
})
