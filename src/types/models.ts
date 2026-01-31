export interface RestaurantSummary {
  id: string
  name: string
  slug: string
  city: string
  averageRating: number
}

export interface DishSummary {
  id: string
  name: string
  restaurantName: string
  lowestPrice?: number
}
