import { createClient } from "@/lib/supabase/server"
import { resolveClinicForUser } from "@/lib/clinic/resolve-clinic-for-user"
import Link from "next/link"
import { ClipboardList, ClipboardPlus, ChevronRight, Package, CheckCircle } from "lucide-react"

type Case = {
  id: string
  patient_name: string
  prosthesis_types: string[]
  teeth: string[]
  status: string
  delivery_date: string | null
  created_at: string
}

// Demo data for testing
const demoClinic = { id: "demo-clinic", name: "サンプル歯科医院" }
const demoCases: Case[] = [
  { id: "case1", patient_name: "田中様", prosthesis_types: ["クラウン"], teeth: ["6番"], status: "in_progress", delivery_date: new Date(Date.now() + 604800000).toISOString().split("T")[0], created_at: new Date().toISOString() },
  { id: "case2", patient_name: "高橋様", prosthesis_types: ["インレー"], teeth: ["5番"], status: "pending", delivery_date: null, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "case3", patient_name: "渡辺様", prosthesis_types: ["ブリッジ"], teeth: ["4番", "5番", "6番"], status: "delivered", delivery_date: new Date(Date.now() - 86400000).toISOString().split("T")[0], created_at: new Date(Date.now() - 604800000).toISOString() },
]

export default async function ClinicDashboard({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string; test?: string }>
}) {
  const params = await searchParams
  const isTestMode = params.test === "true" || params.demo === "true"
  const queryParam = isTestMode ? "?test=true" : ""
  
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // テスト/デモモード判定
  const isDemo = !user || isTestMode

  let clinic: { id: string; name: string } | null = null
  if (isDemo) {
    clinic = demoClinic
  } else if (user) {
    const { data: resolved } = await resolveClinicForUser(supabase, user)
    if (resolved) {
      const { data: row } = await supabase
        .from("clinics")
        .select("id, name")
        .eq("id", resolved.id)
        .single()
      clinic = row
    }
  }

  // Get cases for this clinic
  const { data: cases } = isDemo ? { data: demoCases } : await supabase
    .from("cases")
    .select("id, patient_name, prosthesis_types, teeth, status, delivery_date, created_at")
    .eq("clinic_id", clinic?.id)
    .order("created_at", { ascending: false })

  const totalCases = cases?.length || 0
  const isDelivered = (s: string) => s === "delivered" || s === "納品済み"
  const activeCases = cases?.filter((c: Case) => !isDelivered(c.status)) || []
  const completedCases = cases?.filter((c: Case) => isDelivered(c.status)) || []

  // デモは英語、本番DBは日本語（createCase は「受付」など）
  const statusLabels: Record<string, string> = {
    pending: "受付中",
    in_progress: "製作中",
    completed: "完成",
    delivered: "納品済み",
    受付: "受付",
    製作開始: "製作開始",
    製作中: "製作中",
    完成: "完成",
    納品済み: "納品済み",
    起票済み: "起票済み",
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-emerald-100 text-emerald-700",
    delivered: "bg-gray-100 text-gray-600",
    受付: "bg-amber-100 text-amber-700",
    製作開始: "bg-blue-100 text-blue-700",
    製作中: "bg-blue-100 text-blue-700",
    完成: "bg-emerald-100 text-emerald-700",
    納品済み: "bg-gray-100 text-gray-600",
    起票済み: "bg-slate-100 text-slate-700",
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">指示書履歴</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            送信した技工指示書の一覧
          </p>
        </div>
        <Link
          href={`/clinic/orders/new${queryParam}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ClipboardPlus className="h-4 w-4" />
          新規指示書
        </Link>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">総指示書数</p>
              <p className="text-xl font-bold">{totalCases}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Package className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">進行中</p>
              <p className="text-xl font-bold">{activeCases.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <CheckCircle className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">納品済み</p>
              <p className="text-xl font-bold">{completedCases.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Cases */}
      {activeCases.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold">
            進行中 ({activeCases.length}件)
          </h2>
          <div className="space-y-2">
            {activeCases.map((c: Case) => (
              <Link
                key={c.id}
                href={`/clinic/orders/${c.id}${queryParam}`}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{c.patient_name}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[c.status] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {statusLabels[c.status] ?? c.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {c.prosthesis_types?.join(", ")} / {c.teeth?.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(c.created_at)}
                      {c.delivery_date && ` / 納期: ${formatDate(c.delivery_date)}`}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Completed Cases */}
      {completedCases.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            納品済み ({completedCases.length}件)
          </h2>
          <div className="space-y-2">
            {completedCases.slice(0, 5).map((c: Case) => (
              <Link
                key={c.id}
                href={`/clinic/orders/${c.id}${queryParam}`}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 opacity-75 transition-colors hover:bg-accent/50 hover:opacity-100"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <ClipboardList className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{c.patient_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {c.prosthesis_types?.join(", ")} / {formatDate(c.created_at)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {cases?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
          <ClipboardList className="h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-sm text-muted-foreground">
            まだ指示書がありません
          </p>
          <Link
            href={`/clinic/orders/new${queryParam}`}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            最初の指示書を作成
          </Link>
        </div>
      )}
    </div>
  )
}
