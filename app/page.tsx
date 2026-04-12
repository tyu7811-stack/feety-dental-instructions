import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, FlaskConical, FileText, Shield, Sparkles } from "lucide-react"
import {
  RolePersonaCards,
  RolePersonaCompactIntro,
} from "@/components/marketing/role-persona-marketing"
import { feetyAppUrl } from "@/lib/feety-app-origin"

export const metadata: Metadata = {
  title: "FEETY | 歯科技工指示書クラウド",
  description:
    "FEETYは、歯科医院と技工所をつなぎ、技工指示書の作成から納品管理までを一元化するクラウドサービスです。",
}

const features = [
  {
    icon: FileText,
    title: "指示書をクラウドで共有",
    description:
      "作成・修正・履歴をオンラインで管理。紙やFAXに頼らず、ミスを減らしてやり取りをスムーズにします。",
  },
  {
    icon: Shield,
    title: "安全なデータ管理",
    description:
      "医療・患者に関わる情報を扱う前提で、アクセス制御と通信の保護に配慮した設計です。",
  },
  {
    icon: Sparkles,
    title: "医院・技工所の両方から利用",
    description:
      "医院側は指示書の作成、技工所側は案件・納品の管理。それぞれの業務に合わせた画面で利用できます。",
  },
] as const

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href={feetyAppUrl("/")} className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1a6cf0] text-white">
              <FlaskConical className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-lg">FEETY</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href={feetyAppUrl("/plans")}
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:inline-flex"
            >
              料金・プラン
            </Link>
            <Link
              href={feetyAppUrl("/login")}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              ログイン
            </Link>
            <Link
              href={feetyAppUrl("/signup2")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1a6cf0] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1559cc]"
            >
              新規登録
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-[#1a6cf0]/[0.07] to-background px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1a6cf0]/25 bg-[#1a6cf0]/10 px-3 py-1 text-xs font-medium text-[#1a6cf0]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              歯科技工指示書クラウド
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl">
              医院と技工所をつなぐ、
              <span className="text-[#1a6cf0]">FEETY</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              技工指示書のデジタル化から、案件・納品の管理まで。FEETYは、日々の連携をシンプルにするための公式サイトとサービスです。
            </p>
            <div className="mt-4">
              <RolePersonaCompactIntro layout="hero" />
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={feetyAppUrl("/signup2")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a6cf0] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#1a6cf0]/25 transition-all hover:bg-[#1559cc] active:scale-[0.98]"
              >
                無料で始める
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={feetyAppUrl("/login")}
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3.5 text-base font-semibold shadow-sm transition-colors hover:bg-accent"
              >
                ログイン
              </Link>
            </div>
            <div className="mt-14">
              <RolePersonaCards layout="hero" />
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              FEETYでできること
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              技工指示書に関する業務を、クラウド上でまとめて扱えます。
            </p>
            <ul className="mt-12 grid gap-6 sm:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <li
                  key={title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a6cf0]/10 text-[#1a6cf0]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-border bg-muted/40 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              デモで画面を確認できます
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              アカウントがなくても、医院向け・技工所向けの画面をデモで開けます。
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={feetyAppUrl("/clinic/orders/new?demo=true")}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-card px-6 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-accent"
              >
                医院：新規指示書（デモ）
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={feetyAppUrl("/lab/dashboard?demo=true")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1a6cf0] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#1559cc]"
              >
                技工所：ダッシュボード（デモ）
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FlaskConical className="h-4 w-4 text-[#1a6cf0]" aria-hidden />
            FEETY
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href={feetyAppUrl("/legal/terms")} className="hover:text-foreground">
              利用規約
            </Link>
            <Link href={feetyAppUrl("/legal/privacy")} className="hover:text-foreground">
              プライバシーポリシー
            </Link>
            <Link href={feetyAppUrl("/legal/tokushoho")} className="hover:text-foreground">
              特定商取引法に基づく表記
            </Link>
            <Link href={feetyAppUrl("/plans")} className="hover:text-foreground">
              料金・プラン
            </Link>
          </div>
          <div className="text-center text-xs text-muted-foreground sm:text-right space-y-1">
            <p>販売者・問い合わせ窓口：ナチュラルアート</p>
            <p>
              <a href="mailto:tyu66457@gmail.com" className="hover:text-foreground underline-offset-2 hover:underline">
                tyu66457@gmail.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
