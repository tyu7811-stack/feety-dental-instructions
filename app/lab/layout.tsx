import { LabSidebar } from "@/components/layouts/lab-sidebar"

export default function LabLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-theme="lab" className="flex min-h-screen bg-background text-foreground">
      <LabSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
