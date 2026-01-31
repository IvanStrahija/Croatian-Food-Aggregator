import { z } from 'zod'

export const restaurantSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phoneNumber: z.string().optional(),
  website: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
})
