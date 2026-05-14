import connectDB from '@/lib/mongodb'
import Tournament from '@/models/Tournament'
import '@/models/Team'
import TournamentLayout from '@/components/tournament/TournamentLayout'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function TournamentTeamsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await connectDB()
  const tournament = await Tournament.findOne({ slug })
    .populate('teams', 'name slug logo tag status wins losses')
    .lean()
  if (!tournament) notFound()
  const t = JSON.parse(JSON.stringify(tournament))

  interface TeamDoc { _id: string; name: string; slug: string; logo?: string; tag: string; status: string; wins: number; losses: number }

  return (
    <TournamentLayout tournament={t} activeTab="teams">
      <h2 style={{ fontFamily: 'Rajdhani', fontSize: '24px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '24px' }}>
        Команды ({t.teams?.length || 0})
      </h2>
      {!t.teams?.length ? (
        <p style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-muted)' }}>Команды ещё не добавлены</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
          {(t.teams as TeamDoc[]).map((team) => (
            <Link key={team._id} href={`/teams/${team.slug}`} style={{ textDecoration: 'none' }}>
              <div
                className="hover-yellow-border"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: 'border-color 0.2s' }}
              >
                <div style={{ width: '64px', height: '64px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {team.logo ? <Image src={team.logo} alt={team.name} width={64} height={64} style={{ objectFit: 'contain' }} /> : <span style={{ fontFamily: 'Rajdhani', fontSize: '18px', fontWeight: 700, color: 'var(--text-muted)' }}>{team.tag?.slice(0, 3)}</span>}
                </div>
                <p style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)', textAlign: 'center' }}>{team.name}</p>
                <div style={{ display: 'flex', gap: '12px', fontFamily: 'Inter', fontSize: '12px' }}>
                  <span style={{ color: 'var(--accent-green)' }}>{team.wins}W</span>
                  <span style={{ color: 'var(--accent-red)' }}>{team.losses}L</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </TournamentLayout>
  )
}
