import { AdminSidebar } from "@/components/layouts/admin-nav"
import { requireAdminPage } from "@/lib/auth/require-admin"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdminPage()

  return (
    <div data-theme="admin" className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
