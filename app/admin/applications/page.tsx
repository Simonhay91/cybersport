import connectDB from '@/lib/mongodb'
import Application from '@/models/Application'
import ApplicationsTable from '@/components/admin/ApplicationsTable'

async function getApplications(status?: string) {
  await connectDB()
  const query: Record<string, string> = {}
  if (status) query.status = status
  const apps = await Application.find(query).sort({ submittedAt: -1 }).lean()
  return JSON.parse(JSON.stringify(apps))
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const applications = await getApplications(status)

  const statusLabels: Record<string, string> = {
    new: 'Новые',
    reviewing: 'На проверке',
    confirmed: 'Подтверждены',
    rejected: 'Отклонены',
    cancelled: 'Аннулированы',
  }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Rajdhani', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
          Заявки команд
        </h1>
        <p style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-muted)' }}>
          {applications.length} заявок
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[undefined, 'new', 'reviewing', 'confirmed', 'rejected'].map((s) => (
          <a
            key={s ?? 'all'}
            href={s ? `/admin/applications?status=${s}` : '/admin/applications'}
            style={{
              padding: '6px 16px',
              fontFamily: 'Inter',
              fontSize: '13px',
              textDecoration: 'none',
              border: '1px solid',
              borderColor: status === s || (!status && !s) ? 'var(--accent-yellow)' : 'var(--border-default)',
              color: status === s || (!status && !s) ? 'var(--accent-yellow)' : 'var(--text-muted)',
              background: status === s || (!status && !s) ? 'rgba(200,255,0,0.05)' : 'transparent',
            }}
          >
            {s ? statusLabels[s] : 'Все'}
          </a>
        ))}
      </div>

      <ApplicationsTable applications={applications} />
    </div>
  )
}
