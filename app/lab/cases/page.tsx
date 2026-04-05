"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { formatDate } from "@/lib/mock-data"
import { StatusBadge } from "@/components/shared/status-badge"
import type { CaseStatus } from "@/lib/types"
import { Search, ChevronRight, Filter, Copy, MoreVertical, Loader2 } from "lucide-react"
import { getLabCases } from "./actions"

// Supabaseから取得する案件の型
type CaseData = {
  id: string
  patient_name: string
  patient_gender: string | null
  patient_age: number | null
  delivery_date: string | null
  delivery_time: string | null
  prosthesis_types: string[]
  teeth: string[]
  shade: string | null
  metal_ag: boolean
  metal_pd: boolean
  opposing_teeth: string | null
  bite: string | null
  notes: string | null
  status: CaseStatus
  ordered_at: string
  completed_at: string | null
  created_at: string
  clinics: {
    id: string
    name: string
    doctor_name: string
  } | null
}

// デモ用データ
const demoCases: CaseData[] = [
  { id: "case1", patient_name: "田中様", patient_gender: "男", patient_age: 45, delivery_date: new Date(Date.now() + 604800000).toISOString().split("T")[0], delivery_time: "午前", prosthesis_types: ["FCK"], teeth: ["6番"], shade: "A3", metal_ag: false, metal_pd: true, opposing_teeth: null, bite: null, notes: "特になし", status: "製作中", ordered_at: new Date().toISOString(), completed_at: null, created_at: new Date().toISOString(), clinics: { id: "c1", name: "山田歯科医院", doctor_name: "山田太郎" } },
  { id: "case2", patient_name: "高橋様", patient_gender: "女", patient_age: 32, delivery_date: new Date(Date.now() + 432000000).toISOString().split("T")[0], delivery_time: "午後", prosthesis_types: ["インレー"], teeth: ["5番"], shade: "A2", metal_ag: true, metal_pd: false, opposing_teeth: null, bite: null, notes: null, status: "受付", ordered_at: new Date(Date.now() - 86400000).toISOString(), completed_at: null, created_at: new Date(Date.now() - 86400000).toISOString(), clinics: { id: "c2", name: "佐藤デンタルクリニック", doctor_name: "佐藤花子" } },
  { id: "case3", patient_name: "渡辺様", patient_gender: "男", patient_age: 58, delivery_date: new Date().toISOString().split("T")[0], delivery_time: "午前", prosthesis_types: ["ブリッジ"], teeth: ["4番", "5番", "6番"], shade: "A3.5", metal_ag: false, metal_pd: true, opposing_teeth: "天然歯", bite: "咬合紙チェック", notes: "急ぎ対応", status: "完成", ordered_at: new Date(Date.now() - 604800000).toISOString(), completed_at: new Date().toISOString(), created_at: new Date(Date.now() - 604800000).toISOString(), clinics: { id: "c3", name: "鈴木歯科", doctor_name: "鈴木一郎" } },
  { id: "case4", patient_name: "伊藤様", patient_gender: "女", patient_age: 28, delivery_date: new Date(Date.now() - 172800000).toISOString().split("T")[0], delivery_time: "午前", prosthesis_types: ["CR"], teeth: ["3番"], shade: "A1", metal_ag: false, metal_pd: false, opposing_teeth: null, bite: null, notes: null, status: "納品済み", ordered_at: new Date(Date.now() - 1209600000).toISOString(), completed_at: new Date(Date.now() - 259200000).toISOString(), created_at: new Date(Date.now() - 1209600000).toISOString(), clinics: { id: "c1", name: "山田歯科医院", doctor_name: "山田太郎" } },
]

const statusOptions: (CaseStatus | "all")[] = [
  "all",
  "受付",
  "製作開始",
  "製作中",
  "完成",
  "納品済み",
]

export default function LabCasesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <LabCasesPageContent />
    </Suspense>
  )
}

function labBypassSuffix(searchParams: { get(name: string): string | null }) {
  const p = new URLSearchParams()
  if (searchParams.get("demo") === "true") p.set("demo", "true")
  if (searchParams.get("test") === "true") p.set("test", "true")
  const s = p.toString()
  return s ? `?${s}` : ""
}

function LabCasesPageContent() {
  const searchParams = useSearchParams()
  const isDemoOrTest =
    searchParams.get("demo") === "true" || searchParams.get("test") === "true"
  const bypassQs = labBypassSuffix(searchParams)
  
  const [cases, setCases] = useState<CaseData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "all">("all")
  const [clinicFilter, setClinicFilter] = useState<string>("all")
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null)

  // 案件一覧を取得
  useEffect(() => {
    async function loadCases() {
      setIsLoading(true)
      
      // デモモードの場合はデモデータを使用
      if (isDemoOrTest) {
        setCases(demoCases)
        setIsLoading(false)
        return
      }
      
      try {
        const result = await getLabCases()
        if (result.error) {
          // エラーが発生した場合はデモデータを表示
          console.log("[v0] Cases fetch error, using demo data:", result.error)
          setError("データベース接続エラーのため、デモデータを表示しています")
          setCases(demoCases)
        } else if (result.data && result.data.length > 0) {
          setCases(result.data as CaseData[])
        } else {
          // データがない場合もデモデータを表示
          setCases(demoCases)
        }
      } catch (err) {
        // 予期しないエラーの場合もデモデータを表示
        console.log("[v0] Unexpected error, using demo data:", err)
        setError("データベース接続エラーのため、デモデータを表示しています")
        setCases(demoCases)
      }
      setIsLoading(false)
    }
    loadCases()
  }, [isDemoOrTest])

  // ユニークな医院一覧を取得
  const clinics = Array.from(
    new Map(
      cases
        .filter((c) => c.clinics)
        .map((c) => [c.clinics!.id, c.clinics!])
    ).values()
  )

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.patient_name.includes(searchQuery) ||
      c.id.includes(searchQuery)
    const matchesStatus =
      statusFilter === "all" || c.status === statusFilter
    const matchesClinic =
      clinicFilter === "all" || c.clinics?.id === clinicFilter
    return matchesSearch && matchesStatus && matchesClinic
  })

  function handleCopy(text: string, message: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(message)
      setOpenMenu(null)
      setTimeout(() => setCopyFeedback(null), 2000)
    })
  }

  function copyByClinic(clinicId: string) {
    const clinicCases = filteredCases.filter(c => c.clinics?.id === clinicId)
    const clinicName = clinicCases[0]?.clinics?.name || "不明"
    const text = `【${clinicName}の案件】\n\n${clinicCases.map(c => 
      `${c.patient_name} - ${c.prosthesis_types.join("、")} - ${formatDate(c.delivery_date || "")}`
    ).join("\n")}`
    handleCopy(text, `${clinicName}の案件をコピーしました`)
  }

  function copyByPatient(caseId: string) {
    const caseData = filteredCases.find(c => c.id === caseId)
    if (!caseData) return
    const text = `【患者: ${caseData.patient_name}】\n医院: ${caseData.clinics?.name || "不明"}\n技工物: ${caseData.prosthesis_types.join("、")}\n部位: ${caseData.teeth.join("、")}\n納期: ${formatDate(caseData.delivery_date || "")}\nステータス: ${caseData.status}`
    handleCopy(text, `${caseData.patient_name}の案件をコピーしました`)
  }

  function copyByStatus(status: CaseStatus | "all") {
    const statusCases = filteredCases.filter(c => c.status === status)
    const text = `【${status}の案件���\n\n${statusCases.map(c => 
      `${c.patient_name} (${c.clinics?.name || "不明"}) - ${c.prosthesis_types.join("、")}`
    ).join("\n")}`
    handleCopy(text, `${status}の案件をコピーしました`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">読み込み中...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">案件管理</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          全案件の一覧と詳細を確認できます
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="患者名・案件IDで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CaseStatus | "all")}
            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">全ステータス</option>
            {statusOptions.filter((s) => s !== "all").map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={clinicFilter}
            onChange={(e) => setClinicFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">全医院</option>
            {clinics.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        <Filter className="mr-1 inline h-3 w-3" />
        {filteredCases.length}件の案件
      </p>

      {/* Cases list */}
      <div className="rounded-xl border border-border bg-card">
        {/* Desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">案件ID</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">患者名</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">医院</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">技工物</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">納期</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">ステータス</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
                    <td className="px-5 py-3 text-sm font-mono text-foreground">{c.id.slice(0, 8)}</td>
                    <td className="px-5 py-3 text-sm font-medium text-foreground">{c.patient_name}</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{c.clinics?.name || "-"}</td>
                    <td className="px-5 py-3 text-sm text-foreground">{c.prosthesis_types.join("、")}</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{formatDate(c.delivery_date || "")}</td>
                    <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3 flex items-center gap-2">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                          title="オプション"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {openMenu === c.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-card shadow-lg z-10">
                            <button
                              onClick={() => copyByPatient(c.id)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent first:rounded-t-lg transition-colors"
                            >
                              <Copy className="h-4 w-4" />
                              患者情報をコピー
                            </button>
                            <button
                              onClick={() => copyByClinic(c.clinics?.id || "")}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                            >
                              <Copy className="h-4 w-4" />
                              医院の全案件をコピー
                            </button>
                            <button
                              onClick={() => copyByStatus(c.status)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent last:rounded-b-lg transition-colors"
                            >
                              <Copy className="h-4 w-4" />
                              {c.status}の全案件をコピー
                            </button>
                          </div>
                        )}
                      </div>
                      <Link
                        href={`/lab/cases/${c.id}${bypassQs}`}
                        className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        詳細 <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="lg:hidden divide-y divide-border">
          {filteredCases.map((c) => (
              <Link
                key={c.id}
                href={`/lab/cases/${c.id}${bypassQs}`}
                className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{c.patient_name}</p>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {c.clinics?.name || "-"} / {c.prosthesis_types.join("、")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    納期: {formatDate(c.delivery_date || "")}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Link>
            ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">該当する案件がありません</p>
          </div>
        )}
      </div>

      {/* Copy feedback */}
      {copyFeedback && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 rounded-lg bg-emerald-500 text-white px-4 py-2 text-sm font-medium shadow-lg z-50">
          {copyFeedback}
        </div>
      )}
    </div>
  )
}
