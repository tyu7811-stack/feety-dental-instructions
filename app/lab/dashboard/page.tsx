"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Users, ClipboardList, Truck, Clock, ChevronRight, Package, Loader2 } from "lucide-react"

type Case = {
  id: string
  patient_name: string
  prosthesis_types: string[] | null
  teeth: string[] | null
  status: string
  delivery_date: string | null
  created_at: string
  clinics: { name: string } | null
}

type Clinic = {
  id: string
  name: string
  doctor_name: string | null
}

type Lab = {
  id: string
  name: string
}

// テスト用デモデータ
const demoLab = { id: "demo-lab", name: "サンプル技工所" }
const demoClinics: Clinic[] = [
  { id: "c1", name: "山田歯科医院", doctor_name: "山田太郎" },
  { id: "c2", name: "佐藤デンタルクリニック", doctor_name: "佐藤花子" },
  { id: "c3", name: "鈴木歯科", doctor_name: "鈴木一郎" },
]
/** 公開デモで中身を見せる件数。それ以外の行・枠は「制限中」 */
const LAB_DEMO_UNLOCKED_COUNT = 3
/** デモで「制限中」行を何行だすか（案件リスト用） */
const LAB_DEMO_RESTRICTED_PLACEHOLDER_ROWS = 2

const demoCases: Case[] = [
  { id: "case1", patient_name: "田中様", prosthesis_types: ["クラウン"], teeth: ["6番"], status: "in_progress", delivery_date: new Date().toISOString().split("T")[0], created_at: new Date().toISOString(), clinics: { name: "山田歯科医院" } },
  { id: "case2", patient_name: "高橋様", prosthesis_types: ["インレー"], teeth: ["5番"], status: "pending", delivery_date: null, created_at: new Date(Date.now() - 86400000).toISOString(), clinics: { name: "佐藤デンタルクリニック" } },
  { id: "case3", patient_name: "渡辺様", prosthesis_types: ["ブリッジ"], teeth: ["4番", "5番", "6番"], status: "completed", delivery_date: new Date().toISOString().split("T")[0], created_at: new Date(Date.now() - 172800000).toISOString(), clinics: { name: "鈴木歯科" } },
  { id: "case4", patient_name: "伊藤様", prosthesis_types: ["CR"], teeth: ["3番"], status: "delivered", delivery_date: new Date(Date.now() - 86400000).toISOString().split("T")[0], created_at: new Date(Date.now() - 259200000).toISOString(), clinics: { name: "山田歯科医院" } },
  { id: "case5", patient_name: "中村様", prosthesis_types: ["FCK"], teeth: ["7番"], status: "delivered", delivery_date: new Date(Date.now() - 172800000).toISOString().split("T")[0], created_at: new Date(Date.now() - 345600000).toISOString(), clinics: { name: "佐藤デンタルクリニック" } },
]

const statusLabels: Record<string, string> = {
  pending: "未着手",
  in_progress: "製作中",
  completed: "完成",
  delivered: "納品済み",
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  delivered: "bg-gray-100 text-gray-600",
}

export default function LabDashboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <LabDashboardContent />
    </Suspense>
  )
}

function LabDashboardContent() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"
  const isTestOnly = searchParams.get("test") === "true"
  const isTestMode = isDemo || isTestOnly
  /** 本番公開デモ: 3件まで・リンクはログインへ（開発の test のみでは従来どおり） */
  const isRestrictedDemo = isDemo
  const queryParam = isDemo ? "?demo=true" : isTestOnly ? "?test=true" : ""

  const [loading, setLoading] = useState(true)
  const [lab, setLab] = useState<Lab | null>(null)
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [cases, setCases] = useState<Case[]>([])
  /** ミドルウェアは通過したがクライアント getUser が遅延／未取得のとき（/login へ自動遷移しない） */
  const [clientAuthWarning, setClientAuthWarning] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setClientAuthWarning(null)
      // テストモードの場合はデモデータを使用
      if (isTestMode) {
        setLab(demoLab)
        setClinics(demoClinics)
        setCases(demoCases)
        setLoading(false)
        return
      }

      const supabase = createClient()
      let user = (await supabase.auth.getUser()).data.user ?? null
      if (!user) {
        for (let i = 0; i < 5; i++) {
          await new Promise((r) => setTimeout(r, 150))
          user = (await supabase.auth.getUser()).data.user ?? null
          if (user) break
        }
      }

      if (!user) {
        console.warn(
          "[lab/dashboard] クライアントで getUser() が空のまま（ミドルウェアはセッションありで通過している可能性）。/login へは送らず画面に案内を表示します。"
        )
        setClientAuthWarning(
          "ブラウザ側でセッションをまだ読み取れません。Cookie の同期が遅れていることがあります。再読み込みを試すか、問題が続く場合はログインし直してください。"
        )
        setLoading(false)
        return
      }

      // 技工所情報を取得
      const { data: labData } = await supabase
        .from("labs")
        .select("id, name")
        .eq("user_id", user.id)
        .single()

      if (labData) {
        setLab(labData)

        // 提携医院を取得 (lab_idカラムがないため、全医院を表示)
        const { data: clinicsData } = await supabase
          .from("clinics")
          .select("id, name, doctor_name")
          .eq("lab_id", labData.id)
          .limit(20)

        if (clinicsData) setClinics(clinicsData)

        const { data: casesData } = await supabase
          .from("cases")
          .select(
            "id, patient_name, prosthesis_types, teeth, status, delivery_date, created_at, clinics(name)"
          )
          .eq("lab_id", labData.id)
          .order("created_at", { ascending: false })

        if (casesData) {
          const rows = casesData.map((row) => {
            const cl = row.clinics as { name: string } | { name: string }[] | null
            const clinicObj = Array.isArray(cl) ? cl[0] ?? null : cl
            return { ...row, clinics: clinicObj }
          })
          setCases(rows as Case[])
        }
      }

      setLoading(false)
    }

    loadData()
  }, [isTestMode])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (clientAuthWarning) {
    return (
      <div className="mx-auto max-w-lg space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
        <p className="font-semibold">セッションの読み込み</p>
        <p>{clientAuthWarning}</p>
        <p className="text-xs text-amber-900/80">
          以前の版ではここで自動的に /login に戻していました。ミドルウェアで認証済みでも、クライアントの
          getUser() が一瞬遅れるとログイン画面に戻る現象の原因になっていました。
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900"
            onClick={() => window.location.reload()}
          >
            ページを再読み込み
          </button>
          <Link
            href="/login"
            className="inline-flex items-center rounded-lg border border-amber-800 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100"
          >
            ログインへ
          </Link>
        </div>
      </div>
    )
  }

  const clinicCount = clinics.length
  const activeCases = cases.filter((c) => c.status !== "delivered")
  const pendingCases = cases.filter((c) => c.status === "pending")
  const today = new Date().toISOString().split("T")[0]
  const todayDeliveries = cases.filter((c) => c.delivery_date === today)

  const recentListLimit = isRestrictedDemo ? LAB_DEMO_UNLOCKED_COUNT : 5
  const partnerUnlocked = isRestrictedDemo ? LAB_DEMO_UNLOCKED_COUNT : 6
  const partnerRestrictedSlots = isRestrictedDemo ? 2 : 0
  const cardHref = (path: string) =>
    isRestrictedDemo ? "/login" : `${path}${queryParam}`
  const casesListHref = (extra: string) =>
    isRestrictedDemo
      ? "/login"
      : `/lab/cases${queryParam}${queryParam ? "&" : "?"}${extra}`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ダッシュボード</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {lab?.name || "技工所"} - 案件状況の概要
          {isTestMode && (
            <span className="ml-2 font-semibold text-amber-700">
              {isDemo ? "[デモ]" : "[テストモード]"}
            </span>
          )}
        </p>
        {isRestrictedDemo && (
          <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            デモでは各欄<strong>先頭{LAB_DEMO_UNLOCKED_COUNT}件</strong>
            のみ内容を表示し、それ以外は<strong>制限中</strong>です。左のメニューから
            <strong>ログイン画面</strong>へ進み、本番はログインしてご利用ください。
          </p>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href={cardHref(`/lab/clinics`)} className="group rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent/50">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">提携医院</p>
              <p className="text-2xl font-bold">{clinicCount}</p>
            </div>
          </div>
        </Link>

        <Link href={cardHref(`/lab/cases`)} prefetch={false} className="group rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent/50">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <ClipboardList className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">進行中案件</p>
              <p className="text-2xl font-bold">{activeCases.length}</p>
            </div>
          </div>
        </Link>

        <Link href={casesListHref("status=completed")} prefetch={false} className="group rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent/50">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
              <Truck className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">本日の納品</p>
              <p className="text-2xl font-bold">{todayDeliveries.length}</p>
            </div>
          </div>
        </Link>

        {isRestrictedDemo ? (
          <div className="rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">未着手</p>
                <p className="text-lg font-semibold text-muted-foreground">制限中</p>
              </div>
            </div>
          </div>
        ) : (
          <Link
            href={casesListHref("status=pending")}
            prefetch={false}
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent/50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <Clock className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">未着手</p>
                <p className="text-2xl font-bold">{pendingCases.length}</p>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Recent Cases */}
      <section className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold">最近の案件</h2>
          <Link
            href={isRestrictedDemo ? "/login" : `/lab/cases${queryParam}`}
            prefetch={false}
            className="text-sm text-primary hover:underline"
          >
            {isRestrictedDemo ? "ログインして全件を見る" : "すべて表示"}
          </Link>
        </div>
        
        {activeCases.length > 0 ? (
          <div className="divide-y divide-border">
            {activeCases.slice(0, recentListLimit).map((c) => (
              <Link
                key={c.id}
                href={isRestrictedDemo ? "/login" : `/lab/cases/${c.id}${queryParam}`}
                prefetch={false}
                className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{c.patient_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {c.clinics?.name} / {(c.prosthesis_types ?? []).join("、")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[c.status] || "bg-gray-100 text-gray-600"}`}>
                    {statusLabels[c.status] || c.status}
                  </span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
            {isRestrictedDemo &&
              Array.from({ length: LAB_DEMO_RESTRICTED_PLACEHOLDER_ROWS }, (_, i) => (
                <div
                  key={`restricted-case-${i}`}
                  className="flex items-center justify-between bg-muted/20 px-5 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/60">
                      <Package className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">制限中</p>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    制限中
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-muted-foreground/30" />
            <p className="mt-4 text-sm text-muted-foreground">案件がありません</p>
            <p className="mt-1 text-xs text-muted-foreground">
              医院から指示書が届くとここに表示されます
            </p>
          </div>
        )}
      </section>

      {/* Partner Clinics */}
      {clinics.length > 0 && (
        <section className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold">提携医院</h2>
            <Link
              href={isRestrictedDemo ? "/login" : `/lab/clinics${queryParam}`}
              className="text-sm text-primary hover:underline"
            >
              {isRestrictedDemo ? "ログインして全件を見る" : "すべて表示"}
            </Link>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {clinics.slice(0, partnerUnlocked).map((clinic) => (
              <div key={clinic.id} className="rounded-lg border border-border p-4">
                <p className="font-medium">{clinic.name}</p>
                {clinic.doctor_name && (
                  <p className="text-sm text-muted-foreground">{clinic.doctor_name} 先生</p>
                )}
              </div>
            ))}
            {isRestrictedDemo &&
              Array.from({ length: partnerRestrictedSlots }, (_, i) => (
                <div
                  key={`restricted-clinic-${i}`}
                  className="flex min-h-[88px] items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 p-4"
                >
                  <p className="text-sm font-medium text-muted-foreground">制限中</p>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  )
}
