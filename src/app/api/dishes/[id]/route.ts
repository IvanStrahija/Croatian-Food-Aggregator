import { NextResponse } from 'next/server'

interface RouteContext {
  params: { id: string }
}

export async function GET(_: Request, { params }: RouteContext) {
  return NextResponse.json({ message: `Dish ${params.id} details placeholder` })
}

export async function PUT(_: Request, { params }: RouteContext) {
  return NextResponse.json({ message: `Update dish ${params.id} placeholder` })
}

export async function DELETE(_: Request, { params }: RouteContext) {
  return NextResponse.json({ message: `Delete dish ${params.id} placeholder` })
}
