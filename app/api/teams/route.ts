import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Team from '@/models/Team'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const tournament = searchParams.get('tournament')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'name'

    const query: Record<string, unknown> = {}
    if (status) query.status = status
    if (tournament) query.tournaments = tournament
    if (search) query.name = { $regex: search, $options: 'i' }

    type SortOption = [string, 1 | -1][]
    const sortMap: Record<string, SortOption> = {
      name: [['name', 1]],
      wins: [['wins', -1]],
      matches: [['wins', -1], ['losses', -1]],
    }

    const teams = await Team.find(query)
      .populate('captain')
      .populate('players')
      .sort(sortMap[sort] || [['name', 1]])

    return NextResponse.json(teams)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const team = await Team.create(body)
    return NextResponse.json(team, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Ошибка сервера'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
