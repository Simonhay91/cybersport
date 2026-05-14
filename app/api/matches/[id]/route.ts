import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Match from '@/models/Match'
import Group from '@/models/Group'
import { processMatchResult } from '@/lib/bracket'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const match = await Match.findById(id)
      .populate('teamA', 'name slug logo tag city')
      .populate('teamB', 'name slug logo tag city')
      .populate('winner', 'name slug logo')
      .populate('loser', 'name slug logo')
      .populate('tournament', 'name slug')
      .populate('group', 'name')
    if (!match) return NextResponse.json({ error: 'Не найден' }, { status: 404 })
    return NextResponse.json(match)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()

    // Fetch old group before update (to handle group change)
    const oldMatch = await Match.findById(id).select('group').lean()
    const oldGroupId = oldMatch?.group?.toString()

    const match = await Match.findByIdAndUpdate(id, body, { new: true })
    if (!match) return NextResponse.json({ error: 'Не найден' }, { status: 404 })

    const newGroupId = body.group || undefined

    // If group changed — remove from old, add to new
    if (oldGroupId && oldGroupId !== newGroupId) {
      await Group.findByIdAndUpdate(oldGroupId, { $pull: { matches: match._id } })
    }
    if (newGroupId && newGroupId !== oldGroupId) {
      await Group.findByIdAndUpdate(newGroupId, { $addToSet: { matches: match._id } })
    }

    // Если матч завершён и победитель выбран — запускаем auto-advance
    if (match.status === 'finished' && match.winner) {
      await processMatchResult(id)
    }

    return NextResponse.json(match)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const match = await Match.findById(id).select('group').lean()
    await Match.findByIdAndDelete(id)
    // Remove match from its group
    if (match?.group) {
      await Group.findByIdAndUpdate(match.group, { $pull: { matches: id } })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
