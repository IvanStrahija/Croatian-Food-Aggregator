import { ServiceBadge } from '@/components/restaurant/ServiceBadge'
import { formatPrice } from '@/lib/utils'

interface PriceItem {
  id: string
  service: string
  price: number
  currency: string
  updatedAt: Date
}

interface PriceComparisonProps {
  prices: PriceItem[]
}

export function PriceComparison({ prices }: PriceComparisonProps) {
  if (prices.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-gray-600">
        We are connecting delivery services for this dish. Check back soon for live links.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {prices.map((price) => (
        <div key={price.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <ServiceBadge service={price.service} />
            <div>
              <p className="text-sm font-medium text-gray-900">Latest price</p>
              <p className="text-xs text-gray-500">Updated {price.updatedAt.toLocaleDateString()}</p>
            </div>
          </div>
          <span className="text-base font-semibold text-green-600">
            {formatPrice(price.price, price.currency)}
          </span>
        </div>
      ))}
    </div>
  )
}
