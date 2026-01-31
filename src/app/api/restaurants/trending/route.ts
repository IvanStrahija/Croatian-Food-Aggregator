import { NextResponse } from 'next/server'
import { getTrendingRestaurants } from '@/services/trending.service'

export async function GET() {
  try {
    const trending = await getTrendingRestaurants(10)
    return NextResponse.json({ success: true, data: trending })
  } catch (error) {
    console.error('Error fetching trending restaurants:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch trending restaurants' }, { status: 500 })
  }
}
