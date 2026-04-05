"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { UserPlus, Search, Mail, Building2, FlaskConical, Clock, CheckCircle } from "lucide-react"

type UserProfile = {
  id: string
  email: string
  display_name: string | null
  role: string
  created_at: string
  status?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function loadUsers() {
      setIsLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading users:", error)
      } else {
        setUsers(data || [])
      }
      setIsLoading(false)
    }
    loadUsers()
  }, [])

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "lab":
        return <FlaskConical className="h-4 w-4 text-blue-600" />
      case "clinic":
        return <Building2 className="h-4 w-4 text-green-600" />
      default:
        return <UserPlus className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case "lab":
        return "技工所"
      case "clinic":
        return "歯科医院"
      case "admin":
        return "管理者"
      default:
        return role || "未設定"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">新規ユーザー管理</h1>
        <p className="text-muted-foreground">登録されたユーザーの一覧と管理</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="メールアドレスまたは名前で検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            ユーザーが見つかりません
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs font-semibold text-muted-foreground">
                <th className="px-6 py-3">ユーザー</th>
                <th className="px-6 py-3">ロール</th>
                <th className="px-6 py-3">ステータス</th>
                <th className="px-6 py-3">登録日</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {user.display_name || "名前未設定"}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <span className="text-sm">{getRoleName(user.role)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                      <CheckCircle className="h-3 w-3" />
                      アクティブ
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(user.created_at).toLocaleDateString("ja-JP")}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">総ユーザー数</p>
          <p className="mt-1 text-2xl font-bold">{users.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">技工所</p>
          <p className="mt-1 text-2xl font-bold">{users.filter(u => u.role === "lab").length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">歯科医院</p>
          <p className="mt-1 text-2xl font-bold">{users.filter(u => u.role === "clinic").length}</p>
        </div>
      </div>
    </div>
  )
}
