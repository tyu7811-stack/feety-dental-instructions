"use client"

import Link from "next/link"
import { Check, X, Sparkles, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    id: "lite",
    name: "ライト",
    description: "小規模な技工所・医院向け",
    price: "¥2,000",
    priceNote: "/ 月額（税別）",
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
    price: "¥12,000",
    priceNote: "/ 月額（税別）",
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
    name: "プロフェッショナル",
    description: "大規模な技工所・医院向け",
    price: "¥39,800",
    priceNote: "/ 月額（税別）",
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
]

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            ログイン画面に戻る
          </Link>
          <p className="text-xs text-muted-foreground">
            開発・運営：ナチュラルアート（システムオーナー）
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            プラン詳細
          </h1>
          <p className="mt-3 text-muted-foreground">
            技工指示書自動化システムの料金プランをご確認ください
          </p>
          <p className="mt-2 text-sm text-amber-600 font-medium">
            ※ ライトプラン・スタンダードプランは、1医院増えるごとに +¥2,000/月
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl border-2 overflow-hidden transition-transform hover:scale-[1.02]",
                plan.color,
                plan.popular && "ring-2 ring-primary ring-offset-2"
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                  おすすめ
                </div>
              )}

              {/* Header */}
              <div className={cn("px-6 py-5 text-white", plan.headerColor)}>
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <p className="text-sm opacity-90 mt-1">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="px-6 py-6 border-b border-border/50 bg-white/50">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.priceNote}</span>
                </div>
              </div>

              {/* Features */}
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

              {/* CTA */}
              <div className="px-6 py-5 bg-white/50">
                {plan.id !== "lite" && (
                  <p className="mb-3 text-xs text-muted-foreground leading-relaxed">
                    お支払い前に、
                    <Link href="/legal/terms" className="text-primary underline hover:no-underline">利用規約</Link>
                    および
                    <Link href="/legal/tokushoho" className="text-primary underline hover:no-underline">特定商取引法に基づく表記</Link>
                    を必ずご確認ください。ボタンを押すことで、これらに同意したものとみなされます。
                  </p>
                )}
                <button
                  className={cn(
                    "w-full rounded-lg py-2.5 text-sm font-semibold transition-colors",
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                  )}
                >
                  {plan.id === "lite" ? "現在のプラン" : "このプランを選択"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
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
              <h3 className="font-semibold text-foreground mb-2">無料トライアルはありますか？</h3>
              <p className="text-sm text-muted-foreground">
                スタンダードプランとプロフェッショナルプランには14日間の無料トライアルがあります。クレジットカードの登録なしでお試しいただけます。
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground mb-2">支払い方法は何がありますか？</h3>
              <p className="text-sm text-muted-foreground">
                クレジットカード（VISA、MasterCard、JCB、American Express）、銀行振込に対応しています。年払いの場合は2ヶ月分お得になります。
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-16 text-center rounded-2xl border border-border bg-card p-8">
          <h2 className="text-lg font-bold text-foreground mb-2">
            ご不明な点がございましたら
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            導入のご相談やお見積りなど、お気軽にお問い合わせください
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              お問い合わせ
            </Link>
            <Link
              href="/request-document"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
            >
              資料請求
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-16">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted-foreground">
          <p>開発・運営：ナチュラルアート（システムオーナー）</p>
          <div className="mt-3 flex justify-center gap-4">
            <Link href="/legal/terms" className="hover:text-foreground transition-colors">
              利用規約
            </Link>
            <Link href="/legal/tokushoho" className="hover:text-foreground transition-colors">
              特定商取引法に基づく表記
            </Link>
          </div>
          <p className="mt-3">© 2026 技工指示書自動化システム. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
