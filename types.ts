/**
 * Data Connector Interface
 * 
 * All connectors (Wolt, Glovo, Manual) must implement this interface.
 * This ensures consistent data ingestion across different sources.
 */

export interface RestaurantData {
  externalId: string
  name: string
  description?: string
  address: string
  city: string
  postalCode?: string
  latitude?: number
  longitude?: number
  phoneNumber?: string
  website?: string
  imageUrl?: string
}

export interface DishData {
  externalId: string
  restaurantExternalId: string
  name: string
  description?: string
  category?: string
  imageUrl?: string
  price: number
  currency: string
}

export interface SyncResult {
  success: boolean
  restaurantsAdded: number
  restaurantsUpdated: number
  dishesAdded: number
  dishesUpdated: number
  pricesUpdated: number
  errors: string[]
}

export interface ConnectorMetadata {
  sourceName: string
  sourceUrl?: string
  lastSyncedAt: Date
  version: string
}

/**
 * Base interface for all data connectors
 */
export interface IDataConnector {
  /**
   * Connector name (e.g., 'Wolt', 'Glovo', 'Manual')
   */
  readonly name: string
  
  /**
   * Service enum value
   */
  readonly service: 'WOLT' | 'GLOVO' | 'MANUAL'
  
  /**
   * Check if connector is properly configured
   */
  isConfigured(): boolean
  
  /**
   * Fetch restaurants from the data source
   * @param city Optional city filter
   */
  fetchRestaurants(city?: string): Promise<RestaurantData[]>
  
  /**
   * Fetch dishes for a specific restaurant
   * @param restaurantExternalId External ID from the source
   */
  fetchDishes(restaurantExternalId: string): Promise<DishData[]>
  
  /**
   * Synchronize data to database
   * @param dryRun If true, don't write to database, just return what would change
   */
  sync(dryRun?: boolean): Promise<SyncResult>
  
  /**
   * Get connector metadata
   */
  getMetadata(): ConnectorMetadata
}

/**
 * Configuration for each connector
 */
export interface ConnectorConfig {
  enabled: boolean
  apiKey?: string
  apiUrl?: string
  rateLimitMs?: number
  batchSize?: number
}

/**
 * Connector factory type
 */
export type ConnectorFactory = (config: ConnectorConfig) => IDataConnector
