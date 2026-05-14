export const dynamic = 'force-dynamic'
import connectDB from '@/lib/mongodb'
import Tournament from '@/models/Tournament'
import Team from '@/models/Team'
import GroupForm from '@/components/admin/GroupForm'

async function getData() {
  await connectDB()
  const [tournaments, teams] = await Promise.all([
    Tournament.find().select('name _id').lean(),
    Team.find({ status: 'confirmed' }).select('name tag _id').lean(),
  ])
  return { tournaments: JSON.parse(JSON.stringify(tournaments)), teams: JSON.parse(JSON.stringify(teams)) }
}

export default async function NewGroupPage() {
  const { tournaments, teams } = await getData()
  return (
    <div style={{ padding: '32px', maxWidth: '700px' }}>
      <h1 style={{ fontFamily: 'Rajdhani', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '32px' }}>
        Новая группа
      </h1>
      <GroupForm tournaments={tournaments} teams={teams} />
    </div>
  )
}
