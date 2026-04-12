"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, CheckCircle, Building2, User, Mail, Phone, MessageSquare, Download } from "lucide-react"
import { feetyAppUrl } from "@/lib/feety-app-origin"

export default function RequestDocumentPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    companyType: "",
    companyName: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // デモ用：実際はAPIに送信
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="mx-auto max-w-4xl flex items-center justify-between px-4 py-4">
            <Link href={feetyAppUrl("/")} className="flex items-center gap-2 text-primary font-bold text-lg">
              <FileText className="h-5 w-5" />
              FEETY
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 py-16">
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">
                資料請求を受け付けました
              </h1>
              <p className="text-muted-foreground">
                以下から資料をダウンロードいただけます
              </p>
            </div>

            {/* Download Section */}
            <div className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Download className="h-5 w-5 text-emerald-600" />
                資料ダウンロード
              </h2>
              <div className="space-y-3">
                <a
                  href={feetyAppUrl("/documents/system-overview.html")}
                  download="システム概要資料.html"
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-white p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">システム概要資料</p>
                      <p className="text-xs text-muted-foreground">機能紹介、導入メリット、画面イメージ</p>
                    </div>
                  </div>
                  <Download className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
                <a
                  href={feetyAppUrl("/documents/pricing-details.html")}
                  download="料金プラン詳細資料.html"
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-white p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">料金プラン詳細資料</p>
                      <p className="text-xs text-muted-foreground">各プランの機能比較、オプション料金</p>
                    </div>
                  </div>
                  <Download className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
                <a
                  href={feetyAppUrl("/documents/case-studies.html")}
                  download="導入事例集.html"
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-white p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">導入事例集</p>
                      <p className="text-xs text-muted-foreground">実際の導入企業の声、効果実績</p>
                    </div>
                  </div>
                  <Download className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={feetyAppUrl("/plans")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                プラン詳細に戻る
              </Link>
              <Link
                href={feetyAppUrl("/")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                トップページへ
              </Link>
            </div>
          </div>
        </main>

        <footer className="border-t border-border bg-muted/30 mt-12">
          <div className="mx-auto max-w-4xl px-4 py-6 text-center text-xs text-muted-foreground">
            <p>販売者・問い合わせ窓口：ナチュラルアート</p>
            <p className="mt-1">
              <a href="mailto:tyu66457@gmail.com" className="hover:text-foreground underline-offset-2 hover:underline">
                tyu66457@gmail.com
              </a>
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
              <Link href={feetyAppUrl("/legal/terms")} className="hover:text-foreground">
                利用規約
              </Link>
              <Link href={feetyAppUrl("/legal/tokushoho")} className="hover:text-foreground">
                特定商取引法に基づく表記
              </Link>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-4 py-4">
          <Link href={feetyAppUrl("/")} className="flex items-center gap-2 text-primary font-bold text-lg">
            <FileText className="h-5 w-5" />
            FEETY
          </Link>
          <Link
            href={feetyAppUrl("/plans")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            プラン詳細に戻る
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-12">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            資料請求
          </h1>
          <p className="mt-2 text-muted-foreground">
            FEETY（歯科技工指示書クラウド）の詳細資料をお送りします
          </p>
        </div>

        {/* What you get */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4">お届けする資料</h2>
          <div className="grid gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">システム概要資料（PDF）</p>
                <p className="text-xs text-muted-foreground">機能紹介、導入メリット、画面イメージ</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">料金プラン詳細資料（PDF）</p>
                <p className="text-xs text-muted-foreground">各プランの機能比較、オプション料金</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">導入事例集（PDF）</p>
                <p className="text-xs text-muted-foreground">実際の導入企業の声、効果実績</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-6">お客様情報</h2>
          
          <div className="space-y-5">
            {/* Company Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                業種 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="companyType"
                    value="lab"
                    checked={formData.companyType === "lab"}
                    onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
                    className="h-4 w-4 text-primary"
                    required
                  />
                  <span className="text-sm text-foreground">歯科技工所</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="companyType"
                    value="clinic"
                    checked={formData.companyType === "clinic"}
                    onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
                    className="h-4 w-4 text-primary"
                  />
                  <span className="text-sm text-foreground">歯科医院</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="companyType"
                    value="other"
                    checked={formData.companyType === "other"}
                    onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
                    className="h-4 w-4 text-primary"
                  />
                  <span className="text-sm text-foreground">その他</span>
                </label>
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Building2 className="inline h-4 w-4 mr-1" />
                会社名・医院名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="例：山田歯科技工所"
                required
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <User className="inline h-4 w-4 mr-1" />
                お名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="例：山田 太郎"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="例：contact@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                電話番号
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="例：03-1234-5678"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <MessageSquare className="inline h-4 w-4 mr-1" />
                ご質問・ご要望
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                placeholder="ご質問やご要望がございましたらご記入ください"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              資料を請求する
            </button>
            <p className="mt-3 text-xs text-center text-muted-foreground">
              ご入力いただいた情報は資料送付およびお問い合わせ対応のみに使用いたします
            </p>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-16">
        <div className="mx-auto max-w-4xl px-4 py-6 text-center text-xs text-muted-foreground">
          <p>販売者・問い合わせ窓口：ナチュラルアート</p>
          <p className="mt-1">
            <a href="mailto:tyu66457@gmail.com" className="hover:text-foreground underline-offset-2 hover:underline">
              tyu66457@gmail.com
            </a>
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href={feetyAppUrl("/legal/terms")} className="hover:text-foreground">
              利用規約
            </Link>
            <Link href={feetyAppUrl("/legal/tokushoho")} className="hover:text-foreground">
              特定商取引法に基づく表記
            </Link>
            <Link href={feetyAppUrl("/plans")} className="hover:text-foreground">
              料金・プラン
            </Link>
          </div>
          <p className="mt-3">© 2026 FEETY. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
