import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Team from '@/models/Team'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const query = id.length === 24 ? { _id: id } : { slug: id }
    const team = await Team.findOne(query).populate('captain').populate('players')
    if (!team) return NextResponse.json({ error: 'Не найдена' }, { status: 404 })
    return NextResponse.json(team)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()
    const team = await Team.findByIdAndUpdate(id, body, { new: true }).populate('captain').populate('players')
    return NextResponse.json(team)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    await Team.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
