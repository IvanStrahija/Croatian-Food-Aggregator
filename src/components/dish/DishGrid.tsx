import { DishCard } from './DishCard'

const sampleDishes = [
  { name: 'Margherita Pizza', restaurant: 'Pizzeria Napoli', price: '€7.99' },
  { name: 'Classic Burger', restaurant: 'Burger House', price: '€6.99' },
]

export function DishGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sampleDishes.map(dish => (
        <DishCard key={dish.name} {...dish} />
      ))}
    </div>
  )
}
