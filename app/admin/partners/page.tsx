import connectDB from '@/lib/mongodb'
import Partner from '@/models/Partner'
import Link from 'next/link'

async function getPartners() {
  await connectDB()
  const partners = await Partner.find().sort({ order: 1 }).lean()
  return JSON.parse(JSON.stringify(partners))
}

export default async function AdminPartnersPage() {
  const partners = await getPartners()

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Rajdhani', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
          Партнёры
        </h1>
        <Link href="/admin/partners/new" style={{ padding: '10px 24px', background: 'var(--accent-yellow)', color: '#000', fontFamily: 'Rajdhani', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', textDecoration: 'none' }}>
          + Добавить
        </Link>
      </div>

      {partners.length === 0 ? (
        <p style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-muted)' }}>
          Партнёров нет. <Link href="/admin/partners/new" style={{ color: 'var(--accent-yellow)' }}>Добавить первого</Link>
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {partners.map((p: { _id: string; name: string; url?: string; tier: string; active: boolean }) => (
            <div key={p._id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontFamily: 'Rajdhani', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</p>
                <span style={{ fontSize: '11px', fontFamily: 'Inter', color: p.active ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                  {p.active ? 'Активен' : 'Неактивен'}
                </span>
              </div>
              <p style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{p.tier}</p>
              {p.url && <a href={p.url} target="_blank" style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--accent-blue)', textDecoration: 'none' }}>{p.url}</a>}
              <Link href={`/admin/partners/${p._id}`} style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--accent-yellow)', textDecoration: 'none', marginTop: '8px' }}>
                Редактировать →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
