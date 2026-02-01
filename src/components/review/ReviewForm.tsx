'use client'

import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface ReviewFormProps {
  dishId: string
  dishName: string
  onSubmitted?: (review?: ReviewSubmissionResult) => void
}

interface ReviewSubmissionResult {
  id: string
  rating: number
  title: string | null
  comment: string | null
  createdAt: string
}

export function ReviewForm({ dishId, dishName, onSubmitted }: ReviewFormProps) {
  const [error, setError] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const rating = Number(formData.get('rating'))
    const titleValue = String(formData.get('title') || '').trim()
    const commentValue = String(formData.get('comment') || '').trim()

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dishId,
          rating,
          title: titleValue || undefined,
          comment: commentValue || undefined,
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setError(data?.error ?? 'Failed to submit review.')
        return
      }

      if (data?.success === false) {
        setError(data?.error ?? 'Failed to submit review.')
        return
      }

      event.currentTarget.reset()
      setSuccessMessage('Review submitted.')
      
      if (data?.data) {
        onSubmitted?.({
          id: data.data.id,
          rating: data.data.rating,
          title: data.data.title,
          comment: data.data.comment,
          createdAt: data.data.createdAt,
        })
      } else {
        onSubmitted?.()
      }
    } catch (submitError) {
      console.error('Failed to submit review:', submitError)
      setError('Failed to submit review.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-medium text-gray-700">Dish</label>
        <Input value={dishName} readOnly className="mt-1" />
      </div>
      <div>
        <label htmlFor="rating" className="text-sm font-medium text-gray-700">Rating</label>
        <select
          id="rating"
          name="rating"
          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
          defaultValue="5"
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value} stars
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="title" className="text-sm font-medium text-gray-700">Review title</label>
        <Input id="title" name="title" placeholder="Amazing flavor" className="mt-1" />
      </div>
      <div>
        <label htmlFor="comment" className="text-sm font-medium text-gray-700">Comments</label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
          placeholder="Share your experience..."
        />
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="text-sm text-green-600" role="status">
          {successMessage}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit review'}
      </Button>
    </form>
  )
}
