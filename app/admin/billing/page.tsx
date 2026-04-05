import { fetchLabsForAdmin } from "@/lib/admin/queries"

export default async function AdminBillingPage() {
  const { data: labs, error } = await fetchLabsForAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">決済・振込管理</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stripe 連携後に入金ステータスを表示する想定です。現在は技工所の登録数のみ表示します。
        </p>
        {error && (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">登録技工所数</p>
          <p className="mt-2 text-2xl font-bold">{labs.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">提携医院（合算）</p>
          <p className="mt-2 text-2xl font-bold">
            {labs.reduce((s, l) => s + l.clinicCount, 0)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">未納品案件（合算・目安）</p>
          <p className="mt-2 text-2xl font-bold">
            {labs.reduce((s, l) => s + l.activeCaseCount, 0)}
          </p>
        </div>
      </div>
    </div>
  )
}
