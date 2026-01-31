interface RatingProps {
  value: number
  max?: number
}

export function Rating({ value, max = 5 }: RatingProps) {
  const filled = Math.round(value)
  return (
    <div className="flex items-center gap-1 text-orange-500">
      {Array.from({ length: max }).map((_, index) => (
        <span key={index}>{index < filled ? '★' : '☆'}</span>
      ))}
    </div>
  )
}
