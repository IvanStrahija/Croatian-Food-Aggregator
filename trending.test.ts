/**
 * @jest-environment node
 */
import { getTrendingRestaurants, getTrendingDishes } from '@/services/trending.service'

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    restaurant: {
      findMany: jest.fn(),
    },
    dish: {
      findMany: jest.fn(),
    },
    viewEvent: {
      findMany: jest.fn(),
    },
  },
}))

describe('Trending Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getTrendingRestaurants', () => {
    it('should calculate trending scores correctly', async () => {
      const mockRestaurants = [
        {
          id: '1',
          name: 'Restaurant A',
          slug: 'restaurant-a',
          imageUrl: null,
          averageRating: 4.5,
          totalReviews: 10,
          city: 'Zagreb',
          createdAt: new Date('2024-01-01'),
          _count: {
            viewEvents: 50,
            favorites: 10,
          },
          dishes: [
            {
              _count: {
                reviews: 5,
              },
            },
          ],
        },
        {
          id: '2',
          name: 'Restaurant B',
          slug: 'restaurant-b',
          imageUrl: null,
          averageRating: 3.5,
          totalReviews: 5,
          city: 'Zagreb',
          createdAt: new Date('2024-01-15'),
          _count: {
            viewEvents: 20,
            favorites: 5,
          },
          dishes: [
            {
              _count: {
                reviews: 2,
              },
            },
          ],
        },
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.restaurant.findMany.mockResolvedValue(mockRestaurants)

      const result = await getTrendingRestaurants(10)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('1') // Higher score should be first
      expect(result[0]).toHaveProperty('trendingScore')
      expect(result[0].trendingScore).toBeGreaterThan(0)
    })

    it('should respect the limit parameter', async () => {
      const mockRestaurants = Array.from({ length: 20 }, (_, i) => ({
        id: `${i}`,
        name: `Restaurant ${i}`,
        slug: `restaurant-${i}`,
        imageUrl: null,
        averageRating: 4.0,
        totalReviews: 5,
        city: 'Zagreb',
        createdAt: new Date(),
        _count: {
          viewEvents: 10,
          favorites: 2,
        },
        dishes: [],
      }))

      const { prisma } = require('@/lib/prisma')
      prisma.restaurant.findMany.mockResolvedValue(mockRestaurants)

      const result = await getTrendingRestaurants(5)

      expect(result.length).toBeLessThanOrEqual(5)
    })

    it('should filter out restaurants with zero trending score', async () => {
      const mockRestaurants = [
        {
          id: '1',
          name: 'Active Restaurant',
          slug: 'active-restaurant',
          imageUrl: null,
          averageRating: 4.0,
          totalReviews: 5,
          city: 'Zagreb',
          createdAt: new Date(),
          _count: {
            viewEvents: 10,
            favorites: 2,
          },
          dishes: [{ _count: { reviews: 3 } }],
        },
        {
          id: '2',
          name: 'Inactive Restaurant',
          slug: 'inactive-restaurant',
          imageUrl: null,
          averageRating: 0,
          totalReviews: 0,
          city: 'Zagreb',
          createdAt: new Date(),
          _count: {
            viewEvents: 0,
            favorites: 0,
          },
          dishes: [],
        },
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.restaurant.findMany.mockResolvedValue(mockRestaurants)

      const result = await getTrendingRestaurants(10)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })
  })

  describe('getTrendingDishes', () => {
    it('should return trending dishes with price information', async () => {
      const mockDishes = [
        {
          id: '1',
          name: 'Pizza Margherita',
          slug: 'pizza-margherita',
          imageUrl: null,
          averageRating: 4.5,
          totalReviews: 20,
          createdAt: new Date('2024-01-01'),
          restaurant: {
            name: 'Pizzeria',
            slug: 'pizzeria',
          },
          _count: {
            reviews: 10,
          },
          prices: [
            {
              price: 9.99,
            },
          ],
        },
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.dish.findMany.mockResolvedValue(mockDishes)
      prisma.viewEvent.findMany.mockResolvedValue([
        { dishId: '1' },
        { dishId: '1' },
      ])

      const result = await getTrendingDishes(10)

      expect(result).toHaveLength(1)
      expect(result[0]).toHaveProperty('lowestPrice')
      expect(result[0].lowestPrice).toBe(9.99)
      expect(result[0]).toHaveProperty('restaurantName')
    })
  })
})
