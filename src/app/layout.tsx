import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'

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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
