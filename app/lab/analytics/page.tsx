import { createClient } from "@/lib/supabase/server"

export default async function LabAnalyticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <p className="text-sm text-muted-foreground">ログインが必要です。</p>
    )
  }

  const { data: lab } = await supabase
    .from("labs")
    .select("id, name")
    .eq("user_id", user.id)
    .single()

  if (!lab) {
    return (
      <p className="text-sm text-muted-foreground">
        技工所情報が見つかりません。
      </p>
    )
  }

  const { count: caseCount } = await supabase
    .from("cases")
    .select("id", { count: "exact", head: true })
    .eq("lab_id", lab.id)

  const { count: clinicCount } = await supabase
    .from("clinics")
    .select("id", { count: "exact", head: true })
    .eq("lab_id", lab.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">分析</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {lab.name} の集計（実データ）
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground">案件数</p>
          <p className="mt-2 text-2xl font-bold">{caseCount ?? 0}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground">提携医院数</p>
          <p className="mt-2 text-2xl font-bold">{clinicCount ?? 0}</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        グラフ・売上推移は今後、集計テーブルまたは外部 BI と連携する想定です。モック表示は廃止しました。
      </p>
    </div>
  )
}
