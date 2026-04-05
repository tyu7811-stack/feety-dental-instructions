"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  UserPlus,
  Building2,
  CreditCard,
  Archive,
  Shield,
  LogOut,
} from "lucide-react"

const menuItems = [
  { id: "1", label: "ダッシュボード", href: "/admin", icon: LayoutDashboard },
  { id: "2", label: "新規ユーザー管理", href: "/admin/users", icon: UserPlus },
  { id: "3", label: "技工所管理", href: "/admin/labs", icon: Building2 },
  { id: "4", label: "決済・振込管理", href: "/admin/billing", icon: CreditCard },
  { id: "5", label: "帳票アーカイブ", href: "/admin/archive", icon: Archive },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col bg-[#0f172a] text-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold">管理者パネル</p>
          <p className="text-xs text-white/60">システム管理</p>
        </div>
      </div>

      {/* Navigation - 5 items only */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer Navigation */}
      <div className="border-t border-white/10 p-3">
        <Link
          href="/auth/logout"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>ログアウト</span>
        </Link>
      </div>
    </aside>
  )
}
