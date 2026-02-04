import { PrismaClient } from '@prisma/client'
import path from 'node:path'
import { importGeojson } from '../scripts/import-geojson'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  const geojsonPath = path.join('data', 'Zagreb.geojson')
  await importGeojson(geojsonPath)
  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
