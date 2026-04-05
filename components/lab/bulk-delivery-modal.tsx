"use client"

import { useState } from "react"
import { X, Copy, Check, Package, Printer } from "lucide-react"
import type { Case } from "@/lib/types"
import { getClinicById, formatDate, getPriceMasterByLabAndClinic } from "@/lib/mock-data"

interface BulkDeliveryModalProps {
  cases: Case[]
  onClose: () => void
}

function buildSingleNote(c: Case, clinicName: string, today: string, totalAmount: number) {
  const lines = [
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "　　　　　　　　　納　品　書",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `発行日：${today}`,
    `納品先：${clinicName}　先生`,
    "────────────────────────────",
    `患者名：${c.patientName} 様`,
    `部　位：${c.toothPositions.join("、")}`,
    `技工物：${c.prosthesisTypes.join("、")}`,
    `色　調：${c.shade || "-"}`,
    `金　属：${c.metalType || "-"}`,
    c.notes ? `備　考：${c.notes}` : "",
    "────────────────────────────",
    `合　計：¥${totalAmount.toLocaleString()}（税込）`,
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  ].filter((l) => l !== "")
  return lines.join("\n")
}

export function BulkDeliveryModal({ cases, onClose }: BulkDeliveryModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(cases.map((c) => c.id))
  )
  const [printed, setPrinted] = useState(false)
  const today = formatDate(new Date().toISOString())

  function toggleCase(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function getAmount(c: Case) {
    const priceMaster = getPriceMasterByLabAndClinic(c.labId, c.clinicId)
    return c.prosthesisTypes.reduce((sum, pt) => {
      const pm = priceMaster.find((p) => p.prosthesisType === pt)
      return sum + (pm?.unitPrice ?? 0) * c.toothPositions.length
    }, 0)
  }

  const selectedCases = cases.filter((c) => selectedIds.has(c.id))

  const bulkText = selectedCases
    .map((c) => {
      const clinic = getClinicById(c.clinicId)
      return buildSingleNote(c, clinic?.name ?? "", today, getAmount(c))
    })
    .join("\n\n")

  async function handlePrint() {
    if (!bulkText) return
    const printWindow = window.open("", "", "height=600,width=800")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>本日の納品書</title>
          <style>
            body { font-family: "Hiragino Sans", "Meiryo", sans-serif; padding: 20px; line-height: 1.6; }
            pre { font-family: monospace; white-space: pre-wrap; word-wrap: break-word; }
          </style>
        </head>
        <body>
          <pre>${bulkText}</pre>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
    
    setPrinted(true)
    setTimeout(() => setPrinted(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-lg flex-col rounded-2xl border border-border bg-card shadow-xl" style={{ maxHeight: "90vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-foreground">本日の納品書 まとめコピー</h2>
            <p className="text-xs text-muted-foreground mt-0.5">コピーしたい案件を選択してください</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Case list */}
        <div className="overflow-y-auto p-4 space-y-2">
          {cases.map((c) => {
            const clinic = getClinicById(c.clinicId)
            const amount = getAmount(c)
            const checked = selectedIds.has(c.id)
            return (
              <button
                key={c.id}
                onClick={() => toggleCase(c.id)}
                className={`w-full flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                  checked
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-muted-foreground/30"
                }`}
              >
                <div className={`mt-0.5 h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
                  checked ? "border-primary bg-primary" : "border-border"
                }`}>
                  {checked && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-foreground">{c.patientName}</span>
                    <span className="text-xs font-mono text-muted-foreground">¥{amount.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {clinic?.name} / {c.prosthesisTypes.join("、")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.toothPositions.join("、")}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Preview */}
        {selectedCases.length > 0 && (
          <div className="mx-4 mb-2 max-h-36 overflow-y-auto rounded-lg border border-border bg-background p-3">
            <p className="mb-1 text-[10px] font-bold text-muted-foreground">プレビュー ({selectedCases.length}件)</p>
            <pre className="font-mono text-[10px] leading-relaxed text-foreground whitespace-pre-wrap">
              {bulkText}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 border-t border-border px-5 py-4">
          <button
            onClick={handlePrint}
            disabled={selectedCases.length === 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {printed ? (
              <>
                <Check className="h-4 w-4" />
                {selectedCases.length}件印刷しました
              </>
            ) : (
              <>
                <Printer className="h-4 w-4" />
                {selectedCases.length}件まとめて印刷
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
