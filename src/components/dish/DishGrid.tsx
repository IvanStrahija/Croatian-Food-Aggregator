import { DishCard, DishSummary } from '@/components/dish/DishCard'

interface DishGridProps {
  dishes: DishSummary[]
  variant?: 'featured' | 'compact'
  emptyState?: string
}

export function DishGrid({ dishes, variant = 'compact', emptyState }: DishGridProps) {
  if (dishes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
        {emptyState ?? 'No dishes found.'}
      </div>
    )
  }

  const gridClass =
    variant === 'featured'
      ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'
      : 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={gridClass}>
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} variant={variant} />
      ))}
    </div>
  )
}
