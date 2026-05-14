import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Tournament from '@/models/Tournament'

export async function GET() {
  try {
    await connectDB()
    const tournaments = await Tournament.find().populate('teams').sort({ createdAt: -1 })
    return NextResponse.json(tournaments)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const tournament = await Tournament.create(body)
    return NextResponse.json(tournament, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Ошибка сервера'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
