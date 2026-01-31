import { GlovoConnector } from './glovo-connector'
import { ManualConnector } from './manual-connector'
import { WoltConnector } from './wolt-connector'
import type { ConnectorConfig, IDataConnector } from './types'

export function getConnectors(configs: Record<string, ConnectorConfig>): IDataConnector[] {
  return [
    new WoltConnector(configs.WOLT ?? { enabled: false }),
    new GlovoConnector(configs.GLOVO ?? { enabled: false }),
    new ManualConnector(configs.MANUAL ?? { enabled: true }),
  ]
}
