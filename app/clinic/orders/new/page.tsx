"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Send, RotateCcw, CheckCircle2, ImagePlus, X, Loader2 } from "lucide-react"
import { DentalArchChart, ToothGridSelector } from "@/components/clinic/dental-arch-chart"
import { createCase, getClinicInfo, type CaseFormData } from "../actions"

const prosthesisItems: { num: number; label: string }[] = [
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
  { num: 12, label: "義歯" },
]

const shadeOptions = [
  "A1", "A2", "A3", "A3.5", "A4",
  "B1", "B2", "B3", "B4",
  "C1", "C2", "C3", "C4",
  "D2", "D3", "D4",
]

type GenderType = "男" | "女" | ""

export default function ClinicNewOrderPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <ClinicNewOrderPageContent />
    </Suspense>
  )
}

function ClinicNewOrderPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"
  const demoParam = isDemo ? "?demo=true" : ""
  
  // 医院情報
  const [clinicName, setClinicName] = useState("読み込み中...")
  const [clinicAddress, setClinicAddress] = useState("")
  const [clinicTel, setClinicTel] = useState("")
  
  // 医院情報を取得
  useEffect(() => {
    async function loadClinicInfo() {
      if (isDemo) {
        setClinicName("デモ歯科クリニック")
        setClinicAddress("東京都渋谷区代々木1-1-1")
        setClinicTel("03-0000-0000")
        return
      }
      const info = await getClinicInfo()
      setClinicName(info.clinicName)
      setClinicAddress(info.clinicAddress)
      setClinicTel(info.clinicTel)
    }
    loadClinicInfo()
  }, [isDemo])
  
  const [patientName, setPatientName] = useState("")
  const [gender, setGender] = useState<GenderType>("")
  const [age, setAge] = useState("")
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [deliveryDate, setDeliveryDate] = useState("")
  const [deliveryTime, setDeliveryTime] = useState<"AM" | "PM">("AM")
  const [selectedTeeth, setSelectedTeeth] = useState<Set<string>>(new Set())
  const [selectedProsthesis, setSelectedProsthesis] = useState<Set<string>>(new Set())
  const [customProsthesis12, setCustomProsthesis12] = useState("")
  const [shade, setShade] = useState("")
  const [metalAg, setMetalAg] = useState(false)
  const [metalPd, setMetalPd] = useState(false)
  const [opposingTeeth, setOpposingTeeth] = useState<"有り" | "無し" | "">("")
  const [bite, setBite] = useState<"有り" | "無し" | "">("")
  const [rightSite, setRightSite] = useState("")
  const [leftSite, setLeftSite] = useState("")
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  function toggleTooth(tooth: string) {
    setSelectedTeeth((prev) => {
      const next = new Set(prev)
      if (next.has(tooth)) next.delete(tooth)
      else next.add(tooth)
      const teeth = Array.from(next)
      setRightSite(teeth.filter(t => t.includes("右")).join("、"))
      setLeftSite(teeth.filter(t => t.includes("左")).join("、"))
      return next
    })
  }

  function toggleProsthesis(pt: string) {
    setSelectedProsthesis((prev) => {
      const next = new Set(prev)
      if (next.has(pt)) next.delete(pt)
      else next.add(pt)
      return next
    })
  }

  // Get selected prosthesis types (1-11) + custom 12
  const getSelectedProsthesisTypes = () => {
    const types = Array.from(selectedProsthesis)
    if (customProsthesis12) types.push(customProsthesis12)
    return types
  }

  async function handleSubmit() {
    if (!patientName.trim()) {
      setSubmitError("患者名を入力してください")
      return
    }
    
    setIsSubmitting(true)
    setSubmitError("")
    
    // Supabaseに保存
    const formData: CaseFormData = {
      patientName: patientName.trim(),
      patientGender: gender || undefined,
      patientAge: age ? parseInt(age) : undefined,
      deliveryDate: deliveryDate || undefined,
      deliveryTime: deliveryTime,
      prosthesisTypes: getSelectedProsthesisTypes(),
      teeth: Array.from(selectedTeeth),
      shade: shade || undefined,
      metalAg: metalAg,
      metalPd: metalPd,
      opposingTeeth: opposingTeeth || undefined,
      bite: bite || undefined,
      notes: notes || undefined,
    }
    
    const result = await createCase(formData)
    
    if (result.error) {
      setSubmitError(result.error)
      setIsSubmitting(false)
      return
    }
    
    setSubmitted(true)
    setTimeout(() => {
      router.push("/clinic/dashboard")
    }, 2500)
  }

  function handleReset() {
    setPatientName("")
    setGender("")
    setAge("")
    setDeliveryDate("")
    setSelectedTeeth(new Set())
    setSelectedProsthesis(new Set())
    setCustomProsthesis12("")
    setShade("")
    setMetalAg(false)
    setMetalPd(false)
    setOpposingTeeth("")
    setBite("")
    setRightSite("")
    setLeftSite("")
    setNotes("")
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d1fae5]">
          <CheckCircle2 className="h-8 w-8 text-[#059669]" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">
          技工指示書を送信しました
        </h2>
        
        {/* Destination info card */}
        <div className="mt-6 w-full max-w-sm rounded-xl border border-[#7bb8d4] bg-[#e6f4f1] p-4">
          <div className="mb-3 border-b border-[#7bb8d4] pb-2">
            <span className="text-xs font-bold text-[#4a7d99]">送信先</span>
            <p className="mt-1 text-lg font-bold text-[#1a3a4a]">ナチュラルアート 歯科技工所</p>
            <p className="text-xs text-[#5a7d94]">糸満市阿波根 51-1 TEL 996-4377</p>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#5a7d94]">患者名</span>
              <span className="font-medium text-[#1a3a4a]">{patientName || "未入力"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5a7d94]">技工物</span>
              <span className="font-medium text-[#1a3a4a]">
                {getSelectedProsthesisTypes().length > 0 
                  ? getSelectedProsthesisTypes().join("、")
                  : "未選択"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5a7d94]">部位</span>
              <span className="font-medium text-[#1a3a4a]">
                {selectedTeeth.size > 0 
                  ? Array.from(selectedTeeth).slice(0, 3).join("、") + (selectedTeeth.size > 3 ? ` 他${selectedTeeth.size - 3}箇所` : "")
                  : "未選択"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5a7d94]">納品希望日</span>
              <span className="font-medium text-[#1a3a4a]">
                {deliveryDate ? `${deliveryDate} ${deliveryTime}` : "未指定"}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          ステータスは「履歴」から確認できます。まもなくダッシュボードに戻ります...
        </p>
      </div>
    )
  }

  return (
    <div className="pb-8">
      <div className="mb-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground">新規 技工指示書</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          以下のフォームに必要事項を入力してください
        </p>
      </div>

      {/* ================================================
          Form container - mint/light blue background
          mimicking the physical green/blue form
          ================================================ */}
      <div className="rounded-xl border border-[#7bb8d4] bg-[#e6f4f1] shadow-sm">
        {/* Header */}
        <div className="border-b border-[#7bb8d4] px-4 py-3 sm:px-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold tracking-[0.3em] text-[#1a3a4a]">
              技 工 指 示 書
            </h2>
            <div className="text-right">
              <p className="text-xs font-semibold text-[#2c5f7c]">{clinicName}</p>
              {(clinicAddress || clinicTel) && (
                <p className="text-[10px] text-[#4a7d99]">
                  {clinicAddress}{clinicAddress && clinicTel ? " " : ""}{clinicTel && `TEL ${clinicTel}`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Body - two-column layout like the physical form */}
        <div className="flex flex-col lg:flex-row">

          {/* ====== Left column: fields ====== */}
          <div className="flex-1 border-b border-[#7bb8d4] p-4 sm:p-5 lg:border-b-0 lg:border-r">

            {/* Clinic name - dynamically loaded */}
            <FormRow label="医院名">
              <p className="py-1 text-sm font-medium text-[#1a3a4a]">{clinicName}</p>
            </FormRow>

            {/* Patient name */}
            <FormRow label="患者名">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="氏名を入力"
                  className="flex-1 border-b-2 border-[#7bb8d4] bg-transparent px-1 py-1.5 text-sm text-[#1a3a4a] placeholder:text-[#a0c4d4] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
              <div className="mt-2 flex items-center gap-4">
                {/* Gender radio */}
                <label className="flex items-center gap-1.5 text-sm text-[#2c5f7c]">
                  <input
                    type="radio"
                    name="gender"
                    checked={gender === "男"}
                    onChange={() => setGender("男")}
                    className="h-3.5 w-3.5 accent-[#2563eb]"
                  />
                  男
                </label>
                <label className="flex items-center gap-1.5 text-sm text-[#2c5f7c]">
                  <input
                    type="radio"
                    name="gender"
                    checked={gender === "女"}
                    onChange={() => setGender("女")}
                    className="h-3.5 w-3.5 accent-[#2563eb]"
                  />
                  女
                </label>
                <span className="text-sm text-[#2c5f7c]">（</span>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder=""
                  className="w-12 border-b-2 border-[#7bb8d4] bg-transparent px-1 py-0.5 text-center text-sm text-[#1a3a4a] focus:border-[#2563eb] focus:outline-none"
                />
                <span className="text-sm text-[#2c5f7c]">才）</span>
              </div>
            </FormRow>

            {/* Order date */}
            <FormRow label="受注年月日">
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="border-b-2 border-[#7bb8d4] bg-transparent px-1 py-1 text-sm text-[#1a3a4a] focus:border-[#2563eb] focus:outline-none"
              />
            </FormRow>

            {/* Delivery date */}
            <FormRow label="納品年月日">
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="border-b-2 border-[#7bb8d4] bg-transparent px-1 py-1 text-sm text-[#1a3a4a] focus:border-[#2563eb] focus:outline-none"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => setDeliveryTime("AM")}
                    className={cn(
                      "rounded px-2 py-0.5 text-xs font-bold transition-all",
                      deliveryTime === "AM"
                        ? "bg-[#2563eb] text-[#ffffff]"
                        : "bg-[#d4e8f0] text-[#4a7d99]"
                    )}
                  >
                    AM
                  </button>
                  <button
                    onClick={() => setDeliveryTime("PM")}
                    className={cn(
                      "rounded px-2 py-0.5 text-xs font-bold transition-all",
                      deliveryTime === "PM"
                        ? "bg-[#2563eb] text-[#ffffff]"
                        : "bg-[#d4e8f0] text-[#4a7d99]"
                    )}
                  >
                    PM
                  </button>
                </div>
              </div>
            </FormRow>

            {/* Divider */}
            <div className="my-3 h-px bg-[#7bb8d4]" />

            {/* Prosthesis types - checkboxes 1-11 + dropdown for 12 */}
            <div className="mb-3">
              <span className="mb-2 block text-xs font-bold text-[#1a3a4a]">技工物種類</span>
              
              {/* 1-11: Checkboxes */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
                {prosthesisItems.slice(0, 11).map((item) => {
                  const selected = selectedProsthesis.has(item.label)
                  return (
                    <button
                      type="button"
                      key={item.num}
                      onClick={() => toggleProsthesis(item.label)}
                      className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 transition-colors hover:bg-[#c8e6f0] text-left"
                    >
                      <div
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-all",
                          selected
                            ? "border-[#2563eb] bg-[#2563eb]"
                            : "border-[#7bb8d4] bg-[#ffffff]"
                        )}
                      >
                        {selected && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4 7L8 3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm",
                          selected ? "font-bold text-[#1a3a4a]" : "text-[#2c5f7c]"
                        )}
                      >
                        {item.num}. {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* 12: Custom input dropdown */}
              <div className="border-t border-[#7bb8d4] pt-2">
                <label className="mb-2 block text-xs font-bold text-[#1a3a4a]">12. カスタム入力</label>
                <select
                  value={customProsthesis12}
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      const customInput = prompt("技工物を入力してください:")
                      if (customInput) setCustomProsthesis12(customInput)
                    } else {
                      setCustomProsthesis12(e.target.value)
                    }
                  }}
                  className={cn(
                    "w-full rounded border px-3 py-2 text-sm transition-all focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb]",
                    customProsthesis12
                      ? "border-[#2563eb] bg-white font-medium text-[#1a3a4a]"
                      : "border-[#7bb8d4] bg-[#f9fcfd] text-[#5a7d94]"
                  )}
                >
                  <option value="">選択またはカスタム入力</option>
                  {prosthesisItems.slice(11).map((item) => (
                    <option key={item.num} value={item.label}>
                      {item.label}
                    </option>
                  ))}
                  <option value="custom">--- カスタム入力 ---</option>
                </select>
              </div>

              {customProsthesis12 && !prosthesisItems.some(p => p.label === customProsthesis12) && (
                <p className="mt-1 text-[10px] text-[#d97706]">
                  カスタム入力: {customProsthesis12}
                </p>
              )}

              {getSelectedProsthesisTypes().length > 0 && (
                <div className="mt-2 rounded-lg border border-[#7bb8d4] bg-[#f0f8ff] px-3 py-2">
                  <span className="block text-[10px] font-bold text-[#4a7d99]">選択中の技工物</span>
                  <p className="mt-0.5 text-xs font-semibold text-[#1a3a4a]">
                    {getSelectedProsthesisTypes().join("、")}
                  </p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="my-3 h-px bg-[#7bb8d4]" />

            {/* Color / Shade */}
            <FormRow label="色彩">
              <div className="flex flex-wrap gap-1.5">
                {shadeOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setShade(shade === s ? "" : s)}
                    className={cn(
                      "rounded px-2 py-1 text-xs font-medium transition-all",
                      shade === s
                        ? "bg-[#2563eb] text-[#ffffff] shadow-sm"
                        : "bg-[#d4e8f0] text-[#2c5f7c] hover:bg-[#b8dbe8]"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </FormRow>

            {/* Metal */}
            <FormRow label="金属">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 text-sm text-[#2c5f7c]">
                  <input
                    type="checkbox"
                    checked={metalAg}
                    onChange={() => setMetalAg(!metalAg)}
                    className="h-3.5 w-3.5 rounded accent-[#2563eb]"
                  />
                  Ag
                </label>
                <label className="flex items-center gap-1.5 text-sm text-[#2c5f7c]">
                  <input
                    type="checkbox"
                    checked={metalPd}
                    onChange={() => setMetalPd(!metalPd)}
                    className="h-3.5 w-3.5 rounded accent-[#2563eb]"
                  />
                  Pd
                </label>
              </div>
            </FormRow>
          </div>

          {/* ====== Right column: tooth chart + additional fields ====== */}
          <div className="flex-1 p-4 sm:p-5">
            {/* Dental arch */}
            <div className="mb-6">
              <span className="mb-2 block text-xs font-bold text-[#1a3a4a]">部位選択（歯式図）</span>
              {/* Desktop: arch chart, Mobile: grid */}
              <div className="hidden sm:block">
                <DentalArchChart selectedTeeth={selectedTeeth} onToggleTooth={toggleTooth} />
              </div>
              <div className="block sm:hidden">
                <ToothGridSelector selectedTeeth={selectedTeeth} onToggleTooth={toggleTooth} />
              </div>
            </div>

            {/* Divider */}
            <div className="my-1.5 h-px bg-[#7bb8d4]" />

            {/* Site fields - ultra-compact layout below chart matching physical form */}
            <div className="mb-3 grid grid-cols-4 gap-x-2 gap-y-1.5">
              <div className="flex flex-col gap-0.5">
                <input
                  type="text"
                  value={rightSite}
                  onChange={(e) => setRightSite(e.target.value)}
                  className="border-b border-[#7bb8d4] bg-transparent px-0.5 py-0.5 text-[11px] text-[#1a3a4a] placeholder:text-[#a0c4d4] focus:border-[#2563eb] focus:outline-none"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <input
                  type="text"
                  value={leftSite}
                  onChange={(e) => setLeftSite(e.target.value)}
                  className="border-b border-[#7bb8d4] bg-transparent px-0.5 py-0.5 text-[11px] text-[#1a3a4a] placeholder:text-[#a0c4d4] focus:border-[#2563eb] focus:outline-none"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-[#1a3a4a]">対合歯</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setOpposingTeeth(opposingTeeth === "有り" ? "" : "有り")}
                    className={cn(
                      "flex-1 rounded-sm px-1 py-0.5 text-[9px] font-bold transition-all",
                      opposingTeeth === "有り"
                        ? "bg-[#2563eb] text-[#ffffff]"
                        : "border border-[#7bb8d4] bg-transparent text-[#1a3a4a] hover:bg-[#c8e6f0]"
                    )}
                  >
                    有り
                  </button>
                  <button
                    onClick={() => setOpposingTeeth(opposingTeeth === "無し" ? "" : "無し")}
                    className={cn(
                      "flex-1 rounded-sm px-1 py-0.5 text-[9px] font-bold transition-all",
                      opposingTeeth === "無し"
                        ? "bg-[#2563eb] text-[#ffffff]"
                        : "border border-[#7bb8d4] bg-transparent text-[#1a3a4a] hover:bg-[#c8e6f0]"
                    )}
                  >
                    無し
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-[#1a3a4a]">バイト</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setBite(bite === "有り" ? "" : "有り")}
                    className={cn(
                      "flex-1 rounded-sm px-1 py-0.5 text-[9px] font-bold transition-all",
                      bite === "有り"
                        ? "bg-[#2563eb] text-[#ffffff]"
                        : "border border-[#7bb8d4] bg-transparent text-[#1a3a4a] hover:bg-[#c8e6f0]"
                    )}
                  >
                    有り
                  </button>
                  <button
                    onClick={() => setBite(bite === "無し" ? "" : "無し")}
                    className={cn(
                      "flex-1 rounded-sm px-1 py-0.5 text-[9px] font-bold transition-all",
                      bite === "無し"
                        ? "bg-[#2563eb] text-[#ffffff]"
                        : "border border-[#7bb8d4] bg-transparent text-[#1a3a4a] hover:bg-[#c8e6f0]"
                    )}
                  >
                    無し
                  </button>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#1a3a4a]">備考</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="特別な指示や要望があれば入力してください..."
                className="w-full rounded-md border border-[#7bb8d4] bg-[#f8fcff] px-2 py-1.5 text-xs text-[#1a3a4a] placeholder:text-[#a0c4d4] focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb]/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex gap-3">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <RotateCcw className="h-4 w-4" />
          リセット
        </button>
        <button
          onClick={handleSubmit}
          disabled={
            !patientName ||
            selectedTeeth.size === 0 ||
            selectedProsthesis.size === 0
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          送信する
        </button>
      </div>
    </div>
  )
}

// --- Utility: form row with left label ---
function FormRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-3">
      <span className="mb-1 block text-xs font-bold text-[#1a3a4a]">{label}</span>
      {children}
    </div>
  )
}
