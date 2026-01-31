import { NextResponse } from 'next/server'
import { getTrendingDishes } from '@/services/trending.service'

export async function GET() {
  try {
    const trending = await getTrendingDishes(10)
    return NextResponse.json({ success: true, data: trending })
  } catch (error) {
    console.error('Error fetching trending dishes:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch trending dishes' }, { status: 500 })
  }
}

