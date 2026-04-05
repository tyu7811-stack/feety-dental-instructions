"use client"

import { useState, useRef } from "react"
import { X, Copy, Check, Printer } from "lucide-react"
import type { Case } from "@/lib/types"
import { getClinicById, getCasesByClinicId, getPriceMasterByLabAndClinic } from "@/lib/mock-data"

interface InvoiceModalProps {
  clinicId: string
  labId: string
  month: string // e.g., "2026-02"
  cases: Case[]
  displayClinicName?: string
  disableMockPricing?: boolean
  onClose: () => void
}

export function InvoiceModal({
  clinicId,
  labId,
  month,
  cases,
  displayClinicName,
  disableMockPricing,
  onClose,
}: InvoiceModalProps) {
  const [copied, setCopied] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const clinicNameResolved =
    displayClinicName ?? getClinicById(clinicId)?.name ?? "—"
  const today = new Date()
  const formattedDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
  
  // Parse month
  const [year, mon] = month.split("-").map(Number)
  const monthLabel = `${year}年${mon}月`

  // Filter cases for this clinic and month
  const priceMaster =
    disableMockPricing === true
      ? []
      : getPriceMasterByLabAndClinic(labId, clinicId)
  
  // Calculate line items from cases
  const lineItems = cases.flatMap((c) => 
    c.prosthesisTypes.map((pt) => {
      const pm = priceMaster.find((p) => p.prosthesisType === pt)
      const qty = c.toothPositions.length
      const unitPrice = pm?.unitPrice ?? 0
      return {
        caseId: c.id,
        patientName: c.patientName,
        prosthesis: pt,
        qty,
        unitPrice,
        amount: unitPrice * qty,
      }
    })
  )

  const subtotal = lineItems.reduce((sum, i) => sum + i.amount, 0)
  const taxRate = 10
  const tax = Math.floor(subtotal * taxRate / 100)
  const total = subtotal + tax
  const previousBalance = 0 // Placeholder
  const currentCharge = total

  function getClipboardText() {
    const lines = [
      `【請求書】(${monthLabel}分)`,
      `発行日: ${formattedDate}`,
      `No. INV-${year}${String(mon).padStart(2, "0")}-${clinicId.slice(-3)}`,
      "",
      `${clinicNameResolved || "医院"}　様`,
      "",
      "下記のとおり御請求申し上げます",
      "",
      `税込合計金額: ¥${total.toLocaleString()}`,
      `(うち消費税額等: ¥${tax.toLocaleString()})`,
      "",
      "--- 摘要 ---",
      `前月請求残高: ¥${previousBalance.toLocaleString()}`,
      "",
      `別紙請求書(税抜): ${lineItems.length}件`,
      `  税率${taxRate}%対象: ¥${subtotal.toLocaleString()}`,
      `  消費税額等: ¥${tax.toLocaleString()}`,
      "",
      `当月請求額: ¥${currentCharge.toLocaleString()}`,
      "",
      "--- 明細 ---",
      ...lineItems.map((i) => `${i.patientName} / ${i.prosthesis} x${i.qty} = ¥${i.amount.toLocaleString()}`),
    ]
    return lines.join("\n")
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(getClipboardText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:bg-white print:p-0">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-border bg-card shadow-xl print:max-h-none print:rounded-none print:border-0 print:shadow-none">
        {/* Header - hide on print */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 print:hidden">
          <h2 className="text-base font-bold text-foreground">請求書プレビュー ({monthLabel}分)</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Preview - styled like physical form (cream/red style) */}
        <div ref={contentRef} className="p-5 print:p-0">
          <div className="mx-auto max-w-xl rounded-lg border-2 border-[#b85c38] bg-[#fdfbf7] p-6 print:border-[#333] print:max-w-none">
            {/* Title row */}
            <div className="mb-4 flex items-baseline justify-between border-b-2 border-[#b85c38] pb-2 print:border-[#333]">
              <h3 className="text-xl font-bold tracking-widest text-[#b85c38] print:text-[#000]">
                請　求　書
              </h3>
              <div className="flex items-baseline gap-4 text-sm text-[#b85c38] print:text-[#333]">
                <span>({monthLabel}分)</span>
                <span>No. INV-{year}{String(mon).padStart(2, "0")}</span>
              </div>
            </div>

            {/* Recipient */}
            <div className="mb-4 border-b border-[#b85c38]/30 pb-3 print:border-[#999]">
              <p className="text-lg font-bold text-[#5c3a28] print:text-[#000]">
                {clinicNameResolved || "医院"}　
                <span className="text-base font-normal">様</span>
              </p>
              <p className="mt-1 text-sm text-[#8a6a58] print:text-[#666]">{formattedDate}</p>
            </div>

            {/* Greeting */}
            <p className="mb-3 text-sm text-[#6a4a38] print:text-[#333]">
              下記のとおり御請求申し上げます
            </p>

            {/* Total amount box */}
            <div className="mb-4 flex items-center gap-4 rounded-md border border-[#b85c38] bg-[#faf4ec] px-4 py-3 print:border-[#333] print:bg-[#f5f5f5]">
              <span className="text-sm font-bold text-[#b85c38] print:text-[#000]">税込合計金額</span>
              <span className="text-xl font-bold text-[#5c3a28] print:text-[#000]">
                ¥{total.toLocaleString()}
              </span>
            </div>

            {/* Summary table */}
            <div className="mb-4 overflow-hidden rounded-md border border-[#b85c38]/50 print:border-[#666]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#b85c38]/50 bg-[#f5ebe0] print:border-[#666] print:bg-[#eee]">
                    <th className="px-3 py-2 text-left font-bold text-[#b85c38] print:text-[#000]">摘要</th>
                    <th className="w-32 px-3 py-2 text-right font-bold text-[#b85c38] print:text-[#000]">金額</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#b85c38]/20 print:border-[#ccc]">
                    <td className="px-3 py-2 text-[#5c3a28] print:text-[#000]">前月請求残高</td>
                    <td className="px-3 py-2 text-right text-[#5c3a28] print:text-[#000]">¥{previousBalance.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b border-[#b85c38]/20 print:border-[#ccc]">
                    <td className="px-3 py-2 text-[#5c3a28] print:text-[#000]">
                      <div>別紙請求書(税抜・税込)</div>
                      <div className="mt-1 text-xs text-[#8a6a58] print:text-[#666]">
                        合計 {lineItems.length}件
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right align-top">
                      <div className="text-[#5c3a28] print:text-[#000]">¥{subtotal.toLocaleString()}</div>
                    </td>
                  </tr>
                  <tr className="border-b border-[#b85c38]/20 bg-[#faf4ec] print:border-[#ccc] print:bg-[#f9f9f9]">
                    <td className="px-3 py-2 text-xs text-[#8a6a58] print:text-[#666]">
                      税率 {taxRate}% 対象
                    </td>
                    <td className="px-3 py-2 text-right text-xs text-[#8a6a58] print:text-[#666]">
                      消費税額等 ¥{tax.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#b85c38] bg-[#f5ebe0] print:border-[#333] print:bg-[#eee]">
                    <td className="px-3 py-2 font-bold text-[#b85c38] print:text-[#000]">
                      当月請求額
                    </td>
                    <td className="px-3 py-2 text-right text-lg font-bold text-[#5c3a28] print:text-[#000]">
                      ¥{currentCharge.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Details (collapsible on screen) */}
            <details className="rounded-md border border-[#b85c38]/30 print:border-[#999]">
              <summary className="cursor-pointer bg-[#faf4ec] px-3 py-2 text-sm font-bold text-[#b85c38] print:bg-[#f5f5f5] print:text-[#000]">
                明細を表示 ({lineItems.length}件)
              </summary>
              <div className="max-h-40 overflow-auto px-3 py-2 print:max-h-none">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#b85c38]/30 print:border-[#ccc]">
                      <th className="py-1 text-left text-[#8a6a58] print:text-[#666]">患者名</th>
                      <th className="py-1 text-left text-[#8a6a58] print:text-[#666]">技工物</th>
                      <th className="py-1 text-right text-[#8a6a58] print:text-[#666]">数量</th>
                      <th className="py-1 text-right text-[#8a6a58] print:text-[#666]">金額</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, idx) => (
                      <tr key={idx} className="border-b border-[#b85c38]/10 print:border-[#eee]">
                        <td className="py-1 text-[#5c3a28] print:text-[#000]">{item.patientName}</td>
                        <td className="py-1 text-[#5c3a28] print:text-[#000]">{item.prosthesis}</td>
                        <td className="py-1 text-right text-[#5c3a28] print:text-[#000]">{item.qty}</td>
                        <td className="py-1 text-right text-[#5c3a28] print:text-[#000]">¥{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        </div>

        {/* Actions - hide on print */}
        <div className="flex gap-2 border-t border-border px-5 py-4 print:hidden">
          <button
            onClick={handleCopy}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.97]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                コピーしました
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                テキストをコピー
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-accent active:scale-[0.97]"
          >
            <Printer className="h-4 w-4" />
            印刷
          </button>
        </div>
      </div>
    </div>
  )
}
