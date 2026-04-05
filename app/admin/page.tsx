"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Profile = {
  id: string
  email: string | null
  role: string | null
  company_name: string | null
  contact_name: string | null
  phone: string | null
  created_at: string | null
}

export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfiles() {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setProfiles(data || [])
      }
      setLoading(false)
    }

    fetchProfiles()
  }, [])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRoleLabel = (role: string | null) => {
    if (role === "lab") return "技工所"
    if (role === "clinic") return "医院"
    return role || "-"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ユーザー管理</h1>
          <p className="mt-2 text-gray-600">登録ユーザー一覧（最新順）</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">読み込み中...</span>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-semibold">エラーが発生しました</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-500">登録ユーザーはまだいません</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">会社名</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">氏名</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">メールアドレス</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ロール</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">登録日時</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {profile.company_name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {profile.contact_name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {profile.email || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          profile.role === "lab"
                            ? "bg-blue-100 text-blue-700"
                            : profile.role === "clinic"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {getRoleLabel(profile.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(profile.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
              <p className="text-sm text-gray-600">全 {profiles.length} 件</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
