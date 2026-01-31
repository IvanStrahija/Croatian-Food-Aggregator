import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'papaparse'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/lib/utils'

interface CsvRestaurantRow {
  name: string
  address: string
  city: string
  latitude?: string
  longitude?: string
  postalCode?: string
  description?: string
  phoneNumber?: string
  website?: string
  imageUrl?: string
}

function getArgValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag)
  if (index === -1) return undefined
  return process.argv[index + 1]
}

async function importRestaurants(filePath: string) {
  const absolutePath = path.resolve(process.cwd(), filePath)
  const csvContent = fs.readFileSync(absolutePath, 'utf8')
  const { data, errors } = parse<CsvRestaurantRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
  })

  if (errors.length) {
    throw new Error(`CSV parse error: ${errors[0]?.message}`)
  }

  for (const row of data) {
    if (!row.name || !row.address || !row.city) {
      continue
    }

    await prisma.restaurant.create({
      data: {
        name: row.name,
        slug: createSlug(row.name),
        description: row.description,
        address: row.address,
        city: row.city,
        postalCode: row.postalCode,
        latitude: row.latitude ? parseFloat(row.latitude) : undefined,
        longitude: row.longitude ? parseFloat(row.longitude) : undefined,
        phoneNumber: row.phoneNumber,
        website: row.website,
        imageUrl: row.imageUrl,
        verified: true,
        status: 'ACTIVE',
      },
    })
  }
}

async function main() {
  const file = getArgValue('--file')
  const type = getArgValue('--type')

  if (!file || !type) {
    throw new Error('Usage: npm run import:csv -- --file <path> --type restaurants')
  }

  if (type !== 'restaurants') {
    throw new Error(`Unsupported import type: ${type}`)
  }

  await importRestaurants(file)
  await prisma.$disconnect()
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
