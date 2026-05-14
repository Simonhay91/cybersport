import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Group from '@/models/Group'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const tournament = searchParams.get('tournament')
    const query: Record<string, unknown> = {}
    if (tournament) query.tournament = tournament

    const groups = await Group.find(query)
      .populate('teams', 'name slug logo tag')
      .populate('matches')
      .populate('first', 'name slug logo')
      .populate('second', 'name slug logo')

    return NextResponse.json(groups)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const group = await Group.create(body)
    return NextResponse.json(group, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Ошибка сервера'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
