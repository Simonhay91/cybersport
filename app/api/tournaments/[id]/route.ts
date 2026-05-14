import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Tournament from '@/models/Tournament'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const query = id.length === 24
      ? { _id: id }
      : { slug: id }
    const tournament = await Tournament.findOne(query).populate('teams')
    if (!tournament) return NextResponse.json({ error: 'Не найден' }, { status: 404 })
    return NextResponse.json(tournament)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()
    const tournament = await Tournament.findByIdAndUpdate(id, body, { new: true })
    return NextResponse.json(tournament)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    await Tournament.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
