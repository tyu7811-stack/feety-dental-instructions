import { createClient } from "@/lib/supabase/server"
import { resolveClinicForUser } from "@/lib/clinic/resolve-clinic-for-user"

export default async function ClinicAnalyticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <p className="text-sm text-muted-foreground">ログインが必要です。</p>
    )
  }

  const { data: clinic } = await resolveClinicForUser(supabase, user)
  if (!clinic) {
    return (
      <p className="text-sm text-muted-foreground">
        医院情報が見つかりません。
      </p>
    )
  }

  const { count } = await supabase
    .from("cases")
    .select("id", { count: "exact", head: true })
    .eq("clinic_id", clinic.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">分析</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          送信した指示書の件数（実データ）
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-medium text-muted-foreground">累計指示書数</p>
        <p className="mt-2 text-2xl font-bold">{count ?? 0}</p>
      </div>
    </div>
  )
}
