interface RestaurantPageProps {
  params: { slug: string }
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Restaurant: {params.slug}</h1>
      <p className="text-gray-600">
        Details for this restaurant will appear here once data is connected.
      </p>
    </main>
  )
}
