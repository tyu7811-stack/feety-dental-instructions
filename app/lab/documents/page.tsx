import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { formatDateTime } from "@/lib/mock-data"
import { FileText } from "lucide-react"

export default async function LabDocumentsPage() {
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
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!lab) {
    return (
      <p className="text-sm text-muted-foreground">
        技工所情報が見つかりません。
      </p>
    )
  }

  const { data: documents, error } = await supabase
    .from("documents")
    .select(
      `
      id,
      type,
      issued_at,
      case_id,
      cases ( patient_name )
    `
    )
    .eq("lab_id", lab.id)
    .order("issued_at", { ascending: false })
    .limit(200)

  if (error) {
    return (
      <p className="text-sm text-destructive">
        書類の取得に失敗しました: {error.message}
      </p>
    )
  }

  const rows = documents ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">書類一覧</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Supabase の documents テーブル（最大200件）
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card">
        {rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            書類がありません
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((doc) => {
              const raw = doc.cases as
                | { patient_name: string | null }
                | { patient_name: string | null }[]
                | null
              const c = Array.isArray(raw) ? raw[0] : raw
              return (
                <li
                  key={doc.id}
                  className="flex items-center gap-3 px-4 py-3 text-sm"
                >
                  <FileText className="h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{doc.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {c?.patient_name?.trim() || "患者不明"} /{" "}
                      {doc.issued_at ? formatDateTime(doc.issued_at) : "—"}
                    </p>
                  </div>
                  {doc.case_id && (
                    <Link
                      href={`/lab/cases/${doc.case_id}`}
                      className="shrink-0 text-xs font-medium text-primary hover:underline"
                    >
                      案件へ
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
