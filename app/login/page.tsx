"use client"

import { useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { FlaskConical, Stethoscope, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { waitUntilSupabaseAuthCookiesVisible } from "@/lib/supabase/wait-auth-cookies"
import Link from "next/link"

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"lab" | "clinic" | null>(null)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSubmitted(true)
    setIsLoading(true)

    try {
      if (!selectedRole) {
        setError("アカウントタイプを選択してください")
        setIsLoading(false)
        return
      }

      if (!email.trim() || !password.trim()) {
        setError("メールアドレスとパスワードを入力してください")
        setIsLoading(false)
        return
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("メールアドレスまたはパスワードが正しくありません")
        } else {
          setError("ログインに失敗しました")
        }
        setIsLoading(false)
        return
      }

      if (!data.user) {
        setError("ログインに失敗しました")
        setIsLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle()

      const registeredRole =
        profile?.role ??
        (data.user.user_metadata?.role as string | undefined) ??
        (data.user.user_metadata?.user_type as string | undefined)

      let destination = "/lab/dashboard"
      if (registeredRole === "admin") {
        destination = "/admin"
      } else if (registeredRole === "lab") {
        if (selectedRole === "clinic") {
          setError(
            "このアカウントは技工所です。ログイン画面で「技工所」を選んでください。"
          )
          await supabase.auth.signOut()
          setIsLoading(false)
          return
        }
        destination = "/lab/dashboard"
      } else if (registeredRole === "clinic") {
        if (selectedRole === "lab") {
          setError(
            "このアカウントは歯科医院です。ログイン画面で「歯科医院」を選んでください。"
          )
          await supabase.auth.signOut()
          setIsLoading(false)
          return
        }
        destination = "/clinic/dashboard"
      } else {
        destination =
          selectedRole === "lab" ? "/lab/dashboard" : "/clinic/dashboard"
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""

      await supabase.auth.getSession()

      const sessionDeadline = Date.now() + 8000
      let session: Session | null = null
      while (Date.now() < sessionDeadline) {
        const { data: s, error: sessionError } =
          await supabase.auth.getSession()
        if (sessionError) {
          if (process.env.NODE_ENV === "development") {
            console.warn("[login] getSession while waiting:", sessionError.message)
          }
        } else if (s.session) {
          session = s.session
          break
        }
        await new Promise((r) => setTimeout(r, 100))
      }

      if (!session) {
        setError(
          "セッションを確立できませんでした。Cookie がブロックされていないか確認し、再度お試しください。"
        )
        setIsLoading(false)
        return
      }

      const cookieWait = await waitUntilSupabaseAuthCookiesVisible({
        supabaseUrl,
        maxMs: 8000,
        pollMs: 60,
      })
      if (!cookieWait.ok) {
        setError(
          "ブラウザにセッションを保存できませんでした。Cookie を許可してから再度ログインしてください。"
        )
        setIsLoading(false)
        return
      }

      const { data: beforeNavigate } = await supabase.auth.getSession()
      if (!beforeNavigate.session) {
        setError("セッションの確認に失敗しました。再度お試しください。")
        setIsLoading(false)
        return
      }

      // router.push ではなくフルリロードし、次リクエストで Cookie を必ず送る
      window.location.assign(destination)
      return
    } catch {
      setError("予期せぬエラーが発生しました")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a6cf0] flex-col justify-between p-12">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-lg outline-offset-4 transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
              <FlaskConical className="h-5 w-5 text-[#1a6cf0]" />
            </div>
            <span className="text-xl font-semibold text-white">FEETY</span>
          </Link>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-white text-balance">
            技工指示書の<br />デジタル化で<br />業務を効率化
          </h1>
          <p className="text-lg text-white/70 max-w-md">
            歯科医院と技工所をつなぐプラットフォーム。
            指示書の作成から納品管理まで一元化。
          </p>
        </div>

        <div>
          <p className="text-sm text-white/50">Powered by FEETY</p>
          <Link
            href="/admin-auth"
            className="mt-3 inline-block text-xs text-white/30 hover:text-white/50 transition-colors"
          >
            オーナー管理者
          </Link>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-background">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden mb-10">
            <Link href="/" className="inline-flex items-center gap-3 outline-offset-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground">
                <FlaskConical className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold">FEETY</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">ログイン</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              アカウント情報を入力してください
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="mb-3 block text-sm font-medium">
                アカウントタイプ
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setSelectedRole("lab"); setError("") }}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-lg border-2 px-4 py-5 transition-all",
                    selectedRole === "lab"
                      ? "border-[#1a6cf0] bg-[#1a6cf0]/5"
                      : submitted && !selectedRole
                        ? "border-destructive/50"
                        : "border-border hover:border-[#1a6cf0]/40 hover:bg-accent"
                  )}
                >
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                    selectedRole === "lab" ? "bg-[#1a6cf0]" : "bg-muted"
                  )}>
                    <FlaskConical className={cn(
                      "h-6 w-6",
                      selectedRole === "lab" ? "text-white" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="text-center">
                    <span className={cn(
                      "block text-sm font-semibold",
                      selectedRole === "lab" ? "text-[#1a6cf0]" : "text-foreground/80"
                    )}>技工所</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      案件・納品管理
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { setSelectedRole("clinic"); setError("") }}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-lg border-2 px-4 py-5 transition-all",
                    selectedRole === "clinic"
                      ? "border-[#1a6cf0] bg-[#1a6cf0]/5"
                      : submitted && !selectedRole
                        ? "border-destructive/50"
                        : "border-border hover:border-[#1a6cf0]/40 hover:bg-accent"
                  )}
                >
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                    selectedRole === "clinic" ? "bg-[#1a6cf0]" : "bg-muted"
                  )}>
                    <Stethoscope className={cn(
                      "h-6 w-6",
                      selectedRole === "clinic" ? "text-white" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="text-center">
                    <span className={cn(
                      "block text-sm font-semibold",
                      selectedRole === "clinic" ? "text-[#1a6cf0]" : "text-foreground/80"
                    )}>歯科医院</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      指示書作成
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@dental.jp"
                autoComplete="email"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                パスワード
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a6cf0] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1559cc] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  ログイン中...
                </>
              ) : (
                <>
                  ログイン
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            アカウントをお持ちでない方は
            <Link href="/signup2" className="ml-1 text-[#1a6cf0] font-semibold hover:underline">
              こちらから登録
            </Link>
          </p>

          <div className="mt-6 rounded-lg border border-border bg-card p-4 space-y-3">
            <p className="text-sm font-semibold text-foreground">
              ログインなしで画面確認
            </p>
            <p className="text-xs text-muted-foreground">
              歯科医院向けは新規指示書、技工所向けはダッシュボードのデモです（送信などは失敗する場合があります）。
            </p>
            <Link
              href="/clinic/orders/new?demo=true"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-all hover:bg-accent active:scale-[0.98]"
            >
              <Stethoscope className="h-4 w-4" />
              歯科医院：新規技工指示書（デモ）
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/lab/dashboard?demo=true"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a6cf0] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1559cc] active:scale-[0.98]"
            >
              <FlaskConical className="h-4 w-4" />
              技工所：ダッシュボード（デモ）
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            ログインすることで、利用規約およびプライバシーポリシーに同意したものとみなされます
          </p>
        </div>
      </div>
    </div>
  )
}
