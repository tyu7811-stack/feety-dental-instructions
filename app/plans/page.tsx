import type { Metadata } from "next"
import Link from "next/link"
import { Check, Sparkles, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  RolePersonaCards,
  RolePersonaCompactIntro,
} from "@/components/marketing/role-persona-marketing"
import { feetyAppUrl } from "@/lib/feety-app-origin"
import { labPlansMarketing } from "@/lib/content/lab-plans"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "料金・プラン",
  description:
    "FEETY 技工所向けプラン（フリー・ライト・スタンダード・プロ）の料金と機能一覧です。",
}

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
          <Link
            href={feetyAppUrl("/")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            ホームへ戻る
          </Link>
          <div className="text-right text-xs text-muted-foreground">
            <p>販売者・問い合わせ窓口：ナチュラルアート</p>
            <a href="mailto:tyu66457@gmail.com" className="hover:text-foreground underline-offset-2 hover:underline">
              tyu66457@gmail.com
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            料金・プラン
          </h1>
          <p className="mt-3 text-muted-foreground">
            FEETY（歯科技工指示書クラウド）の料金プランをご確認ください
          </p>
        </div>

        <h2 className="text-center text-xl font-bold tracking-tight text-foreground mb-2">
          技工所様向けプラン
        </h2>
        <p className="text-center text-sm text-muted-foreground mb-10 max-w-2xl mx-auto">
          有料プランの表示価格は税別です。消費税は法令に従い別途ご請求いたします。
        </p>

        <p className="text-center text-sm text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
          有料プランのお支払いは、
          <Link href={feetyAppUrl("/signup2")} className="text-primary underline-offset-2 hover:underline">
            技工所の新規登録
          </Link>
          後にログインし、
          <Link href={feetyAppUrl("/lab/billing")} className="text-primary underline-offset-2 hover:underline">
            プラン・お支払い
          </Link>
          から Stripe Checkout（クレジットカード）でまとめてお手続きください。
        </p>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-20">
          {labPlansMarketing.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl border-2 overflow-hidden transition-transform hover:scale-[1.02]",
                plan.id === "free" && "bg-emerald-50 border-emerald-300",
                plan.id === "lite" && "bg-slate-100 border-slate-300",
                plan.id === "standard" && "bg-blue-50 border-blue-400",
                plan.id === "professional" && "bg-amber-50 border-amber-400",
                plan.popular && "ring-2 ring-foreground ring-offset-2"
              )}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-foreground text-background text-xs font-bold px-2.5 py-1 rounded-full">
                  人気
                </div>
              )}

              <div
                className={cn(
                  "px-6 py-5 text-white",
                  plan.id === "free" && "bg-emerald-700",
                  plan.id === "lite" && "bg-slate-600",
                  plan.id === "standard" && "bg-primary",
                  plan.id === "professional" && "bg-amber-600"
                )}
              >
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <p className="text-sm opacity-90 mt-1">{plan.description}</p>
              </div>

              <div className="px-6 py-6 border-b border-border/50 bg-white/50">
                <div className="flex flex-wrap items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">{plan.priceDisplay}</span>
                  <span className="text-sm text-muted-foreground">{plan.priceNote}</span>
                </div>
              </div>

              <div className="px-6 py-6 bg-white/30">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-6 py-5 bg-white/50">
                {plan.id !== "free" && (
                  <p className="mb-3 text-xs text-muted-foreground leading-relaxed">
                    お支払い前に、
                    <Link href={feetyAppUrl("/legal/terms")} className="text-primary underline hover:no-underline">
                      利用規約
                    </Link>
                    、
                    <Link href={feetyAppUrl("/legal/privacy")} className="text-primary underline hover:no-underline">
                      プライバシーポリシー
                    </Link>
                    および
                    <Link href={feetyAppUrl("/legal/tokushoho")} className="text-primary underline hover:no-underline">
                      特定商取引法に基づく表記
                    </Link>
                    を必ずご確認ください。
                  </p>
                )}
                <Link
                  href={feetyAppUrl("/signup2")}
                  className={cn(
                    "flex w-full items-center justify-center rounded-lg py-2.5 text-sm font-semibold transition-colors",
                    plan.popular
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : plan.id === "free"
                        ? "bg-foreground/10 text-foreground hover:bg-foreground/20"
                        : "border-2 border-foreground bg-white text-foreground hover:bg-muted/50"
                  )}
                >
                  {plan.id === "free" ? "無料で始める" : "選択する"}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-14 border-t border-border pt-14">
          <RolePersonaCompactIntro layout="plans" />
          <div className="mt-10">
            <RolePersonaCards layout="plans" />
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-8">よくある質問</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground mb-2">プランの変更はいつでもできますか？</h3>
              <p className="text-sm text-muted-foreground">
                はい、いつでもプランの変更が可能です。アップグレードは即時反映され、ダウングレードは次回請求日から適用されます。
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground mb-2">フリー（¥0）プランの内容は？</h3>
              <p className="text-sm text-muted-foreground">
                お試し利用として、案件は月5件まで、提携医院は3件までご利用いただけます。より多くの案件や医院を扱う場合は、ライト・スタンダード・プロへのアップグレードをご検討ください。
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground mb-2">表示価格は税込ですか？</h3>
              <p className="text-sm text-muted-foreground">
                有料プラン（ライト・スタンダード・プロ）は税別表示です。消費税はご契約・決済手続きに従い別途となります。
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground mb-2">支払い方法は何がありますか？</h3>
              <p className="text-sm text-muted-foreground">
                有料プランは Stripe Checkout（クレジットカード）でのお支払いに対応しています。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center rounded-2xl border border-border bg-card p-8">
          <h2 className="text-lg font-bold text-foreground mb-2">
            ご不明な点がございましたら
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            販売者・問い合わせ窓口：ナチュラルアート（tyu66457@gmail.com）
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:tyu66457@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              メールでお問い合わせ
            </a>
            <Link
              href={feetyAppUrl("/request-document")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
            >
              資料請求
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-muted/30 mt-16">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted-foreground">
          <p>販売者・問い合わせ窓口：ナチュラルアート</p>
          <p className="mt-1">
            <a href="mailto:tyu66457@gmail.com" className="hover:text-foreground underline-offset-2 hover:underline">
              tyu66457@gmail.com
            </a>
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href={feetyAppUrl("/legal/terms")} className="hover:text-foreground transition-colors">
              利用規約
            </Link>
            <Link href={feetyAppUrl("/legal/privacy")} className="hover:text-foreground transition-colors">
              プライバシーポリシー
            </Link>
            <Link href={feetyAppUrl("/legal/tokushoho")} className="hover:text-foreground transition-colors">
              特定商取引法に基づく表記
            </Link>
          </div>
          <p className="mt-3">© 2026 FEETY. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
