import PartnerForm from '@/components/admin/PartnerForm'

export default function NewPartnerPage() {
  return (
    <div style={{ padding: '32px', maxWidth: '600px' }}>
      <h1 style={{ fontFamily: 'Rajdhani', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '32px' }}>
        Новый партнёр
      </h1>
      <PartnerForm />
    </div>
  )
}
