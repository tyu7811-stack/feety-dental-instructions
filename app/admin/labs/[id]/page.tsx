import { notFound } from "next/navigation"
import { fetchLabDetailForAdmin } from "@/lib/admin/queries"
import { AdminLabDetailClient } from "./admin-lab-detail-client"

export default async function AdminLabDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data, error } = await fetchLabDetailForAdmin(id)

  if (!data) {
    if (error) {
      return (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {error}
        </div>
      )
    }
    notFound()
  }

  return <AdminLabDetailClient detail={data} />
}
