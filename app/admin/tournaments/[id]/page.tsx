export const dynamic = 'force-dynamic'
import connectDB from '@/lib/mongodb'
import Tournament from '@/models/Tournament'
import TournamentForm from '@/components/admin/TournamentForm'
import { notFound } from 'next/navigation'

export default async function EditTournamentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await connectDB()
  const tournament = await Tournament.findById(id).lean()
  if (!tournament) notFound()

  const t = JSON.parse(JSON.stringify(tournament))

  return (
    <div style={{ padding: '32px', maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'Rajdhani', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '32px' }}>
        Редактировать турнир
      </h1>
      <TournamentForm initial={t} />
    </div>
  )
}
