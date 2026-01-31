import { BaseConnector } from './base-connector'
import type {
  RestaurantData,
  DishData,
  ConnectorMetadata,
  ConnectorConfig,
} from './types'

/**
 * Wolt Connector (Placeholder Implementation)
 * 
 * IMPORTANT: This is a placeholder implementation that returns empty data.
 * 
 * To use this connector legally, you must:
 * 1. Contact Wolt and request API partnership or data feed access
 * 2. Sign data sharing agreement
 * 3. Obtain API credentials
 * 4. Implement fetchRestaurants() and fetchDishes() using official API
 * 
 * DO NOT attempt to scrape Wolt's website or bypass their protections.
 * This violates their Terms of Service and may be illegal.
 * 
 * Configuration:
 * - Set WOLT_ENABLED=true in .env
 * - Set WOLT_API_KEY=your-api-key
 * - Set WOLT_API_URL=https://api.wolt.com/v1 (example)
 */
export class WoltConnector extends BaseConnector {
  readonly name = 'Wolt'
  readonly service = 'WOLT' as const

  isConfigured(): boolean {
    return (
      this.config.enabled &&
      !!this.config.apiKey &&
      !!this.config.apiUrl
    )
  }

  /**
   * Fetch restaurants from Wolt
   * 
   * PLACEHOLDER: Returns empty array
   * 
   * Implementation guide:
   * 1. Make authenticated API call to Wolt's restaurant endpoint
   * 2. Filter by city if provided
   * 3. Transform response to RestaurantData format
   * 4. Handle pagination if needed
   * 5. Respect rate limits
   */
  async fetchRestaurants(city?: string): Promise<RestaurantData[]> {
    if (!this.isConfigured()) {
      console.warn('Wolt connector not configured')
      return []
    }

    // PLACEHOLDER IMPLEMENTATION
    console.log(`[Wolt] Would fetch restaurants${city ? ` for ${city}` : ''}`)
    
    // Example of what the implementation might look like:
    /*
    try {
      const response = await fetch(`${this.config.apiUrl}/restaurants`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Wolt API error: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      return data.restaurants.map(r => ({
        externalId: r.id,
        name: r.name,
        description: r.description,
        address: r.address.street,
        city: r.address.city,
        postalCode: r.address.postal_code,
        latitude: r.location.lat,
        longitude: r.location.lon,
        phoneNumber: r.phone,
        website: r.website,
        imageUrl: r.image_url,
      }))
    } catch (error) {
      console.error('[Wolt] Error fetching restaurants:', error)
      throw error
    }
    */

    return []
  }

  /**
   * Fetch dishes for a restaurant from Wolt
   * 
   * PLACEHOLDER: Returns empty array
   * 
   * Implementation guide:
   * 1. Make authenticated API call to Wolt's menu endpoint
   * 2. Use restaurantExternalId to identify restaurant
   * 3. Transform menu items to DishData format
   * 4. Extract prices and categories
   * 5. Handle menu variations if needed
   */
  async fetchDishes(restaurantExternalId: string): Promise<DishData[]> {
    if (!this.isConfigured()) {
      return []
    }

    // PLACEHOLDER IMPLEMENTATION
    console.log(`[Wolt] Would fetch dishes for restaurant ${restaurantExternalId}`)
    
    // Example implementation:
    /*
    try {
      const response = await fetch(
        `${this.config.apiUrl}/restaurants/${restaurantExternalId}/menu`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )
      
      if (!response.ok) {
        throw new Error(`Wolt API error: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      const dishes: DishData[] = []
      
      for (const category of data.categories) {
        for (const item of category.items) {
          dishes.push({
            externalId: item.id,
            restaurantExternalId,
            name: item.name,
            description: item.description,
            category: category.name,
            imageUrl: item.image_url,
            price: item.price / 100, // Convert cents to EUR
            currency: 'EUR',
          })
        }
      }
      
      return dishes
    } catch (error) {
      console.error('[Wolt] Error fetching dishes:', error)
      throw error
    }
    */

    return []
  }

  getMetadata(): ConnectorMetadata {
    return {
      sourceName: 'Wolt Croatia',
      sourceUrl: 'https://wolt.com/hr',
      lastSyncedAt: new Date(),
      version: '1.0.0-placeholder',
    }
  }
}
