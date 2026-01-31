import { ReviewCard } from './ReviewCard'

const sampleReviews = [
  { author: 'Ana', rating: 4.5, comment: 'Loved the pizza!' },
  { author: 'Ivan', rating: 4.0, comment: 'Great service and atmosphere.' },
]

export function ReviewList() {
  return (
    <div className="space-y-3">
      {sampleReviews.map(review => (
        <ReviewCard key={review.author} {...review} />
      ))}
    </div>
  )
}
