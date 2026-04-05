"use client"

import { useState } from "react"
import Link from "next/link"
import type { AdminLabDetail } from "@/lib/admin/queries"
import { formatDateTime } from "@/lib/mock-data"
import {
  ArrowLeft,
  Download,
  RotateCcw,
  KeyRound,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react"

export function AdminLabDetailClient({ detail }: { detail: AdminLabDetail }) {
  const { lab, clinics, cases } = detail
  const [showConfirm, setShowConfirm] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <Link
        href="/admin/labs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        技工所一覧に戻る
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">{lab.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {lab.contact_name ?? "—"} / {lab.phone ?? "—"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <InfoCard
          label="登録日"
          value={lab.created_at ? formatDateTime(lab.created_at) : "—"}
        />
        <InfoCard label="提携医院数" value={`${clinics.length} 医院`} />
        <InfoCard label="案件数（直近100件）" value={`${cases.length} 件`} />
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 text-base font-semibold text-card-foreground">
          データ再現・バックアップ
        </h2>
        <p className="mb-3 text-xs text-muted-foreground">
          以下は UI のみです。実処理は今後 API と連携してください。
        </p>
        <div className="flex flex-wrap gap-3">
          <ActionButton
            icon={<Download className="h-4 w-4" />}
            label="全データ一括ダウンロード"
            description="指示書・納品書・請求書PDFをパッケージ化"
            onClick={() => setShowConfirm("download")}
          />
          <ActionButton
            icon={<RotateCcw className="h-4 w-4" />}
            label="代理締め処理"
            description="月末集計を管理者が代行実行"
            onClick={() => setShowConfirm("proxy-billing")}
            variant="warning"
          />
          <ActionButton
            icon={<KeyRound className="h-4 w-4" />}
            label="アカウント初期化・再発行"
            description="新しいログイン情報を生成"
            onClick={() => setShowConfirm("reset-account")}
            variant="danger"
          />
        </div>
      </section>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
            <h3 className="text-base font-semibold text-card-foreground">
              操作の確認
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {showConfirm === "download" &&
                "この技工所の全データを一括ダウンロードします。よろしいですか？"}
              {showConfirm === "proxy-billing" &&
                "管理者として代理締め処理を実行します。この操作は取り消せません。"}
              {showConfirm === "reset-account" &&
                "アカウントを初期化し、新しいログイン情報を発行します。"}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(null)}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-semibold text-card-foreground">
            提携医院リスト
          </h2>
        </div>
        <div className="space-y-2">
          {clinics.map((clinic) => {
            const forClinic = cases.filter((c) => c.clinic_id === clinic.id)
            const activeForClinic = forClinic.filter(
              (c) => c.status !== "納品済み" && c.status !== "完成"
            )

            return (
              <div
                key={clinic.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{clinic.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {clinic.doctor_name ?? "—"} /{" "}
                    {clinic.email ?? clinic.phone ?? "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {activeForClinic.length > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                      <Clock className="h-3 w-3" />
                      進行中 {activeForClinic.length} 件
                    </span>
                  ) : forClinic.length > 0 ? (
                    <span className="text-xs text-muted-foreground">
                      全 {forClinic.length} 件（完了含む）
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3" />
                      案件なし
                    </span>
                  )}
                </div>
              </div>
            )
          })}
          {clinics.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              提携医院はありません
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-card-foreground">{value}</p>
    </div>
  )
}

function ActionButton({
  icon,
  label,
  description,
  onClick,
  variant = "default",
}: {
  icon: React.ReactNode
  label: string
  description: string
  onClick: () => void
  variant?: "default" | "warning" | "danger"
}) {
  const variantClasses = {
    default: "border-border hover:bg-accent",
    warning: "border-amber-200 bg-amber-50 hover:bg-amber-100",
    danger: "border-red-200 bg-red-50 hover:bg-red-100",
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${variantClasses[variant]}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </button>
  )
}
