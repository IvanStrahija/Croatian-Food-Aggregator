import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@foodaggregator.hr' },
    update: {},
    create: {
      email: 'admin@foodaggregator.hr',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: userPassword,
      name: 'Test User',
      role: 'USER',
    },
  })
  console.log('✅ Created test user:', user.email)

  // Create restaurants
  const restaurants = [
    {
      name: 'Pizzeria Napoli',
      slug: 'pizzeria-napoli',
      description: 'Authentic Italian pizza made with fresh ingredients',
      address: 'Ilica 123',
      city: 'Zagreb',
      postalCode: '10000',
      country: 'Croatia',
      latitude: 45.8131,
      longitude: 15.9772,
      phoneNumber: '+385 1 234 5678',
      verified: true,
      status: 'ACTIVE' as const,
    },
    {
      name: 'Burger House',
      slug: 'burger-house',
      description: 'Premium burgers with local beef',
      address: 'Trg bana Jelačića 5',
      city: 'Zagreb',
      postalCode: '10000',
      country: 'Croatia',
      latitude: 45.8144,
      longitude: 15.9780,
      phoneNumber: '+385 1 345 6789',
      verified: true,
      status: 'ACTIVE' as const,
    },
    {
      name: 'Sushi Master',
      slug: 'sushi-master',
      description: 'Fresh sushi and Japanese cuisine',
      address: 'Preradovićeva 10',
      city: 'Zagreb',
      postalCode: '10000',
      country: 'Croatia',
      latitude: 45.8111,
      longitude: 15.9750,
      phoneNumber: '+385 1 456 7890',
      verified: true,
      status: 'ACTIVE' as const,
    },
  ]

  const createdRestaurants = []
  for (const restaurant of restaurants) {
    const created = await prisma.restaurant.upsert({
      where: { slug: restaurant.slug },
      update: {},
      create: restaurant,
    })
    createdRestaurants.push(created)
    console.log('✅ Created restaurant:', created.name)
  }

  // Create dishes for each restaurant
  const pizzeriaId = createdRestaurants[0].id
  const burgerId = createdRestaurants[1].id
  const sushiId = createdRestaurants[2].id

  const dishes = [
    // Pizzeria Napoli
    {
      restaurantId: pizzeriaId,
      name: 'Margherita Pizza',
      slug: 'margherita-pizza-' + pizzeriaId,
      description: 'Classic pizza with tomato, mozzarella, and basil',
      category: 'Pizza',
      verified: true,
      prices: [
        { service: 'MANUAL' as const, price: 7.99, currency: 'EUR' },
        { service: 'WOLT' as const, price: 8.49, currency: 'EUR' },
      ],
    },
    {
      restaurantId: pizzeriaId,
      name: 'Quattro Formaggi',
      slug: 'quattro-formaggi-' + pizzeriaId,
      description: 'Four cheese pizza',
      category: 'Pizza',
      verified: true,
      prices: [
        { service: 'MANUAL' as const, price: 9.99, currency: 'EUR' },
        { service: 'GLOVO' as const, price: 10.49, currency: 'EUR' },
      ],
    },
    // Burger House
    {
      restaurantId: burgerId,
      name: 'Classic Beef Burger',
      slug: 'classic-beef-burger-' + burgerId,
      description: 'Juicy beef patty with lettuce, tomato, and special sauce',
      category: 'Burgers',
      verified: true,
      prices: [
        { service: 'MANUAL' as const, price: 6.99, currency: 'EUR' },
        { service: 'WOLT' as const, price: 7.49, currency: 'EUR' },
        { service: 'GLOVO' as const, price: 7.29, currency: 'EUR' },
      ],
    },
    {
      restaurantId: burgerId,
      name: 'Bacon Cheeseburger',
      slug: 'bacon-cheeseburger-' + burgerId,
      description: 'Beef burger with bacon and cheddar cheese',
      category: 'Burgers',
      verified: true,
      prices: [
        { service: 'MANUAL' as const, price: 8.99, currency: 'EUR' },
        { service: 'WOLT' as const, price: 9.49, currency: 'EUR' },
      ],
    },
    // Sushi Master
    {
      restaurantId: sushiId,
      name: 'California Roll',
      slug: 'california-roll-' + sushiId,
      description: 'Crab, avocado, and cucumber roll',
      category: 'Sushi',
      verified: true,
      prices: [
        { service: 'MANUAL' as const, price: 5.99, currency: 'EUR' },
        { service: 'GLOVO' as const, price: 6.49, currency: 'EUR' },
      ],
    },
    {
      restaurantId: sushiId,
      name: 'Salmon Nigiri',
      slug: 'salmon-nigiri-' + sushiId,
      description: 'Fresh salmon on rice (2 pieces)',
      category: 'Sushi',
      verified: true,
      prices: [
        { service: 'MANUAL' as const, price: 4.99, currency: 'EUR' },
        { service: 'WOLT' as const, price: 5.49, currency: 'EUR' },
      ],
    },
  ]

  for (const dish of dishes) {
    const { prices, ...dishData } = dish
    const created = await prisma.dish.upsert({
      where: {
        restaurantId_slug: {
          restaurantId: dish.restaurantId,
          slug: dish.slug,
        },
      },
      update: {},
      create: {
        ...dishData,
        prices: {
          create: prices,
        },
      },
    })
    console.log('✅ Created dish:', created.name)
  }

  // Create some reviews
  const allDishes = await prisma.dish.findMany()
  
  const reviews = [
    {
      userId: user.id,
      dishId: allDishes[0].id,
      rating: 5,
      title: 'Amazing pizza!',
      comment: 'Best Margherita I\'ve had in Zagreb. Highly recommend!',
    },
    {
      userId: user.id,
      dishId: allDishes[2].id,
      rating: 4,
      title: 'Great burger',
      comment: 'Juicy and flavorful, though a bit pricey.',
    },
    {
      userId: admin.id,
      dishId: allDishes[4].id,
      rating: 5,
      title: 'Fresh and delicious',
      comment: 'The sushi is always fresh here. Love the California roll!',
    },
  ]

  for (const review of reviews) {
    await prisma.review.create({
      data: review,
    })
    console.log('✅ Created review')
  }

  // Update restaurant ratings
  for (const restaurant of createdRestaurants) {
    const dishReviews = await prisma.review.findMany({
      where: {
        dish: {
          restaurantId: restaurant.id,
        },
      },
    })

    if (dishReviews.length > 0) {
      const avgRating =
        dishReviews.reduce((sum, r) => sum + r.rating, 0) / dishReviews.length

      await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: {
          averageRating: avgRating,
          totalReviews: dishReviews.length,
        },
      })
    }
  }

  // Update dish ratings
  for (const dish of allDishes) {
    const reviews = await prisma.review.findMany({
      where: { dishId: dish.id },
    })

    if (reviews.length > 0) {
      const avgRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

      await prisma.dish.update({
        where: { id: dish.id },
        data: {
          averageRating: avgRating,
          totalReviews: reviews.length,
        },
      })
    }
  }

  // Create view events for trending
  const now = new Date()
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)

  for (let i = 0; i < 50; i++) {
    await prisma.viewEvent.create({
      data: {
        restaurantId: createdRestaurants[Math.floor(Math.random() * 3)].id,
        viewType: 'RESTAURANT_VIEW',
        createdAt: new Date(
          threeDaysAgo.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000
        ),
      },
    })
  }

  // Create favorites
  await prisma.favorite.create({
    data: {
      userId: user.id,
      restaurantId: createdRestaurants[0].id,
    },
  })

  console.log('🎉 Seed completed successfully!')
  console.log('')
  console.log('📝 Test Credentials:')
  console.log('Admin: admin@foodaggregator.hr / admin123')
  console.log('User: test@example.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
