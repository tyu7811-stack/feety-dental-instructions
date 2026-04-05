"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
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
const demoCases: Case[] = [
  { id: "case1", patient_name: "田中様", prosthesis_types: ["クラウン"], teeth: ["6番"], status: "in_progress", delivery_date: new Date().toISOString().split("T")[0], created_at: new Date().toISOString(), clinics: { name: "山田歯科医院" } },
  { id: "case2", patient_name: "高橋様", prosthesis_types: ["インレー"], teeth: ["5番"], status: "pending", delivery_date: null, created_at: new Date(Date.now() - 86400000).toISOString(), clinics: { name: "佐藤デンタルクリニック" } },
  { id: "case3", patient_name: "渡辺様", prosthesis_types: ["ブリッジ"], teeth: ["4番", "5番", "6番"], status: "completed", delivery_date: new Date().toISOString().split("T")[0], created_at: new Date(Date.now() - 172800000).toISOString(), clinics: { name: "鈴木歯科" } },
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"
  const isTestOnly = searchParams.get("test") === "true"
  const isTestMode = isDemo || isTestOnly
  const queryParam = isDemo ? "?demo=true" : isTestOnly ? "?test=true" : ""

  const [loading, setLoading] = useState(true)
  const [lab, setLab] = useState<Lab | null>(null)
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [cases, setCases] = useState<Case[]>([])

  useEffect(() => {
    async function loadData() {
      // テストモードの場合はデモデータを使用
      if (isTestMode) {
        setLab(demoLab)
        setClinics(demoClinics)
        setCases(demoCases)
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/")
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
  }, [isTestMode, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const clinicCount = clinics.length
  const activeCases = cases.filter((c) => c.status !== "delivered")
  const pendingCases = cases.filter((c) => c.status === "pending")
  const today = new Date().toISOString().split("T")[0]
  const todayDeliveries = cases.filter((c) => c.delivery_date === today)

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
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href={`/lab/clinics${queryParam}`} className="group rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent/50">
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

        <Link href={`/lab/cases${queryParam}`} prefetch={false} className="group rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent/50">
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

        <Link href={`/lab/cases${queryParam}${queryParam ? "&" : "?"}status=completed`} prefetch={false} className="group rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent/50">
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

        <Link href={`/lab/cases${queryParam}${queryParam ? "&" : "?"}status=pending`} prefetch={false} className="group rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent/50">
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
      </div>

      {/* Recent Cases */}
      <section className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold">最近の案件</h2>
          <Link href={`/lab/cases${queryParam}`} prefetch={false} className="text-sm text-primary hover:underline">
            すべて表示
          </Link>
        </div>
        
        {activeCases.length > 0 ? (
          <div className="divide-y divide-border">
            {activeCases.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                href={`/lab/cases/${c.id}${queryParam}`}
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
            <Link href={`/lab/clinics${queryParam}`} className="text-sm text-primary hover:underline">
              すべて表示
            </Link>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {clinics.slice(0, 6).map((clinic) => (
              <div key={clinic.id} className="rounded-lg border border-border p-4">
                <p className="font-medium">{clinic.name}</p>
                {clinic.doctor_name && (
                  <p className="text-sm text-muted-foreground">{clinic.doctor_name} 先生</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
