import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Application from '@/models/Application'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const query: Record<string, unknown> = {}
    if (status) query.status = status

    const applications = await Application.find(query).sort({ submittedAt: -1 })
    return NextResponse.json(applications)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const application = await Application.create(body)
    return NextResponse.json(application, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Ошибка сервера'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
