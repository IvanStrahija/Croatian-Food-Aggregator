const sampleTrending = [
  { name: 'Margherita Pizza', score: 88 },
  { name: 'Classic Burger', score: 75 },
]

export function TrendingDishes() {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-2">Trending Dishes</h3>
      <ul className="space-y-2 text-sm">
        {sampleTrending.map(item => (
          <li key={item.name} className="flex justify-between">
            <span>{item.name}</span>
            <span className="font-medium">{item.score} pts</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
