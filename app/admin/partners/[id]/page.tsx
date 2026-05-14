export const dynamic = 'force-dynamic'
import connectDB from '@/lib/mongodb'
import Partner from '@/models/Partner'
import PartnerForm from '@/components/admin/PartnerForm'
import { notFound } from 'next/navigation'

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await connectDB()
  const partner = await Partner.findById(id).lean()
  if (!partner) notFound()

  return (
    <div style={{ padding: '32px', maxWidth: '600px' }}>
      <h1 style={{ fontFamily: 'Rajdhani', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '32px' }}>
        Редактировать партнёра
      </h1>
      <PartnerForm initial={JSON.parse(JSON.stringify(partner))} />
    </div>
  )
}
