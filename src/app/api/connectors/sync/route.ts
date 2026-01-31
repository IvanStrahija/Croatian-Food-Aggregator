import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ message: 'Trigger connector sync placeholder' })
}
