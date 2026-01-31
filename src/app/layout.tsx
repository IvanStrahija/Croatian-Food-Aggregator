import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'

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
          <Header />
          {children}
          <Footer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  )
}
