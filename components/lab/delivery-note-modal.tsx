"use client"

import { useState, useRef } from "react"
import { X, Copy, Check, Printer } from "lucide-react"
import type { Case } from "@/lib/types"
import { getClinicById, formatDate, getPriceMasterByLabAndClinic } from "@/lib/mock-data"

interface DeliveryNoteModalProps {
  caseData: Case
  /** DB 連携時は医院名を渡し、モックの getClinicById を使わない */
  displayClinicName?: string
  /** true のとき価格マスタを参照しない（単価0） */
  disableMockPricing?: boolean
  onClose: () => void
}

export function DeliveryNoteModal({
  caseData,
  displayClinicName,
  disableMockPricing,
  onClose,
}: DeliveryNoteModalProps) {
  const [copied, setCopied] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const clinicNameResolved =
    displayClinicName ?? getClinicById(caseData.clinicId)?.name ?? "—"
  const today = new Date()
  const formattedDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`

  const priceMaster =
    disableMockPricing === true
      ? []
      : getPriceMasterByLabAndClinic(caseData.labId, caseData.clinicId)
  const items = caseData.prosthesisTypes.map((pt) => {
    const pm = priceMaster.find((p) => p.prosthesisType === pt)
    const qty = caseData.toothPositions.length
    const unitPrice = pm?.unitPrice ?? 0
    return {
      name: pt,
      qty,
      unitPrice,
      amount: unitPrice * qty,
    }
  })
  const subtotal = items.reduce((sum, i) => sum + i.amount, 0)
  const taxRate = 10
  const tax = Math.floor(subtotal * taxRate / 100)
  const total = subtotal + tax

  function getClipboardText() {
    const lines = [
      "【納品書】",
      `発行日: ${formattedDate}`,
      `No. DN-${caseData.id.slice(-4)}`,
      "",
      `${clinicNameResolved || "医院"}　様`,
      "",
      "下記のとおり納品いたしました",
      "",
      `税込合計金額: ¥${total.toLocaleString()}`,
      `(うち消費税額等: ¥${tax.toLocaleString()})`,
      "",
      "--- 明細 ---",
      "品名 | 数量 | 単価 | 金額(税抜) | 税率",
      ...items.map((i) => `${i.name} | ${i.qty} | ¥${i.unitPrice.toLocaleString()} | ¥${i.amount.toLocaleString()} | ${taxRate}%`),
      "",
      `合計(税抜): ¥${subtotal.toLocaleString()}`,
      `消費税額等: ¥${tax.toLocaleString()}`,
      `合計(税込): ¥${total.toLocaleString()}`,
      "",
      `患者名: ${caseData.patientName}`,
      `部位: ${caseData.toothPositions.join("、")}`,
      caseData.notes ? `備考: ${caseData.notes}` : "",
    ].filter((l) => l !== "")
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
          <h2 className="text-base font-bold text-foreground">納品書プレビュー</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Preview - styled like physical form */}
        <div ref={contentRef} className="p-5 print:p-0">
          <div className="mx-auto max-w-xl rounded-lg border-2 border-[#2563eb] bg-[#fafcff] p-6 print:border-[#333] print:max-w-none">
            {/* Title row */}
            <div className="mb-4 flex items-baseline justify-between border-b-2 border-[#2563eb] pb-2 print:border-[#333]">
              <h3 className="text-xl font-bold tracking-widest text-[#2563eb] print:text-[#000]">
                納　品　書
              </h3>
              <div className="flex items-baseline gap-4 text-sm text-[#2563eb] print:text-[#333]">
                <span>{formattedDate}</span>
                <span>No. DN-{caseData.id.slice(-4)}</span>
              </div>
            </div>

            {/* Recipient */}
            <div className="mb-4 border-b border-[#2563eb]/30 pb-3 print:border-[#999]">
              <p className="text-lg font-bold text-[#1a3a5c] print:text-[#000]">
                {clinicNameResolved || "医院"}　
                <span className="text-base font-normal">様</span>
              </p>
            </div>

            {/* Greeting */}
            <p className="mb-3 text-sm text-[#3a5a7a] print:text-[#333]">
              下記のとおり納品いたしました
            </p>

            {/* Total amount box */}
            <div className="mb-4 flex items-center gap-4 rounded-md border border-[#2563eb] bg-[#eef4ff] px-4 py-3 print:border-[#333] print:bg-[#f5f5f5]">
              <span className="text-sm font-bold text-[#2563eb] print:text-[#000]">税込合計金額</span>
              <span className="text-xl font-bold text-[#1a3a5c] print:text-[#000]">
                ¥{total.toLocaleString()}
              </span>
              <span className="ml-auto text-xs text-[#5a7a9a] print:text-[#666]">
                (うち消費税額等 ¥{tax.toLocaleString()})
              </span>
            </div>

            {/* Items table */}
            <div className="mb-4 overflow-hidden rounded-md border border-[#2563eb]/50 print:border-[#666]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2563eb]/50 bg-[#e0ecff] print:border-[#666] print:bg-[#eee]">
                    <th className="px-2 py-2 text-left font-bold text-[#2563eb] print:text-[#000]">品名</th>
                    <th className="w-14 px-2 py-2 text-right font-bold text-[#2563eb] print:text-[#000]">数量</th>
                    <th className="w-20 px-2 py-2 text-right font-bold text-[#2563eb] print:text-[#000]">単価</th>
                    <th className="w-24 px-2 py-2 text-right font-bold text-[#2563eb] print:text-[#000]">金額(税抜)</th>
                    <th className="w-14 px-2 py-2 text-right font-bold text-[#2563eb] print:text-[#000]">税率</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} className="border-b border-[#2563eb]/20 print:border-[#ccc]">
                      <td className="px-2 py-2 text-[#1a3a5c] print:text-[#000]">{item.name}</td>
                      <td className="px-2 py-2 text-right text-[#1a3a5c] print:text-[#000]">{item.qty}</td>
                      <td className="px-2 py-2 text-right text-[#1a3a5c] print:text-[#000]">¥{item.unitPrice.toLocaleString()}</td>
                      <td className="px-2 py-2 text-right text-[#1a3a5c] print:text-[#000]">¥{item.amount.toLocaleString()}</td>
                      <td className="px-2 py-2 text-right text-[#1a3a5c] print:text-[#000]">{taxRate}%</td>
                    </tr>
                  ))}
                  {/* Empty rows for form aesthetic */}
                  {items.length < 4 && Array.from({ length: 4 - items.length }).map((_, i) => (
                    <tr key={`empty-${i}`} className="border-b border-[#2563eb]/20 print:border-[#ccc]">
                      <td className="px-2 py-2">&nbsp;</td>
                      <td className="px-2 py-2"></td>
                      <td className="px-2 py-2"></td>
                      <td className="px-2 py-2"></td>
                      <td className="px-2 py-2"></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-[#2563eb] bg-[#e0ecff] print:border-[#333] print:bg-[#eee]">
                    <td colSpan={3} className="px-2 py-2 text-right font-bold text-[#2563eb] print:text-[#000]">
                      合計(税抜・税込)
                    </td>
                    <td className="px-2 py-2 text-right font-bold text-[#1a3a5c] print:text-[#000]">
                      ¥{subtotal.toLocaleString()}
                    </td>
                    <td className="px-2 py-2 text-right text-xs text-[#5a7a9a] print:text-[#666]">
                      消費税 ¥{tax.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Patient/case info */}
            <div className="rounded-md border border-[#2563eb]/30 bg-[#f0f6ff] px-3 py-2 text-xs text-[#3a5a7a] print:border-[#999] print:bg-[#f5f5f5] print:text-[#333]">
              <span className="font-bold">患者名:</span> {caseData.patientName} |{" "}
              <span className="font-bold">部位:</span> {caseData.toothPositions.join("、")}
              {caseData.notes && (
                <> | <span className="font-bold">備考:</span> {caseData.notes}</>
              )}
            </div>
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
