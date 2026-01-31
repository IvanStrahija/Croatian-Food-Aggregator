import { BaseConnector } from './base-connector'
import type { ConnectorConfig, DishData, RestaurantData } from './types'

export class ManualConnector extends BaseConnector {
  readonly name = 'Manual'
  readonly service = 'MANUAL' as const

  constructor(config: ConnectorConfig) {
    super(config)
  }

  isConfigured(): boolean {
    return true
  }

  async fetchRestaurants(): Promise<RestaurantData[]> {
    return []
  }

  async fetchDishes(): Promise<DishData[]> {
    return []
  }
}
