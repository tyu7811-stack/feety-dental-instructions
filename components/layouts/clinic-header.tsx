"use client"

import { Suspense } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { ClipboardPlus, History, LogOut, Stethoscope, BarChart2 } from "lucide-react"

const navItems = [
  { href: "/clinic/orders/new", label: "新規指示書", icon: ClipboardPlus },
  { href: "/clinic/dashboard", label: "指示書履歴", icon: History },
  { href: "/clinic/analytics", label: "高度な分析", icon: BarChart2 },
]

export function ClinicHeader() {
  return (
    <Suspense fallback={<ClinicHeaderSkeleton />}>
      <ClinicHeaderContent />
    </Suspense>
  )
}

function ClinicHeaderSkeleton() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Stethoscope className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground">あおぞら歯科</span>
        </div>
        <div className="h-9 w-64 animate-pulse rounded-lg bg-muted" />
      </div>
    </header>
  )
}

function ClinicHeaderContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // デモモードのクエリパラメータを保持
  const demoParam = searchParams.get("demo") === "true" ? "?demo=true" : ""

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Stethoscope className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground">あおぞら歯科</span>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={`${item.href}${demoParam}`}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
          <Link
            href="/"
            className="ml-2 flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-bold text-foreground shadow-sm transition-all hover:bg-destructive hover:text-white hover:border-destructive active:scale-[0.97]"
          >
            <LogOut className="h-4 w-4" />
            <span>ログアウト</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
