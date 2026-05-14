import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Application from '@/models/Application'
import Team from '@/models/Team'
import Player from '@/models/Player'
import { slugify } from '@/lib/utils'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const application = await Application.findById(id)
    if (!application) return NextResponse.json({ error: 'Не найдена' }, { status: 404 })
    return NextResponse.json(application)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()

    const application = await Application.findByIdAndUpdate(id, body, { new: true })
    if (!application) return NextResponse.json({ error: 'Не найдена' }, { status: 404 })

    // Если заявка подтверждена — создаём команду и игроков
    if (body.status === 'confirmed' && !application.convertedTeam) {
      const slug = slugify(application.teamName) + '-' + Date.now()

      // Создаём игроков
      const playerDocs = await Promise.all(
        application.players.map((p: { nickname: string; fullName?: string; age?: number; steam?: string; faceit?: string; telegram?: string; discord?: string }) =>
          Player.create({
            nickname: p.nickname,
            fullName: p.fullName,
            age: p.age,
            steam: p.steam,
            faceit: p.faceit,
            telegram: p.telegram,
            discord: p.discord,
            status: 'main',
          })
        )
      )

      // Создаём капитана
      const captainDoc = await Player.create({
        nickname: application.captain.nickname,
        fullName: application.captain.fullName,
        age: application.captain.age,
        steam: application.captain.steam,
        faceit: application.captain.faceit,
        telegram: application.captain.telegram,
        discord: application.captain.discord,
        status: 'main',
      })

      // Создаём запасного
      let reserveDoc = null
      if (application.reserve?.nickname) {
        reserveDoc = await Player.create({
          ...application.reserve,
          status: 'reserve',
        })
      }

      const allPlayers = [captainDoc._id, ...playerDocs.map(p => p._id)]
      if (reserveDoc) allPlayers.push(reserveDoc._id)

      // Создаём команду
      const team = await Team.create({
        name: application.teamName,
        slug,
        tag: application.tag,
        logo: application.logo,
        city: application.city,
        socialLinks: application.socialLinks,
        captain: captainDoc._id,
        players: allPlayers,
        status: 'confirmed',
      })

      // Привязываем игроков к команде
      await Player.updateMany(
        { _id: { $in: allPlayers } },
        { team: team._id }
      )

      await Application.findByIdAndUpdate(id, { convertedTeam: team._id })
    }

    return NextResponse.json(application)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Ошибка сервера'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    await Application.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
