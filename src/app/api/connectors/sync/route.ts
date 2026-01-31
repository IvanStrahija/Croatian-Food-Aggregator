import { NextResponse } from 'next/server'

export async function POST() {
  try {
    return NextResponse.json({ success: true, message: 'Sync job triggered' })
  } catch (error) {
    console.error('Error triggering sync:', error)
    return NextResponse.json({ success: false, error: 'Failed to trigger sync' }, { status: 500 })
  }
}
