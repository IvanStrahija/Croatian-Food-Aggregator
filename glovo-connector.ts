import { BaseConnector } from './base-connector'
import type {
  RestaurantData,
  DishData,
  ConnectorMetadata,
  ConnectorConfig,
} from './types'

/**
 * Glovo Connector (Placeholder Implementation)
 * 
 * IMPORTANT: This is a placeholder implementation that returns empty data.
 * 
 * To use this connector legally, you must:
 * 1. Contact Glovo and request API partnership or data feed access
 * 2. Sign data sharing agreement
 * 3. Obtain API credentials
 * 4. Implement fetchRestaurants() and fetchDishes() using official API
 * 
 * DO NOT attempt to scrape Glovo's website or bypass their protections.
 * This violates their Terms of Service and may be illegal.
 * 
 * Configuration:
 * - Set GLOVO_ENABLED=true in .env
 * - Set GLOVO_API_KEY=your-api-key
 * - Set GLOVO_API_URL=https://api.glovoapp.com/v1 (example)
 */
export class GlovoConnector extends BaseConnector {
  readonly name = 'Glovo'
  readonly service = 'GLOVO' as const

  isConfigured(): boolean {
    return (
      this.config.enabled &&
      !!this.config.apiKey &&
      !!this.config.apiUrl
    )
  }

  /**
   * Fetch restaurants from Glovo
   * 
   * PLACEHOLDER: Returns empty array
   */
  async fetchRestaurants(city?: string): Promise<RestaurantData[]> {
    if (!this.isConfigured()) {
      console.warn('Glovo connector not configured')
      return []
    }

    console.log(`[Glovo] Would fetch restaurants${city ? ` for ${city}` : ''}`)
    return []
  }

  /**
   * Fetch dishes for a restaurant from Glovo
   * 
   * PLACEHOLDER: Returns empty array
   */
  async fetchDishes(restaurantExternalId: string): Promise<DishData[]> {
    if (!this.isConfigured()) {
      return []
    }

    console.log(`[Glovo] Would fetch dishes for restaurant ${restaurantExternalId}`)
    return []
  }

  getMetadata(): ConnectorMetadata {
    return {
      sourceName: 'Glovo Croatia',
      sourceUrl: 'https://glovoapp.com/hr/en/',
      lastSyncedAt: new Date(),
      version: '1.0.0-placeholder',
    }
  }
}
