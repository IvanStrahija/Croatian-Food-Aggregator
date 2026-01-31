import { NextResponse } from 'next/server'

interface RouteContext {
  params: { id: string }
}

export async function PUT(_: Request, { params }: RouteContext) {
  return NextResponse.json({ message: `Update review ${params.id} placeholder` })
}

export async function DELETE(_: Request, { params }: RouteContext) {
  return NextResponse.json({ message: `Delete review ${params.id} placeholder` })
}
