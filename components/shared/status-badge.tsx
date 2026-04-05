import { cn } from "@/lib/utils"
import type { CaseStatus, LabStatus, PaymentStatusType } from "@/lib/types"

type StatusVariant =
  | CaseStatus
  | LabStatus
  | PaymentStatusType
  | "未発行"
  | "発行済み"
  | "入金済み"
  | "受付"

const statusConfig: Record<StatusVariant, { label: string; className: string }> = {
  // Case statuses
  受付: { label: "受付", className: "bg-amber-50 text-amber-900" },
  "起票済み": { label: "起票済み", className: "bg-amber-100 text-amber-800" },
  "製作開始": { label: "製作開始", className: "bg-blue-100 text-blue-800" },
  "製作中": { label: "製作中", className: "bg-indigo-100 text-indigo-800" },
  "完成": { label: "完成", className: "bg-emerald-100 text-emerald-800" },
  "納品済み": { label: "納品済み", className: "bg-slate-100 text-slate-700" },
  // Lab statuses
  active: { label: "稼働中", className: "bg-emerald-100 text-emerald-800" },
  suspended: { label: "停止中", className: "bg-amber-100 text-amber-800" },
  cancelled: { label: "解約済", className: "bg-red-100 text-red-800" },
  // Payment statuses
  paid: { label: "支払済", className: "bg-emerald-100 text-emerald-800" },
  unpaid: { label: "未払い", className: "bg-amber-100 text-amber-800" },
  error: { label: "エラー", className: "bg-red-100 text-red-800" },
  overdue: { label: "延滞", className: "bg-red-100 text-red-800" },
  // Monthly bill statuses
  "未発行": { label: "未発行", className: "bg-slate-100 text-slate-600" },
  "発行済み": { label: "発行済み", className: "bg-blue-100 text-blue-800" },
  "入金済み": { label: "入金済み", className: "bg-emerald-100 text-emerald-800" },
}

interface StatusBadgeProps {
  status: StatusVariant
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: String(status),
    className: "bg-slate-100 text-slate-700",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
