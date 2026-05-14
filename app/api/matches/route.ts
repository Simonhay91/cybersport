import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Match from '@/models/Match'
import Group from '@/models/Group'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const tournament = searchParams.get('tournament')
    const status = searchParams.get('status')
    const stage = searchParams.get('stage')
    const team = searchParams.get('team')

    const query: Record<string, unknown> = {}
    if (tournament) query.tournament = tournament
    if (status) query.status = status
    if (stage) query.stage = stage
    if (team) query.$or = [{ teamA: team }, { teamB: team }]

    const matches = await Match.find(query)
      .populate('teamA', 'name slug logo tag')
      .populate('teamB', 'name slug logo tag')
      .populate('winner', 'name slug logo')
      .populate('tournament', 'name slug')
      .sort({ scheduledAt: 1 })

    return NextResponse.json(matches)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const match = await Match.create(body)

    // Push match ID into the group's matches array if group is specified
    if (body.group) {
      await Group.findByIdAndUpdate(body.group, { $addToSet: { matches: match._id } })
    }

    return NextResponse.json(match, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Ошибка сервера'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
