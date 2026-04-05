"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  CalendarCheck,
  Users,
  DollarSign,
  LogOut,
  FlaskConical,
  Menu,
  X,
  BarChart2,
  Scale,
  ScrollText,
  CreditCard,
} from "lucide-react"

const navItems = [
  { href: "/lab/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/lab/cases", label: "案件管理", icon: ClipboardList },
  { href: "/lab/documents", label: "書類管理", icon: FileText },
  { href: "/lab/monthly-billing", label: "締め処理", icon: CalendarCheck },
  { href: "/lab/clinics", label: "提携医院管理", icon: Users },
  { href: "/lab/price-master", label: "金額マスタ", icon: DollarSign },
  { href: "/lab/analytics", label: "高度な分析", icon: BarChart2 },
  { href: "/lab/billing", label: "プラン・お支払い", icon: CreditCard },
]

export function LabSidebar() {
  return (
    <Suspense fallback={<LabSidebarSkeleton />}>
      <LabSidebarContent />
    </Suspense>
  )
}

function LabSidebarSkeleton() {
  return (
    <>
      <header className="flex items-center justify-between bg-sidebar px-4 py-3 text-sidebar-foreground lg:hidden">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5" />
          <span className="text-sm font-semibold">山田デンタルラボ</span>
        </div>
      </header>
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:block">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent">
              <FlaskConical className="h-5 w-5 text-sidebar-primary" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight">山田デンタルラボ</p>
              <p className="text-xs text-sidebar-foreground/60">技工所管理画面</p>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <div key={item.href} className="h-10 animate-pulse rounded-lg bg-sidebar-accent/50" />
              ))}
            </div>
          </nav>
        </div>
      </aside>
    </>
  )
}

function LabSidebarContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  
  // デモ／テスト用クエリをサイドバー遷移でも維持（ミドルウェアの demo / test バイパスとデータ表示の整合用）
  const isTestMode = searchParams.get("test") === "true"
  const labNavQuery = (() => {
    const p = new URLSearchParams()
    if (searchParams.get("demo") === "true") p.set("demo", "true")
    if (searchParams.get("test") === "true") p.set("test", "true")
    const s = p.toString()
    return s ? `?${s}` : ""
  })()

  return (
    <>
      {/* Mobile header */}
      <header className="flex items-center justify-between bg-sidebar px-4 py-3 text-sidebar-foreground lg:hidden">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5" />
          <span className="text-sm font-semibold">山田デンタルラボ</span>
          {isTestMode && (
            <span className="ml-2 rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
              TEST
            </span>
          )}
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-1.5 hover:bg-sidebar-accent"
          aria-label="メニュー切替"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent">
            <FlaskConical className="h-5 w-5 text-sidebar-primary" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight">山田デンタルラボ</p>
            <p className="text-xs text-sidebar-foreground/60">技工所管理画面</p>
          </div>
          {isTestMode && (
            <span className="ml-auto rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
              TEST
            </span>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={`${item.href}${labNavQuery}`}
                prefetch={false}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border px-3 py-4 space-y-1">
          <Link
            href="/legal/terms"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <ScrollText className="h-3.5 w-3.5" />
            利用規約
          </Link>
          <Link
            href="/legal/tokushoho"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <Scale className="h-3.5 w-3.5" />
            特定商取引法に基づく表記
          </Link>
          <Link
            href="/auth/logout"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" />
            ログアウト
          </Link>
        </div>
      </aside>
    </>
  )
}
