"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, FlaskConical, Stethoscope, Lock } from "lucide-react"
import Link from "next/link"

const ACCESS_CODE = "1234"

export function DebugTestEntryClient() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")

  const isCodeValid = code === ACCESS_CODE

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setCode(value)
    if (error) setError("")
  }

  const handleLabDemo = () => {
    if (!isCodeValid) {
      setError("コードが正しくありません")
      return
    }
    router.push("/lab/dashboard?test=true")
  }

  const handleClinicDemo = () => {
    if (!isCodeValid) {
      setError("コードが正しくありません")
      return
    }
    router.push("/clinic/dashboard?test=true")
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h1 className="mt-4 text-4xl font-bold text-red-600">テスト環境</h1>
          <p className="mt-2 text-slate-400">開発者専用 - このページは非公開です</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-300">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">アクセスコード（4桁）</span>
          </div>

          <input
            type="password"
            inputMode="numeric"
            value={code}
            onChange={handleCodeChange}
            placeholder="* * * *"
            maxLength={4}
            className="w-full px-4 py-3 text-center text-2xl tracking-widest font-mono bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-center text-slate-500 text-sm">デモモードで開始</p>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleLabDemo}
              disabled={!isCodeValid}
              className={`flex flex-col items-center gap-3 p-6 rounded-xl border transition-all ${
                isCodeValid
                  ? "bg-slate-800 border-slate-600 hover:border-blue-500 hover:bg-slate-700 cursor-pointer"
                  : "bg-slate-800/50 border-slate-700 cursor-not-allowed opacity-50"
              }`}
            >
              <FlaskConical className="h-8 w-8 text-slate-400" />
              <div className="text-center">
                <p className="font-medium text-white">技工所として確認</p>
                <p className="text-xs text-slate-500">案件・納品管理</p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleClinicDemo}
              disabled={!isCodeValid}
              className={`flex flex-col items-center gap-3 p-6 rounded-xl border transition-all ${
                isCodeValid
                  ? "bg-slate-800 border-slate-600 hover:border-blue-500 hover:bg-slate-700 cursor-pointer"
                  : "bg-slate-800/50 border-slate-700 cursor-not-allowed opacity-50"
              }`}
            >
              <Stethoscope className="h-8 w-8 text-slate-400" />
              <div className="text-center">
                <p className="font-medium text-white">医院として確認</p>
                <p className="text-xs text-slate-500">指示書作成</p>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-300 text-center">
            注意: テストモードではサンプルデータが表示されます。実際のデータベースには影響しません。
          </p>
        </div>

        <div className="text-center">
          <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm">
            ログイン画面に戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
