import { cn } from '@/lib/utils'

interface RestaurantMarkerProps {
  name: string
  className?: string
}

export function RestaurantMarker({ name, className }: RestaurantMarkerProps) {
  return (
    <div className={cn('flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow', className)}>
      <span className="text-sm">📍</span>
      {name}
    </div>
  )
}
