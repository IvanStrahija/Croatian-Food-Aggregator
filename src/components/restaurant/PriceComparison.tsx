const samplePrices = [
  { service: 'Manual', price: '€7.99' },
  { service: 'Wolt', price: '€8.49' },
]

export function PriceComparison() {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-2">Price Comparison</h3>
      <ul className="space-y-2 text-sm">
        {samplePrices.map(price => (
          <li key={price.service} className="flex justify-between">
            <span>{price.service}</span>
            <span className="font-medium">{price.price}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
