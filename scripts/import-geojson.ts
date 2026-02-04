import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/lib/utils'

type GeoJsonFeature = {
  type: string
  properties?: Record<string, unknown>
  geometry?: {
    type?: string
    coordinates?: [number, number]
  }
}

type GeoJsonCollection = {
  type: string
  features?: GeoJsonFeature[]
}

function getArgValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag)
  if (index === -1) return undefined
  return process.argv[index + 1]
}

function normalizeText(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined
  const text = typeof value === 'string' ? value : String(value)
  const trimmed = text.trim()
  return trimmed.length ? trimmed : undefined
}

function getCoordinates(feature: GeoJsonFeature): { latitude: number; longitude: number } | null {
  if (feature.geometry?.type !== 'Point') return null
  const coords = feature.geometry.coordinates
  if (!coords || coords.length < 2) return null
  const [longitude, latitude] = coords
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return null
  return { latitude, longitude }
}

export async function importGeojson(filePath: string) {
  const absolutePath = path.resolve(process.cwd(), filePath)
  const raw = fs.readFileSync(absolutePath, 'utf8')
  const data = JSON.parse(raw) as GeoJsonCollection
  const features = data.features ?? []

  for (const feature of features) {
    const props = feature.properties ?? {}
    const osmId = normalizeText(props['@id'])
    const name = normalizeText(props['name'])
    const houseNumber = normalizeText(props['addr:housenumber'])
    const street = normalizeText(props['addr:street'])
    const coordinates = getCoordinates(feature)

    if (!osmId || !name || !houseNumber || !street || !coordinates) {
      continue
    }

    const address = `${street} ${houseNumber}`.trim()
    const city = normalizeText(props['addr:city']) ?? 'Zagreb'
    const postalCode = normalizeText(props['addr:postcode'])
    const website = normalizeText(props['website'])
    const phoneNumber = normalizeText(props['phone'])
    const openingHours = normalizeText(props['opening_hours'])

    await prisma.restaurant.upsert({
      where: { osmId },
      update: {
        name,
        description: normalizeText(props['description']),
        address,
        city,
        postalCode,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        phoneNumber,
        website,
        openingHours,
        verified: true,
        status: 'ACTIVE',
      },
      create: {
        osmId,
        name,
        slug: createSlug(`${name}-${osmId}`),
        description: normalizeText(props['description']),
        address,
        city,
        postalCode,
        country: 'Croatia',
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        phoneNumber,
        website,
        openingHours,
        verified: true,
        status: 'ACTIVE',
      },
    })
  }
}

async function main() {
  const file = getArgValue('--file')

  if (!file) {
    throw new Error('Usage: npm run import:geojson -- --file <path>')
  }

  await importGeojson(file)
  await prisma.$disconnect()
}

const isDirectRun = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false

if (isDirectRun) {
  main().catch(error => {
    console.error(error)
    process.exit(1)
  })
}
