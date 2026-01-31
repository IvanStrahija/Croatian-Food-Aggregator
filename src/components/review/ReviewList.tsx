import { ReviewCard, ReviewSummary } from '@/components/review/ReviewCard'

interface ReviewListProps {
  reviews: ReviewSummary[]
  emptyState?: string
}

export function ReviewList({ reviews, emptyState }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
        {emptyState ?? 'No reviews yet.'}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}
