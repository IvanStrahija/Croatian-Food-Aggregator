import { prisma } from '@/lib/prisma'
import { createSlug } from '@/lib/utils'
import type {
  IDataConnector,
  RestaurantData,
  DishData,
  SyncResult,
  ConnectorMetadata,
  ConnectorConfig,
} from './types'

/**
 * Abstract base class for all connectors
 * Provides common functionality for data synchronization
 */
export abstract class BaseConnector implements IDataConnector {
  protected config: ConnectorConfig

  constructor(config: ConnectorConfig) {
    this.config = config
  }

  abstract readonly name: string
  abstract readonly service: 'WOLT' | 'GLOVO' | 'MANUAL'

  abstract isConfigured(): boolean
  abstract fetchRestaurants(city?: string): Promise<RestaurantData[]>
  abstract fetchDishes(restaurantExternalId: string): Promise<DishData[]>

  /**
   * Synchronize data to database
   */
  async sync(dryRun: boolean = false): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      restaurantsAdded: 0,
      restaurantsUpdated: 0,
      dishesAdded: 0,
      dishesUpdated: 0,
      pricesUpdated: 0,
      errors: [],
    }

    if (!this.isConfigured()) {
      result.errors.push(`${this.name} connector is not configured`)
      return result
    }

    try {
      // Fetch restaurants
      const restaurants = await this.fetchRestaurants()
      
      for (const restaurantData of restaurants) {
        try {
          const { restaurant, isNew } = await this.syncRestaurant(restaurantData, dryRun)
          
          if (isNew) {
            result.restaurantsAdded++
          } else {
            result.restaurantsUpdated++
          }

          // Fetch and sync dishes for this restaurant
          const dishes = await this.fetchDishes(restaurantData.externalId)
          
          for (const dishData of dishes) {
            try {
              const { isNew: dishIsNew, priceUpdated } = await this.syncDish(
                restaurant.id,
                dishData,
                dryRun
              )
              
              if (dishIsNew) {
                result.dishesAdded++
              } else {
                result.dishesUpdated++
              }
              
              if (priceUpdated) {
                result.pricesUpdated++
              }
            } catch (error) {
              result.errors.push(`Dish sync error: ${error}`)
            }
          }
        } catch (error) {
          result.errors.push(`Restaurant sync error: ${error}`)
        }
      }

      result.success = result.errors.length === 0
    } catch (error) {
      result.errors.push(`Connector sync error: ${error}`)
    }

    return result
  }

  /**
   * Sync a single restaurant to database
   */
  protected async syncRestaurant(
    data: RestaurantData,
    dryRun: boolean
  ): Promise<{ restaurant: any; isNew: boolean }> {
    // Check if restaurant exists
    const existingLink = await prisma.restaurantServiceLink.findFirst({
      where: {
        service: this.service,
        externalId: data.externalId,
      },
      include: {
        restaurant: true,
      },
    })

    if (existingLink) {
      // Update existing restaurant
      if (!dryRun) {
        const restaurant = await prisma.restaurant.update({
          where: { id: existingLink.restaurantId },
          data: {
            name: data.name,
            description: data.description,
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
            latitude: data.latitude,
            longitude: data.longitude,
            phoneNumber: data.phoneNumber,
            website: data.website,
            imageUrl: data.imageUrl,
            verified: true,
          },
        })

        await prisma.restaurantServiceLink.update({
          where: { id: existingLink.id },
          data: { lastSyncedAt: new Date() },
        })

        return { restaurant, isNew: false }
      }
      return { restaurant: existingLink.restaurant, isNew: false }
    }

    // Create new restaurant
    if (!dryRun) {
      const slug = createSlug(data.name)
      const restaurant = await prisma.restaurant.create({
        data: {
          osmId: `${this.service.toLowerCase()}-${data.externalId}`,
          name: data.name,
          slug,
          description: data.description,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          latitude: data.latitude,
          longitude: data.longitude,
          phoneNumber: data.phoneNumber,
          website: data.website,
          imageUrl: data.imageUrl,
          verified: true,
          status: 'ACTIVE',
          serviceLinks: {
            create: {
              service: this.service,
              externalId: data.externalId,
              lastSyncedAt: new Date(),
            },
          },
        },
      })

      return { restaurant, isNew: true }
    }

    return { restaurant: { id: 'dry-run' }, isNew: true }
  }

  /**
   * Sync a single dish to database
   */
  protected async syncDish(
    restaurantId: string,
    data: DishData,
    dryRun: boolean
  ): Promise<{ isNew: boolean; priceUpdated: boolean }> {
    const slug = createSlug(`${data.name}-${restaurantId}`)

    // Check if dish exists
    const existingDish = await prisma.dish.findFirst({
      where: {
        restaurantId,
        slug,
      },
      include: {
        prices: {
          where: {
            service: this.service,
            isActive: true,
          },
        },
      },
    })

    if (existingDish) {
      // Check if price changed
      const currentPrice = existingDish.prices[0]
      const priceChanged = !currentPrice || currentPrice.price !== data.price

      if (!dryRun) {
        // Update dish
        await prisma.dish.update({
          where: { id: existingDish.id },
          data: {
            name: data.name,
            description: data.description,
            category: data.category,
            imageUrl: data.imageUrl,
          },
        })

        // Update price if changed
        if (priceChanged && currentPrice) {
          await prisma.dishPrice.update({
            where: { id: currentPrice.id },
            data: {
              price: data.price,
              currency: data.currency,
            },
          })
        } else if (priceChanged && !currentPrice) {
          await prisma.dishPrice.create({
            data: {
              dishId: existingDish.id,
              service: this.service,
              price: data.price,
              currency: data.currency,
            },
          })
        }
      }

      return { isNew: false, priceUpdated: priceChanged }
    }

    // Create new dish
    if (!dryRun) {
      await prisma.dish.create({
        data: {
          restaurantId,
          name: data.name,
          slug,
          description: data.description,
          category: data.category,
          imageUrl: data.imageUrl,
          verified: true,
          prices: {
            create: {
              service: this.service,
              price: data.price,
              currency: data.currency,
            },
          },
        },
      })
    }

    return { isNew: true, priceUpdated: true }
  }

  abstract getMetadata(): ConnectorMetadata
}
