interface DishCardProps {
  name: string
  restaurant: string
  price: string
}

export function DishCard({ name, restaurant, price }: DishCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{restaurant}</p>
      <p className="mt-2 text-sm font-medium text-green-600">{price}</p>
    </div>
  )
}
