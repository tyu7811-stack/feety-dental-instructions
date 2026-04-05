"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Loader2, ArrowLeft, CheckCircle2, Clock } from "lucide-react"
import { OrderFormDisplay } from "@/components/clinic/order-form-display"
import { StatusBadge } from "@/components/shared/status-badge"
import type { Case } from "@/lib/types"
import type { ComponentProps } from "react"

type BadgeStatus = ComponentProps<typeof StatusBadge>["status"]

const CLINIC_FLOW: string[] = [
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

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export function ClinicOrderDetailClient({
  caseData,
  clinicName,
  clinicAddress,
}: {
  caseData: Case
  clinicName: string
  clinicAddress: string
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ClinicOrderDetailInner
        caseData={caseData}
        clinicName={clinicName}
        clinicAddress={clinicAddress}
      />
    </Suspense>
  )
}

function ClinicOrderDetailInner({
  caseData,
  clinicName,
  clinicAddress,
}: {
  caseData: Case
  clinicName: string
  clinicAddress: string
}) {
  const searchParams = useSearchParams()
  const demoParam =
    searchParams.get("demo") === "true"
      ? "?demo=true"
      : searchParams.get("test") === "true"
        ? "?test=true"
        : ""

  const currentIdx = flowIndex(CLINIC_FLOW, caseData.status)
  const lockAt = CLINIC_FLOW.indexOf("製作開始")
  const isLocked = lockAt >= 0 && currentIdx >= lockAt

  return (
    <div className="space-y-6">
      <Link
        href={`/clinic/dashboard${demoParam}`}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm transition-all hover:bg-accent hover:shadow active:scale-[0.98]"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        指示書履歴に戻る
      </Link>

      <div>
        <p className="text-xs font-mono text-muted-foreground">{caseData.id}</p>
        <h1 className="text-xl font-bold tracking-tight">{caseData.patientName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{clinicName}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold text-card-foreground">ステータス</h2>
        <div className="flex flex-col gap-3">
          {CLINIC_FLOW.map((s, idx) => {
            const isCompleted = idx <= currentIdx
            const isCurrent = idx === currentIdx
            return (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    isCompleted
                      ? "bg-emerald-100"
                      : "border-2 border-border bg-background"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    isCurrent
                      ? "text-primary"
                      : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                  )}
                >
                  {s}
                </span>
                {isCurrent && <StatusBadge status={s as BadgeStatus} />}
              </div>
            )
          })}
        </div>
      </div>

      {isLocked && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            この指示書は既に製作が開始されているため、内容の変更はできません。
            変更が必要な場合は技工所にお問い合わせください。
          </p>
        </div>
      )}

      <OrderFormDisplay
        caseData={caseData}
        clinicName={clinicName}
        clinicAddress={clinicAddress || undefined}
      />
    </div>
  )
}
