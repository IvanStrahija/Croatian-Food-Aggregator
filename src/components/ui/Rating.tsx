import { cn } from '@/lib/utils'

interface RatingProps {
  value: number
  outOf?: number
  className?: string
  label?: string
}

export function Rating({ value, outOf = 5, className, label }: RatingProps) {
  const rounded = Math.round(value * 10) / 10
  const fullStars = Math.floor(rounded)
  const hasHalf = rounded - fullStars >= 0.5

  return (
    <div className={cn('flex items-center gap-2 text-sm text-gray-600', className)}>
      <div className="flex items-center">
        {Array.from({ length: outOf }).map((_, index) => {
          const filled = index < fullStars
          const half = index === fullStars && hasHalf
          return (
            <span key={index} className={cn('text-base', filled || half ? 'text-orange-500' : 'text-gray-300')}>
              {half ? '★' : filled ? '★' : '☆'}
            </span>
          )
        })}
      </div>
      <span className="font-medium text-gray-700">{rounded.toFixed(1)}</span>
      {label && <span className="text-xs text-gray-500">{label}</span>}
    </div>
  )
}
