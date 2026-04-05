"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { formatDate, formatDateTime } from "@/lib/mock-data"
import { updateCaseStatus, type LabCaseDocumentVM } from "../actions"
import { StatusBadge } from "@/components/shared/status-badge"
import { DeliveryNoteModal } from "@/components/lab/delivery-note-modal"
import { InvoiceModal } from "@/components/lab/invoice-modal"
import type { CaseStatus, Case } from "@/lib/types"
import {
  ArrowLeft,
  FileText,
  Printer,
  CheckCircle2,
  ClipboardCopy,
  Download,
} from "lucide-react"

const STATUS_FLOW: string[] = [
  "受付",
  "起票済み",
  "製作開始",
  "製作中",
  "完成",
  "納品済み",
]

function flowIndex(flow: string[], status: string) {
  const i = flow.indexOf(status)
  return i >= 0 ? i : 0
}

export function LabCaseDetailClient({
  caseData,
  clinicName,
  clinicDoctorName,
  documents,
  disableMockPricing,
}: {
  caseData: Case
  clinicName: string
  clinicDoctorName: string
  documents: LabCaseDocumentVM[]
  disableMockPricing?: boolean
}) {
  return (
    <Suspense fallback={null}>
      <LabCaseDetailInner
        caseData={caseData}
        clinicName={clinicName}
        clinicDoctorName={clinicDoctorName}
        documents={documents}
        disableMockPricing={disableMockPricing}
      />
    </Suspense>
  )
}

function LabCaseDetailInner({
  caseData,
  clinicName,
  clinicDoctorName,
  documents,
  disableMockPricing,
}: {
  caseData: Case
  clinicName: string
  clinicDoctorName: string
  documents: LabCaseDocumentVM[]
  disableMockPricing?: boolean
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const labNavQuery = (() => {
    const p = new URLSearchParams()
    if (searchParams.get("demo") === "true") p.set("demo", "true")
    if (searchParams.get("test") === "true") p.set("test", "true")
    const s = p.toString()
    return s ? `?${s}` : ""
  })()

  const [currentStatus, setCurrentStatus] = useState<CaseStatus | null>(
    caseData.status
  )
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState("")
  const [statusError, setStatusError] = useState("")

  const displayStatus = currentStatus || caseData.status
  const currentIdx = flowIndex(STATUS_FLOW, displayStatus)

  function handleCopyInstructionContent() {
    const content = `【技工指示書内容】

歯科医院: ${clinicName}
患者名: ${caseData.patientName}
部位: ${caseData.toothPositions.join("、")}
技工物: ${caseData.prosthesisTypes.join("、")}
色調: ${caseData.shade}
金属: ${caseData.metalType}
納期: ${formatDate(caseData.dueDate)}
起票日: ${formatDateTime(caseData.createdAt)}
更新日: ${formatDateTime(caseData.updatedAt)}
${caseData.notes ? `備考: ${caseData.notes}` : ""}`

    navigator.clipboard.writeText(content).then(() => {
      setCopyFeedback("指示書内容をコピーしました")
      setTimeout(() => setCopyFeedback(""), 2000)
    })
  }

  function getDocumentContent(docType: string) {
    if (docType === "技工指示書") {
      return {
        html: `
          <h1 style="text-align:center; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px;">技工指示書</h1>
          <table style="width:100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 8px; border: 1px solid #ccc; width: 100px; background: #f5f5f5;"><strong>医院名</strong></td><td style="padding: 8px; border: 1px solid #ccc;">${clinicName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc; background: #f5f5f5;"><strong>患者名</strong></td><td style="padding: 8px; border: 1px solid #ccc;">${caseData.patientName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc; background: #f5f5f5;"><strong>部位</strong></td><td style="padding: 8px; border: 1px solid #ccc;">${caseData.toothPositions.join("、")}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc; background: #f5f5f5;"><strong>技工物</strong></td><td style="padding: 8px; border: 1px solid #ccc;">${caseData.prosthesisTypes.join("、")}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc; background: #f5f5f5;"><strong>色調</strong></td><td style="padding: 8px; border: 1px solid #ccc;">${caseData.shade}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc; background: #f5f5f5;"><strong>金属</strong></td><td style="padding: 8px; border: 1px solid #ccc;">${caseData.metalType}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc; background: #f5f5f5;"><strong>納期</strong></td><td style="padding: 8px; border: 1px solid #ccc;">${formatDate(caseData.dueDate)}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc; background: #f5f5f5;"><strong>起票日</strong></td><td style="padding: 8px; border: 1px solid #ccc;">${formatDateTime(caseData.createdAt)}</td></tr>
            ${caseData.notes ? `<tr><td style="padding: 8px; border: 1px solid #ccc; background: #f5f5f5;"><strong>備考</strong></td><td style="padding: 8px; border: 1px solid #ccc;">${caseData.notes}</td></tr>` : ""}
          </table>
        `,
        text: `【技工指示書】\n\n医院名: ${clinicName}\n患者名: ${caseData.patientName}\n部位: ${caseData.toothPositions.join("、")}\n技工物: ${caseData.prosthesisTypes.join("、")}\n色調: ${caseData.shade}\n金属: ${caseData.metalType}\n納期: ${formatDate(caseData.dueDate)}\n起票日: ${formatDateTime(caseData.createdAt)}${caseData.notes ? `\n備考: ${caseData.notes}` : ""}`,
      }
    }
    return {
      html: `
          <h1 style="text-align:center; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px;">${docType}</h1>
          <table style="width:100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 8px; border: 1px solid #ccc; width: 100px; background: #f5f5f5;"><strong>医院名</strong></td><td style="padding: 8px; border: 1px solid #ccc;">${clinicName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc; background: #f5f5f5;"><strong>患者名</strong></td><td style="padding: 8px; border: 1px solid #ccc;">${caseData.patientName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc; background: #f5f5f5;"><strong>技工物</strong></td><td style="padding: 8px; border: 1px solid #ccc;">${caseData.prosthesisTypes.join("、")}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc; background: #f5f5f5;"><strong>数量</strong></td><td style="padding: 8px; border: 1px solid #ccc;">1</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc; background: #f5f5f5;"><strong>日付</strong></td><td style="padding: 8px; border: 1px solid #ccc;">${formatDate(caseData.dueDate)}</td></tr>
          </table>
        `,
      text: `【${docType}】\n\n医院名: ${clinicName}\n患者名: ${caseData.patientName}\n技工物: ${caseData.prosthesisTypes.join("、")}\n数量: 1\n日付: ${formatDate(caseData.dueDate)}`,
    }
  }

  function handlePrintDocument(docType: string) {
    const { html } = getDocumentContent(docType)
    const printWindow = window.open("", "", "height=600,width=800")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${docType}</title>
          <style>
            body { font-family: "Hiragino Sans", "Meiryo", sans-serif; padding: 30px; }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  function handleDownloadDocument(docType: string) {
    const { html } = getDocumentContent(docType)
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${docType}</title>
          <style>
            body { font-family: "Hiragino Sans", "Meiryo", sans-serif; padding: 30px; }
          </style>
        </head>
        <body>
          ${html}
          <p style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            発行日: ${new Date().toLocaleDateString("ja-JP")}
          </p>
        </body>
      </html>
    `

    const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${docType}_${caseData.patientName}_${formatDate(caseData.dueDate)}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setCopyFeedback("ファイルをダウンロードしました。USBメモリに保存できます。")
    setTimeout(() => setCopyFeedback(""), 3000)
  }

  async function handleStatusClick(s: string, idx: number) {
    if (idx <= currentIdx) return
    setStatusError("")
    const res = await updateCaseStatus(caseData.id, s)
    if (res.error) {
      setStatusError(res.error)
      return
    }
    setCurrentStatus(s as CaseStatus)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {showDeliveryModal && (
        <DeliveryNoteModal
          caseData={caseData}
          displayClinicName={clinicName}
          disableMockPricing={disableMockPricing}
          onClose={() => setShowDeliveryModal(false)}
        />
      )}
      {showInvoiceModal && (
        <InvoiceModal
          clinicId={caseData.clinicId}
          labId={caseData.labId}
          month={caseData.createdAt.slice(0, 7)}
          cases={[caseData]}
          displayClinicName={clinicName}
          disableMockPricing={disableMockPricing}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
      <Link
        href={`/lab/cases${labNavQuery}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        案件一覧に戻る
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-mono text-muted-foreground">{caseData.id}</p>
          <h1 className="text-2xl font-bold tracking-tight">{caseData.patientName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {clinicName} / {clinicDoctorName}
          </p>
        </div>
        <StatusBadge status={displayStatus} className="text-sm px-3 py-1" />
      </div>

      {statusError && (
        <p className="text-sm text-destructive">{statusError}</p>
      )}

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 text-base font-semibold text-card-foreground">
          ステータス進行
        </h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STATUS_FLOW.map((s, idx) => {
            const isCompleted = idx <= currentIdx
            const isCurrent = idx === currentIdx
            return (
              <div key={s} className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleStatusClick(s, idx)}
                  disabled={idx <= currentIdx}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                        ? "bg-emerald-100 text-emerald-800"
                        : "border border-border bg-background text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {isCompleted && <CheckCircle2 className="h-3 w-3" />}
                  {s}
                </button>
                {idx < STATUS_FLOW.length - 1 && (
                  <div
                    className={`h-px w-6 ${
                      idx < currentIdx ? "bg-emerald-400" : "bg-border"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold text-card-foreground">
            指示書内容
          </h2>
          <dl className="space-y-3">
            <DetailRow label="歯科医院" value={clinicName || "未記入"} />
            <DetailRow label="患者名" value={caseData.patientName} />
            <DetailRow label="部位" value={caseData.toothPositions.join("、")} />
            <DetailRow
              label="技工物"
              value={caseData.prosthesisTypes.join("、")}
            />
            <DetailRow label="色調" value={caseData.shade} />
            <DetailRow label="金属" value={caseData.metalType} />
            <DetailRow label="納期" value={formatDate(caseData.dueDate)} />
            <DetailRow label="起票日" value={formatDateTime(caseData.createdAt)} />
            <DetailRow label="更新日" value={formatDateTime(caseData.updatedAt)} />
            {caseData.notes && (
              <DetailRow label="備考" value={caseData.notes} />
            )}
          </dl>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold text-card-foreground">
            関連書類
          </h2>
          {documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(doc.generatedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDownloadDocument(doc.type)}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                      title="USBに保存"
                    >
                      <Download className="h-3 w-3" />
                      保存
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePrintDocument(doc.type)}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors"
                      title="印刷"
                    >
                      <Printer className="h-3 w-3" />
                      印刷
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-6">
              書類はまだ生成されていません
            </p>
          )}

          <div className="mt-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowDeliveryModal(true)}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors active:scale-[0.97]"
              >
                <FileText className="h-4 w-4" />
                納品書を生成
              </button>
              <button
                type="button"
                onClick={() => setShowInvoiceModal(true)}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-bold text-foreground hover:bg-accent transition-colors active:scale-[0.97]"
              >
                <FileText className="h-4 w-4" />
                請求書を生成
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              USBメモリに保存は保存ボタンから
            </p>
            <button
              type="button"
              onClick={handleCopyInstructionContent}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-bold text-foreground hover:bg-accent transition-colors active:scale-[0.97]"
            >
              <ClipboardCopy className="h-4 w-4" />
              指示書内容をコピー
            </button>
            {copyFeedback && (
              <p className="text-center text-xs text-emerald-600 font-medium">
                {copyFeedback}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <dt className="w-20 shrink-0 text-xs font-medium text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  )
}
