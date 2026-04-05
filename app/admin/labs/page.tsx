import Link from "next/link"
import { fetchLabsForAdmin } from "@/lib/admin/queries"
import { Building2, ChevronRight } from "lucide-react"
import { formatDateTime } from "@/lib/mock-data"

export default async function AdminLabsPage() {
  const { data: labs, error } = await fetchLabsForAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">技工所管理</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          登録済み技工所一覧（Supabase の実データ）
        </p>
        {error && (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  技工所名
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  連絡先
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  提携医院
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  進行中案件
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  登録日
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {labs.map((lab) => (
                <tr
                  key={lab.id}
                  className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{lab.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {lab.contact_name ?? "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {lab.phone ?? "—"}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-foreground">{lab.clinicCount}医院</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-foreground">
                    {lab.activeCaseCount} 件
                    <span className="block text-xs text-muted-foreground">
                      納品済み以外
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {lab.created_at ? formatDateTime(lab.created_at) : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/labs/${lab.id}`}
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                    >
                      詳細
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-border">
          {labs.map((lab) => (
            <Link
              key={lab.id}
              href={`/admin/labs/${lab.id}`}
              className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{lab.name}</p>
                  <p className="text-xs text-muted-foreground">
                    医院 {lab.clinicCount} / 未納品 {lab.activeCaseCount}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {labs.length === 0 && !error && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            技工所データがありません
          </p>
        )}
      </div>
    </div>
  )
}
