import { fetchDocumentsForAdmin } from "@/lib/admin/queries"
import { formatDateTime } from "@/lib/mock-data"
import { FileText } from "lucide-react"

export default async function AdminArchivePage() {
  const { data: documents, error } = await fetchDocumentsForAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">帳票アーカイブ</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Supabase documents（最大200件・サービスロール経由）
        </p>
        {error && (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card">
        {documents.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            書類がありません
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center gap-3 px-4 py-3 text-sm"
              >
                <FileText className="h-4 w-4 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{doc.type}</p>
                  <p className="text-xs text-muted-foreground">
                    case: {doc.case_id ?? "—"} / lab: {doc.lab_id}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {doc.issued_at ? formatDateTime(doc.issued_at) : "—"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
