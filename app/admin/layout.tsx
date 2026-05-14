import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg-primary)',
      position: 'fixed',
      inset: 0,
      zIndex: 10,
    }}>
      <AdminSidebar />
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}
