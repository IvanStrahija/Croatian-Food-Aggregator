'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ReviewForm } from '@/components/review/ReviewForm'
import { ReviewList } from '@/components/review/ReviewList'
import { ReviewSummary } from '@/components/review/ReviewCard'

interface DishReviewsProps {
  dishId: string
  dishName: string
  restaurantName: string
  reviews: ReviewSummary[]
}

export function DishReviews({ dishId, dishName, restaurantName, reviews }: DishReviewsProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState(reviews)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    setItems(reviews)
  }, [reviews])
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          <p className="text-sm text-gray-500">Share your experience with {dishName}.</p>
        </div>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Write a review
        </Button>
      </div>

      <div className="mt-6">
        {successMessage && (
          <p className="mb-4 text-sm font-medium text-green-600" role="status">
            {successMessage}
          </p>
        )}
        <ReviewList reviews={items} emptyState="No reviews yet. Be the first to share your thoughts." />
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Review ${dishName}`}
        description="Your feedback helps other food lovers discover the best dishes."
      >
        <ReviewForm
          subjectId={dishId}
          subjectName={dishName}
          subjectType="dish"
          onSubmitted={(review) => {
            if (review) {
              setItems((current) => {
                if (current.some((item) => item.id === review.id)) {
                  return current
                }

                return [
                  {
                    id: review.id,
                    rating: review.rating,
                    title: review.title,
                    comment: review.comment,
                    subjectName: dishName,
                    subtitle: restaurantName,
                    username: review.username,
                    createdAt: review.createdAt,
                  },
                  ...current,
                ]
              })
            }
            setSuccessMessage('Review submitted.')
            setOpen(false)
            router.refresh()
          }}
        />
      </Modal>
    </section>
  )
}
