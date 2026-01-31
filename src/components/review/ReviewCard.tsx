interface ReviewCardProps {
  author: string
  rating: number
  comment: string
}

export function ReviewCard({ author, rating, comment }: ReviewCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{author}</h4>
        <span className="text-sm text-orange-500">⭐ {rating.toFixed(1)}</span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{comment}</p>
    </div>
  )
}
