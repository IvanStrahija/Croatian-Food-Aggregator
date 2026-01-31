import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface ReviewFormProps {
  dishName: string
}

export function ReviewForm({ dishName }: ReviewFormProps) {
  return (
    <form className="space-y-4">
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
      <Button type="submit">Submit review</Button>
    </form>
  )
}
