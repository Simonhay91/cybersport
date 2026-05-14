export const dynamic = 'force-dynamic'
import connectDB from '@/lib/mongodb'
import Team from '@/models/Team'
import Tournament from '@/models/Tournament'
import '@/models/Player'
import TeamEditForm from '@/components/admin/TeamEditForm'
import { notFound } from 'next/navigation'

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await connectDB()
  const [team, tournaments] = await Promise.all([
    Team.findById(id).populate('players').populate('captain').lean(),
    Tournament.find().select('name _id').lean(),
  ])
  if (!team) notFound()

  return (
    <div style={{ padding: '32px', maxWidth: '700px' }}>
      <h1 style={{ fontFamily: 'Rajdhani', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '32px' }}>
        Редактировать команду
      </h1>
      <TeamEditForm
        initial={JSON.parse(JSON.stringify(team))}
        tournaments={JSON.parse(JSON.stringify(tournaments))}
      />
    </div>
  )
}
