"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FlaskConical, Eye, EyeOff, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { completeSignupProvisioning } from "@/lib/auth/complete-signup-profile"

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [userType, setUserType] = useState<"lab" | "clinic" | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [contactName, setContactName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get("error")
    if (!q) return
    if (q === "auth_callback") {
      setError("メール認証リンクが無効か期限切れです。もう一度お試しください。")
    } else {
      setError(decodeURIComponent(q))
    }
  }, [])

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validation
    if (!userType) {
      setError("アカウントタイプを選択してください")
      setLoading(false)
      return
    }

    if (!companyName.trim()) {
      setError("会社名を入力してください")
      setLoading(false)
      return
    }

    if (!contactName.trim()) {
      setError("お名前を入力してください")
      setLoading(false)
      return
    }

    if (!phoneNumber.trim()) {
      setError("電話番号を入力してください")
      setLoading(false)
      return
    }

    if (!email.trim()) {
      setError("メールアドレスを入力してください")
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError("パスワードは8文字以上である必要があります")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("パスワードが一致しません")
      setLoading(false)
      return
    }

    if (!agreeToTerms) {
      setError("利用規約とプライバシーポリシーに同意してください")
      setLoading(false)
      return
    }

    try {
      const meta = {
        role: userType,
        user_type: userType,
        company_name: companyName.trim(),
        contact_name: contactName.trim(),
        display_name: contactName.trim(),
        phone: phoneNumber.trim(),
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: meta,
        },
      })

      if (authError) {
        const msg = authError.message.toLowerCase()
        if (
          msg.includes("already registered") ||
          msg.includes("user already registered") ||
          msg.includes("already been registered") ||
          msg.includes("already exists")
        ) {
          setError("このメールアドレスは既に登録されています")
        } else if (
          authError.message.includes("Invalid email") ||
          msg.includes("invalid email")
        ) {
          setError("無効なメールアドレスです")
        } else if (
          authError.message.includes("Password") ||
          msg.includes("password")
        ) {
          setError("パスワードが要件を満たしていません（8文字以上）")
        } else {
          setError(authError.message || "登録に失敗しました")
        }
        setLoading(false)
        return
      }

      if (!authData.user) {
        setError("アカウント作成に失敗しました")
        setLoading(false)
        return
      }

      const session = authData.session

      if (session) {
        const { error: provError } = await completeSignupProvisioning(
          supabase,
          authData.user
        )
        if (provError) {
          await supabase.auth.signOut()
          setError(
            `登録後のデータ保存に失敗しました。お手数ですが内容をご確認のうえ再度お試しください。（${provError}）`
          )
          setLoading(false)
          return
        }
      }

      setSuccess(true)
      setLoading(false)
    } catch (err) {
      console.error("Signup error:", err)
      setError("通信エラーが発生しました。しばらくしてから再度お試しください。")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a6cf0] flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
              <FlaskConical className="h-5 w-5 text-[#1a6cf0]" />
            </div>
            <span className="text-xl font-semibold text-white">FEETY</span>
          </div>
        </div>

        <div className="space-y-8">
          <h1 className="text-5xl font-bold text-white leading-tight">
            歯科技工指示書システム
          </h1>

          <p className="text-lg text-white/80">
            技工所と医院をシームレスに接続し、効率的な指示書管理を実現します。
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-green-400/30 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
              <div>
                <div className="font-semibold text-white">安心の運用サポート</div>
                <div className="text-sm text-white/70">操作方法など、お困りごとはいつでもご相談ください</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-green-400/30 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
              <div>
                <div className="font-semibold text-white">セキュアなデータ管理</div>
                <div className="text-sm text-white/70">ご利用の情報は厳重に保護されます</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-green-400/30 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
              <div>
                <div className="font-semibold text-white">無料トライアル</div>
                <div className="text-sm text-white/70">契約不要でお気軽にお試しいただけます</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/50">Powered by FEETY</p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {success ? (
            // Success Message
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">登録が完了しました</h2>
              <p className="mb-6 text-gray-600">
                確認メールを送信しました。<br />
                メール内のリンクをクリックして認証を完了してください。
              </p>
              <p className="mb-8 text-sm text-gray-500">
                メールが届かない場合は、迷惑メールフォルダをご確認ください。
              </p>
              <Link
                href="/login"
                className="inline-block rounded-lg bg-[#1a6cf0] px-6 py-3 font-semibold text-white hover:bg-[#0052cc]"
              >
                ログインページへ
              </Link>
            </div>
          ) : (
            // Registration Form
            <>
              <h2 className="mb-2 text-4xl font-bold">新規登録</h2>
              <p className="mb-8 text-gray-600">FEETYを始めましょう</p>

              <form onSubmit={handleSignup} className="space-y-6">
                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700 font-medium">
                    {error}
                  </div>
                )}

            <div>
              <label className="mb-3 block text-sm font-medium">アカウントタイプ</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("lab")}
                  className={`rounded-lg border-2 p-4 text-center transition ${
                    userType === "lab"
                      ? "border-[#1a6cf0] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="mb-2 text-2xl">🧪</div>
                  <div className="font-semibold">技工所</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("clinic")}
                  className={`rounded-lg border-2 p-4 text-center transition ${
                    userType === "clinic"
                      ? "border-[#1a6cf0] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="mb-2 text-2xl">🏥</div>
                  <div className="font-semibold">医院</div>
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">会社名</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a6cf0]/50"
                placeholder="会社名を入力"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">お名前</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a6cf0]/50"
                placeholder="お名前を入力"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">電話番号</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a6cf0]/50"
                placeholder="電話番号を入力"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a6cf0]/50"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">パスワード</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#1a6cf0]/50"
                  placeholder="8文字以上"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">パスワード確認</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#1a6cf0]/50"
                  placeholder="パスワード確認"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                <Link
                  href="/legal/terms"
                  className="text-[#1a6cf0] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  利用規約
                </Link>
                および
                <Link
                  href="/legal/tokushoho"
                  className="text-[#1a6cf0] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  特定商取引法に基づく表記
                </Link>
                に同意します
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#1a6cf0] py-3 font-semibold text-white hover:bg-[#0052cc] disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  アカウント作成中...
                </div>
              ) : (
                "アカウント作成"
              )}
            </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                アカウントをお持ちですか？{" "}
                <Link href="/login" className="text-[#1a6cf0] hover:underline">
                  ログイン
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
