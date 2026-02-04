import { PrismaClient } from '@prisma/client'
import path from 'node:path'
import { importWolt } from '../scripts/import-wolt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  const woltPath = path.join('data', 'wolt.json')
  await importWolt(woltPath)
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
