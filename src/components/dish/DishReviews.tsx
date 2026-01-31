'use client'

import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ReviewForm } from '@/components/review/ReviewForm'
import { ReviewList } from '@/components/review/ReviewList'
import { ReviewSummary } from '@/components/review/ReviewCard'

interface DishReviewsProps {
  dishName: string
  reviews: ReviewSummary[]
}

export function DishReviews({ dishName, reviews }: DishReviewsProps) {
  const [open, setOpen] = React.useState(false)

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
        <ReviewList reviews={reviews} emptyState="No reviews yet. Be the first to share your thoughts." />
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Review ${dishName}`}
        description="Your feedback helps other food lovers discover the best dishes."
      >
        <ReviewForm dishName={dishName} />
      </Modal>
    </section>
  )
}
