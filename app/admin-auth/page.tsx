"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FlaskConical, Lock, Eye, EyeOff, Loader2 } from "lucide-react"

// 管理者パスワード（直接設定）
// 変更する場合はここを編集してください
const ADMIN_PASSWORD = "admin123"

export default function AdminAuthPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!password.trim()) {
      setError("パスワードを入力してください")
      setIsLoading(false)
      return
    }

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authenticated", "true")
      router.push("/admin")
    } else {
      setError("パスワードが正しくありません")
      setPassword("")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a6cf0] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
            <FlaskConical className="h-5 w-5 text-[#1a6cf0]" />
          </div>
          <span className="text-xl font-semibold text-white">FEETY</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-white text-balance">
            管理者専用<br />アクセス
          </h1>
          <p className="text-lg text-white/70 max-w-md">
            セキュリティ保護のため、管理者専用パスワードを入力してください。
          </p>
        </div>

        <p className="text-sm text-white/50">Powered by FEETY</p>
      </div>

      {/* Right Panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <h2 className="mb-2 text-4xl font-bold">パスワード入力</h2>
          <p className="mb-8 text-gray-600">管理者専用認証</p>

          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="管理者パスワード"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6cf0]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#1a6cf0] py-3 text-sm font-semibold text-white hover:bg-[#0052cc] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />認証中...</>
              ) : (
                <><Lock className="h-4 w-4" />アクセスする</>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500">このページは管理者専用です</p>
        </div>
      </div>
    </div>
  )
}
