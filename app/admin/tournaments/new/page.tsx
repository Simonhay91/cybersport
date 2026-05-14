import TournamentForm from '@/components/admin/TournamentForm'

export default function NewTournamentPage() {
  return (
    <div style={{ padding: '32px', maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'Rajdhani', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '32px' }}>
        Новый турнир
      </h1>
      <TournamentForm />
    </div>
  )
}
