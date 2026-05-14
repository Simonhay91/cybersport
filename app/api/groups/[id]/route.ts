import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Group from '@/models/Group'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const group = await Group.findById(id)
      .populate('teams', 'name slug logo tag wins losses')
      .populate({ path: 'matches', populate: [{ path: 'teamA', select: 'name slug logo' }, { path: 'teamB', select: 'name slug logo' }] })
    if (!group) return NextResponse.json({ error: 'Не найдена' }, { status: 404 })
    return NextResponse.json(group)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()
    const group = await Group.findByIdAndUpdate(id, body, { new: true })
    return NextResponse.json(group)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    await Group.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
