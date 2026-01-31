interface DishPageProps {
  params: { id: string }
}

export default function DishPage({ params }: DishPageProps) {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Dish ID: {params.id}</h1>
      <p className="text-gray-600">
        Dish details and price comparisons will be shown here.
      </p>
    </main>
  )
}
