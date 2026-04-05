import { ClinicHeader } from "@/components/layouts/clinic-header"

export default function ClinicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-theme="clinic" className="min-h-screen bg-background text-foreground">
      <ClinicHeader />
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  )
}
