import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Croatian Food Aggregator',
  description: 'Compare food prices across Wolt, Glovo, and local restaurants in Croatia',
  keywords: ['food', 'restaurants', 'Croatia', 'Wolt', 'Glovo', 'Zagreb', 'delivery'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  )
}
