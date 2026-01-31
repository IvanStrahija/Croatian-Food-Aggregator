import { getEnabledConnectors } from '@/connectors/connector-manager'

async function main() {
  const connectors = getEnabledConnectors()

  if (!connectors.length) {
    console.log('No connectors configured.')
    return
  }

  for (const connector of connectors) {
    console.log(`Syncing ${connector.name}...`)
    const result = await connector.sync()
    if (!result.success) {
      console.error(`${connector.name} sync failed`, result.errors)
    } else {
      console.log(`${connector.name} sync completed`, result)
    }
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
