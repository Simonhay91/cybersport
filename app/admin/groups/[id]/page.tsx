export const dynamic = 'force-dynamic'
import connectDB from '@/lib/mongodb'
import Group from '@/models/Group'
import Tournament from '@/models/Tournament'
import Team from '@/models/Team'
import GroupForm from '@/components/admin/GroupForm'
import { notFound } from 'next/navigation'

export default async function EditGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await connectDB()
  const [group, tournaments, teams] = await Promise.all([
    Group.findById(id).lean(),
    Tournament.find().select('name _id').lean(),
    Team.find({ status: 'confirmed' }).select('name tag _id').lean(),
  ])
  if (!group) notFound()

  const g = JSON.parse(JSON.stringify(group))
  g.teams = g.teams?.map((t: { _id?: string } | string) => (typeof t === 'object' && t._id ? t._id : t))

  return (
    <div style={{ padding: '32px', maxWidth: '700px' }}>
      <h1 style={{ fontFamily: 'Rajdhani', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '32px' }}>
        Редактировать группу
      </h1>
      <GroupForm
        initial={g}
        tournaments={JSON.parse(JSON.stringify(tournaments))}
        teams={JSON.parse(JSON.stringify(teams))}
      />
    </div>
  )
}
