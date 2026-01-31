import { GlovoConnector } from './glovo-connector'
import { ManualConnector } from './manual-connector'
import { WoltConnector } from './wolt-connector'
import type { ConnectorConfig, IDataConnector } from './types'

function buildConfig(prefix: string): ConnectorConfig {
  return {
    enabled: process.env[`${prefix}_ENABLED`] === 'true',
    apiKey: process.env[`${prefix}_API_KEY`],
    apiUrl: process.env[`${prefix}_API_URL`],
  }
}

export function getAllConnectors(): IDataConnector[] {
  return [
    new WoltConnector(buildConfig('WOLT')),
    new GlovoConnector(buildConfig('GLOVO')),
    new ManualConnector({ enabled: process.env.MANUAL_ENABLED !== 'false' }),
  ]
}

export function getEnabledConnectors(): IDataConnector[] {
  return getAllConnectors().filter(connector => connector.isConfigured())
}
