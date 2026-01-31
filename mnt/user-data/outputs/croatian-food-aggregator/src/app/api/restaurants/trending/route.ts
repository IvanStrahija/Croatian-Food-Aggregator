import { NextResponse } from 'next/server'
import { getTrendingRestaurants } from '@/services/trending.service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    const restaurants = await getTrendingRestaurants(limit)

    return NextResponse.json({
      success: true,
      data: restaurants,
      count: restaurants.length,
    })
  } catch (error) {
    console.error('Error fetching trending restaurants:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch trending restaurants',
      },
      { status: 500 }
    )
  }
}
