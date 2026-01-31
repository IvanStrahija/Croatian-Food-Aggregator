import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'List dishes endpoint placeholder' })
}

export async function POST() {
  return NextResponse.json({ message: 'Create dish endpoint placeholder' })
}
