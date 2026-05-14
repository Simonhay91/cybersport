import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Partner from '@/models/Partner'

export async function GET() {
  try {
    await connectDB()
    const partners = await Partner.find({ active: true }).sort({ order: 1 })
    return NextResponse.json(partners)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const partner = await Partner.create(body)
    return NextResponse.json(partner, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Ошибка сервера'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
