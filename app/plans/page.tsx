import Link from "next/link"
import { Check, X, Sparkles, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  RolePersonaCards,
  RolePersonaCompactIntro,
} from "@/components/marketing/role-persona-marketing"
import { feetyAppUrl } from "@/lib/feety-app-origin"

const plans = [
  {
    id: "free",
    name: "フリー",
    description: "まずはお試し",
    price: "¥0",
    priceNote: "税込み／14日間のお試しのみ。その後は機能制限があります。",
    color: "bg-emerald-50 border-emerald-300",
    headerColor: "bg-emerald-700",
    popular: false,
    features: [
      { name: "お試し期間14日間", included: true },
      { name: "期間終了後は機能制限", included: true },
      { name: "案件管理", included: true },
      { name: "技工指示書の基本作成", included: true },
      { name: "有料プランへのアップグレード", included: true },
    ],
  },
  {
    id: "lite",
    name: "ライト",
    description: "小規模な技工所・医院向け",
    price: "¥2,980",
    priceNote: "税込み／月",
    color: "bg-slate-100 border-slate-300",
    headerColor: "bg-slate-600",
    popular: false,
    features: [
      { name: "案件管理", included: true },
      { name: "技工指示書作成・送信", included: true },
      { name: "納品書作成", included: true },
      { name: "指示書履歴閲覧", included: true },
      { name: "提携医院管理（5件まで）", included: true },
      { name: "高度な分析", included: false },
      { name: "売上・コスト分析", included: false },
      { name: "納期遵守率分析", included: false },
      { name: "利益率分析", included: false },
      { name: "優先サポート", included: false },
    ],
  },
  {
    id: "standard",
    name: "スタンダード",
    description: "成長中の技工所・医院向け",
    price: "¥9,800",
    priceNote: "税込み／月",
    color: "bg-blue-50 border-blue-400",
    headerColor: "bg-primary",
    popular: true,
    features: [
      { name: "案件管理", included: true },
      { name: "技工指示書作成・送信", included: true },
      { name: "納品書作成", included: true },
      { name: "指示書履歴閲覧", included: true },
      { name: "提携医院管理（20件まで）", included: true },
      { name: "高度な分析（制限あり）", included: true },
      { name: "売上・コスト分析", included: true },
      { name: "納期遵守率分析", included: false },
      { name: "利益率分析", included: false },
      { name: "優先サポート", included: false },
    ],
  },
  {
    id: "professional",
    name: "プロ",
    description: "大規模な技工所・医院向け",
    price: "¥19,800",
    priceNote: "税込み／月",
    color: "bg-amber-50 border-amber-400",
    headerColor: "bg-amber-600",
    popular: false,
    features: [
      { name: "案件管理", included: true },
      { name: "技工指示書作成・送信", included: true },
      { name: "納品書作成", included: true },
      { name: "指示書履歴閲覧", included: true },
      { name: "提携医院管理（無制限）", included: true },
      { name: "高度な分析", included: true },
      { name: "売上・コスト分析", included: true },
      { name: "納期遵守率分析", included: true },
      { name: "利益率分析", included: true },
      { name: "優先サポート", included: true },
    ],
  },
] as const

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
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            料金・プラン
          </h1>
          <p className="mt-3 text-muted-foreground">
            FEETY（歯科技工指示書クラウド）の料金プランをご確認ください
          </p>
        </div>

        <div className="mb-14 mt-10">
          <RolePersonaCompactIntro layout="plans" />
          <div className="mt-10">
            <RolePersonaCards layout="plans" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl border-2 overflow-hidden transition-transform hover:scale-[1.02]",
                plan.color,
                plan.popular && "ring-2 ring-primary ring-offset-2"
              )}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                  おすすめ
                </div>
              )}

              <div className={cn("px-6 py-5 text-white", plan.headerColor)}>
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <p className="text-sm opacity-90 mt-1">{plan.description}</p>
              </div>

              <div className="px-6 py-6 border-b border-border/50 bg-white/50">
                <div className="flex flex-wrap items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.priceNote}</span>
                </div>
              </div>

              <div className="px-6 py-6 bg-white/30">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                          <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100">
                          <X className="h-3 w-3 text-slate-400" />
                        </div>
                      )}
                      <span
                        className={cn(
                          "text-sm",
                          feature.included ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {feature.name}
                      </span>
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
                    および
                    <Link href={feetyAppUrl("/legal/tokushoho")} className="text-primary underline hover:no-underline">
                      特定商取引法に基づく表記
                    </Link>
                    を必ずご確認ください。ボタンを押すことで、これらに同意したものとみなされます。
                  </p>
                )}
                <Link
                  href={feetyAppUrl("/signup2")}
                  className={cn(
                    "flex w-full items-center justify-center rounded-lg py-2.5 text-sm font-semibold transition-colors",
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                  )}
                >
                  {plan.id === "free" ? "無料で始める" : "このプランで申し込む"}
                </Link>
              </div>
            </div>
          ))}
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
              <h3 className="font-semibold text-foreground mb-2">フリー（¥0）プランの「14日間のお試し」とは？</h3>
              <p className="text-sm text-muted-foreground">
                フリープランは税込0円で、初回ご利用から14日間はお試しとしてご利用いただけます。14日間を過ぎると機能制限がかかります。制限のない利用には、ライト・スタンダード・プロの各プランをご検討ください。
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
          <div className="mt-3 flex justify-center gap-4">
            <Link href={feetyAppUrl("/legal/terms")} className="hover:text-foreground transition-colors">
              利用規約
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
