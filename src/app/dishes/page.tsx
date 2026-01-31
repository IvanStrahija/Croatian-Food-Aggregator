import Link from 'next/link'

const sampleDishes = [
  { id: '1', name: 'Margherita Pizza', restaurant: 'Pizzeria Napoli' },
  { id: '2', name: 'Classic Burger', restaurant: 'Burger House' },
]

export default function DishesPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Dishes</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {sampleDishes.map(dish => (
          <Link
            key={dish.id}
            href={`/dishes/${dish.id}`}
            className="rounded-lg border border-gray-200 p-4 hover:border-orange-500"
          >
            <h2 className="text-xl font-semibold">{dish.name}</h2>
            <p className="text-sm text-gray-600">{dish.restaurant}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
