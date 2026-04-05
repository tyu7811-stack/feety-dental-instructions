"use client"

import type { Case } from "@/lib/types"
import { formatDate } from "@/lib/mock-data"

// 技工物11種の固定リスト
const prosthesisList = [
  { num: 1, label: "インレー" },
  { num: 2, label: "4/5冠" },
  { num: 3, label: "FMC" },
  { num: 4, label: "前装冠" },
  { num: 5, label: "キャストコアー" },
  { num: 6, label: "ファイバーコア" },
  { num: 7, label: "CRインレー" },
  { num: 8, label: "HJC" },
  { num: 9, label: "ハイブリット(メタル付)" },
  { num: 10, label: "ハイブリット" },
  { num: 11, label: "ブリッジ" },
]

interface OrderFormDisplayProps {
  caseData: Case
  clinicName: string
  clinicAddress?: string
}

export function OrderFormDisplay({ caseData, clinicName, clinicAddress }: OrderFormDisplayProps) {
  const selectedProsthesis = new Set(caseData.prosthesisTypes)
  const hasAg = caseData.metalType?.includes("Ag")
  const hasPd = caseData.metalType?.includes("Pd")

  return (
    <div className="rounded-xl border-2 border-[#5a9ab8] bg-[#e6f4f1] p-4 shadow-md print:shadow-none">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between border-b-2 border-[#5a9ab8] pb-3">
        <h2 className="text-xl font-bold tracking-wider text-[#1a3a4a]">技 工 指 示 書</h2>
        <div className="text-right text-xs text-[#3a6a84]">
          <p className="font-bold">ナチュラルアート</p>
          <p>糸満市阿波根 51-1</p>
          <p>TEL 996-4377</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left column: patient info & prosthesis types */}
        <div className="space-y-3">
          {/* Clinic / Patient info table */}
          <div className="overflow-hidden rounded-lg border border-[#7bb8d4]">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-[#7bb8d4]">
                  <th className="w-20 bg-[#d4eef5] px-2 py-1.5 text-left text-xs font-bold text-[#1a3a4a]">医院名</th>
                  <td className="bg-[#f0f9fc] px-2 py-1.5 font-medium text-[#1a3a4a]">{clinicName}</td>
                </tr>
                <tr className="border-b border-[#7bb8d4]">
                  <th className="bg-[#d4eef5] px-2 py-1.5 text-left text-xs font-bold text-[#1a3a4a]">患者名</th>
                  <td className="bg-[#f0f9fc] px-2 py-1.5 font-medium text-[#1a3a4a]">{caseData.patientName}</td>
                </tr>
                <tr className="border-b border-[#7bb8d4]">
                  <th className="bg-[#d4eef5] px-2 py-1.5 text-left text-xs font-bold text-[#1a3a4a]">受注年月日</th>
                  <td className="bg-[#f0f9fc] px-2 py-1.5 text-[#1a3a4a]">{formatDate(caseData.createdAt)}</td>
                </tr>
                <tr>
                  <th className="bg-[#d4eef5] px-2 py-1.5 text-left text-xs font-bold text-[#1a3a4a]">納品年月日</th>
                  <td className="bg-[#f0f9fc] px-2 py-1.5 text-[#1a3a4a]">{caseData.dueDate ? formatDate(caseData.dueDate) : "未定"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Prosthesis type checkboxes - matching the physical form */}
          <div className="rounded-lg border border-[#7bb8d4] bg-[#f0f9fc] p-2">
            <div className="mb-1.5 text-xs font-bold text-[#1a3a4a]">技工物種類</div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {prosthesisList.map((item) => {
                const isSelected = selectedProsthesis.has(item.label as any)
                return (
                  <div key={item.num} className="flex items-center gap-1.5">
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border text-[10px] font-bold ${
                        isSelected
                          ? "border-[#2563eb] bg-[#2563eb] text-white"
                          : "border-[#7bb8d4] bg-white text-transparent"
                      }`}
                    >
                      {isSelected && "✓"}
                    </div>
                    <span className={`text-xs ${isSelected ? "font-bold text-[#1a3a4a]" : "text-[#5a7d94]"}`}>
                      {item.num}.{item.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Shade & Metal */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-[#7bb8d4] bg-[#f0f9fc] p-2">
              <div className="text-[10px] font-bold text-[#1a3a4a]">色彩（シェード）</div>
              <div className="mt-1 text-sm font-medium text-[#1a3a4a]">{caseData.shade || "-"}</div>
            </div>
            <div className="rounded-lg border border-[#7bb8d4] bg-[#f0f9fc] p-2">
              <div className="text-[10px] font-bold text-[#1a3a4a]">金属</div>
              <div className="mt-1 flex gap-3 text-xs">
                <span className={hasAg ? "font-bold text-[#1a3a4a]" : "text-[#a0bbd0]"}>
                  {hasAg ? "●" : "○"} Ag
                </span>
                <span className={hasPd ? "font-bold text-[#1a3a4a]" : "text-[#a0bbd0]"}>
                  {hasPd ? "●" : "○"} Pd
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: tooth diagram & additional fields */}
        <div className="space-y-3">
          {/* Tooth positions display */}
          <div className="rounded-lg border border-[#7bb8d4] bg-[#f0f9fc] p-3">
            <div className="mb-2 text-xs font-bold text-[#1a3a4a]">部位（歯式）</div>
            <div className="rounded-md border border-[#7bb8d4] bg-white p-3">
              {/* Simplified tooth grid representation */}
              <ToothGridDisplay selectedTeeth={caseData.toothPositions} />
            </div>
          </div>

          {/* Notes */}
          {caseData.notes && (
            <div className="rounded-lg border border-[#7bb8d4] bg-[#f0f9fc] p-2">
              <div className="text-[10px] font-bold text-[#1a3a4a]">備考</div>
              <div className="mt-1 whitespace-pre-wrap text-xs text-[#1a3a4a]">{caseData.notes}</div>
            </div>
          )}
        </div>
      </div>

      {/* Case ID footer */}
      <div className="mt-4 border-t border-[#7bb8d4] pt-2 text-right">
        <span className="font-mono text-xs text-[#5a7d94]">指示書番号: {caseData.id}</span>
      </div>
    </div>
  )
}

// Simplified tooth grid for display
function ToothGridDisplay({ selectedTeeth }: { selectedTeeth: string[] }) {
  const selectedSet = new Set(selectedTeeth)

  // Upper jaw
  const upperRight = [8, 7, 6, 5, 4, 3, 2, 1].map((n) => ({ id: `右上${n}`, label: String(n) }))
  const upperLeft = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `左上${n}`, label: String(n) }))

  // Lower jaw
  const lowerRight = [8, 7, 6, 5, 4, 3, 2, 1].map((n) => ({ id: `右下${n}`, label: String(n) }))
  const lowerLeft = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `左下${n}`, label: String(n) }))

  const ToothRow = ({ teeth, label }: { teeth: { id: string; label: string }[]; label: string }) => (
    <div className="flex items-center gap-0.5">
      <span className="w-8 text-right text-[9px] text-[#5a7d94]">{label}</span>
      {teeth.map((t) => {
        const isSelected = selectedSet.has(t.id)
        return (
          <div
            key={t.id}
            className={`flex h-5 w-5 items-center justify-center rounded-sm text-[10px] font-bold ${
              isSelected
                ? "bg-[#2563eb] text-white"
                : "border border-[#c8dae8] bg-[#f8fbfd] text-[#a0bbd0]"
            }`}
          >
            {t.label}
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-center gap-1">
        <span className="text-[9px] text-[#5a7d94]">右</span>
        <div className="h-px w-4 bg-[#7bb8d4]" />
        <span className="text-[9px] font-bold text-[#1a3a4a]">上顎</span>
        <div className="h-px w-4 bg-[#7bb8d4]" />
        <span className="text-[9px] text-[#5a7d94]">左</span>
      </div>
      <div className="flex justify-center gap-0.5">
        <ToothRow teeth={upperRight} label="" />
        <div className="w-px bg-[#7bb8d4]" />
        <ToothRow teeth={upperLeft} label="" />
      </div>
      <div className="my-1 h-px w-full bg-[#7bb8d4]" />
      <div className="flex items-center justify-center">
        <span className="text-[9px] font-bold text-[#1a3a4a]">下顎</span>
      </div>
      <div className="flex justify-center gap-0.5">
        <ToothRow teeth={lowerRight} label="" />
        <div className="w-px bg-[#7bb8d4]" />
        <ToothRow teeth={lowerLeft} label="" />
      </div>
    </div>
  )
}
