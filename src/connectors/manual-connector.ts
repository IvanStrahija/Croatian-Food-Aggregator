import { BaseConnector } from './base-connector'
import type { RestaurantData, DishData, ConnectorMetadata } from './types'

export class ManualConnector extends BaseConnector {
  readonly name = 'Manual'
  readonly service = 'MANUAL' as const

  isConfigured(): boolean {
    return this.config.enabled
  }

  async fetchRestaurants(): Promise<RestaurantData[]> {
    return []
  }

  async fetchDishes(): Promise<DishData[]> {
    return []
  }

  getMetadata(): ConnectorMetadata {
    return {
      sourceName: 'Manual Entry',
      sourceUrl: undefined,
      lastSyncedAt: new Date(),
      version: '1.0.0',
    }
  }
}
