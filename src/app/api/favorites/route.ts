import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Favorites list placeholder' })
}

export async function POST() {
  return NextResponse.json({ message: 'Add favorite placeholder' })
}

export async function DELETE() {
  return NextResponse.json({ message: 'Remove favorite placeholder' })
}
