export function ReviewForm() {
  return (
    <form className="space-y-4 rounded-lg border border-gray-200 p-4">
      <textarea
        className="w-full rounded-md border border-gray-300 p-2"
        placeholder="Share your thoughts..."
        rows={4}
      />
      <button
        type="submit"
        className="rounded-md bg-orange-500 px-4 py-2 text-white"
      >
        Submit Review
      </button>
    </form>
  )
}
