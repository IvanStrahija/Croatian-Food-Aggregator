import { Rating } from '@/components/ui/Rating'
import { formatRelativeDate } from '@/lib/utils'

export interface ReviewSummary {
  id: string
  rating: number
  title?: string | null
  comment?: string | null
  dishName: string
  restaurantName: string
  createdAt: string
}

interface ReviewCardProps {
  review: ReviewSummary
}

export function ReviewCard({ review }: ReviewCardProps) {
  const createdAt = new Date(review.createdAt)
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{review.dishName}</h3>
          <p className="text-sm text-gray-500">{review.restaurantName}</p>
        </div>
        <Rating value={review.rating} label={formatRelativeDate(createdAt)} />
      </div>
      {review.title && <p className="mt-3 font-medium text-gray-900">{review.title}</p>}
      {review.comment && <p className="mt-2 text-sm text-gray-600">{review.comment}</p>}
    </div>
  )
}
