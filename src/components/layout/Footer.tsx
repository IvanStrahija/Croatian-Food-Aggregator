export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-6 text-sm text-gray-600">
        © {new Date().getFullYear()} Croatian Food Aggregator. All rights reserved.
      </div>
    </footer>
  )
}
