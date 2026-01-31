import { NextResponse } from 'next/server'

export async function POST() {
  try {
    return NextResponse.json({ success: true, message: 'Import queued' })
  } catch (error) {
    console.error('Error triggering import:', error)
    return NextResponse.json({ success: false, error: 'Failed to queue import' }, { status: 500 })
  }
}
