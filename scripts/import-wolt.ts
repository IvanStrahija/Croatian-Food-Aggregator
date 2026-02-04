import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/lib/utils'

type WorkingHourEntry = {
  day?: string
  formatted_times?: string
}

type WoltRestaurant = {
  name?: string
  description?: string
  city?: string
  countryCode?: string
  address?: string
  postCode?: string
  woltUrl?: string
  website?: string
  phone?: string
  workingHours?: WorkingHourEntry[]
  latitude?: number
  longitude?: number
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

function formatWorkingHours(entries: WorkingHourEntry[] | undefined): string | undefined {
  if (!entries || entries.length === 0) return undefined

  const formatted = entries
    .map((entry) => {
      const day = normalizeText(entry.day)
      const times = normalizeText(entry.formatted_times)
      if (!day || !times) return undefined
      return `${day}: ${times}`
    })
    .filter((value): value is string => Boolean(value))

  return formatted.length ? formatted.join(' | ') : undefined
}

function buildCustomId(data: WoltRestaurant): string {
  const basis = [
    normalizeText(data.name),
    normalizeText(data.address),
    normalizeText(data.city),
    normalizeText(data.woltUrl),
  ]
    .filter(Boolean)
    .join('|')

  const hash = createHash('sha256').update(basis).digest('hex').slice(0, 10)
  const slugBase = createSlug(`${normalizeText(data.name) ?? 'restaurant'}-${hash}`)
  return `wolt-${slugBase}`
}

function getExternalId(woltUrl?: string, fallback?: string): string {
  if (woltUrl) {
    try {
      const parsed = new URL(woltUrl)
      const parts = parsed.pathname.split('/').filter(Boolean)
      const slug = parts[parts.length - 1]
      if (slug) return slug
    } catch {
      // ignore invalid URL
    }
  }

  return fallback ?? `wolt-${createHash('sha256').update(String(Date.now())).digest('hex').slice(0, 8)}`
}

export async function importWolt(filePath: string) {
  const absolutePath = path.resolve(process.cwd(), filePath)
  const raw = fs.readFileSync(absolutePath, 'utf8')
  const data = JSON.parse(raw) as WoltRestaurant[]

  for (const entry of data) {
    const name = normalizeText(entry.name)
    const address = normalizeText(entry.address)
    const city = normalizeText(entry.city)

    if (!name || !address || !city) {
      continue
    }

    const osmId = buildCustomId(entry)
    const slug = createSlug(`${name}-${osmId}`)
    const externalId = getExternalId(entry.woltUrl, osmId)
    const workingHours = formatWorkingHours(entry.workingHours)

    const existing = await prisma.restaurant.findUnique({
      where: { osmId },
    })

    if (existing) {
      await prisma.restaurant.update({
        where: { id: existing.id },
        data: {
          name,
          description: normalizeText(entry.description),
          address,
          city,
          postalCode: normalizeText(entry.postCode),
          latitude: typeof entry.latitude === 'number' ? entry.latitude : undefined,
          longitude: typeof entry.longitude === 'number' ? entry.longitude : undefined,
          phoneNumber: normalizeText(entry.phone),
          website: normalizeText(entry.website),
          openingHours: workingHours,
          verified: true,
          status: 'ACTIVE',
        },
      })

      await prisma.restaurantServiceLink.upsert({
        where: {
          restaurantId_service: {
            restaurantId: existing.id,
            service: 'WOLT',
          },
        },
        update: {
          externalId,
          externalUrl: normalizeText(entry.woltUrl),
          isActive: true,
          lastSyncedAt: new Date(),
        },
        create: {
          restaurantId: existing.id,
          service: 'WOLT',
          externalId,
          externalUrl: normalizeText(entry.woltUrl),
          isActive: true,
          lastSyncedAt: new Date(),
        },
      })
      continue
    }

    await prisma.restaurant.create({
      data: {
        osmId,
        name,
        slug,
        description: normalizeText(entry.description),
        address,
        city,
        postalCode: normalizeText(entry.postCode),
        country: entry.countryCode === 'HRV' ? 'Croatia' : 'Croatia',
        latitude: typeof entry.latitude === 'number' ? entry.latitude : undefined,
        longitude: typeof entry.longitude === 'number' ? entry.longitude : undefined,
        phoneNumber: normalizeText(entry.phone),
        website: normalizeText(entry.website),
        openingHours: workingHours,
        verified: true,
        status: 'ACTIVE',
        serviceLinks: {
          create: {
            service: 'WOLT',
            externalId,
            externalUrl: normalizeText(entry.woltUrl),
            lastSyncedAt: new Date(),
          },
        },
      },
    })
  }
}

async function main() {
  const file = getArgValue('--file')

  if (!file) {
    throw new Error('Usage: npm run import:wolt -- --file <path>')
  }

  await importWolt(file)
  await prisma.$disconnect()
}

const isDirectRun = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false

if (isDirectRun) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
