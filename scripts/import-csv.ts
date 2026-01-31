import fs from 'fs'
import path from 'path'

const args = process.argv.slice(2)
const fileArgIndex = args.findIndex(arg => arg === '--file')
const typeArgIndex = args.findIndex(arg => arg === '--type')

const filePath = fileArgIndex >= 0 ? args[fileArgIndex + 1] : undefined
const type = typeArgIndex >= 0 ? args[typeArgIndex + 1] : undefined

if (!filePath || !type) {
  console.log('Usage: npm run import:csv -- --file <path> --type <restaurants|dishes>')
  process.exit(1)
}

const absolutePath = path.resolve(process.cwd(), filePath)
if (!fs.existsSync(absolutePath)) {
  console.error(`File not found: ${absolutePath}`)
  process.exit(1)
}

console.log(`✅ CSV import placeholder: ${type} from ${absolutePath}`)
