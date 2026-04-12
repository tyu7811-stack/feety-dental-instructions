import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { feetyAppUrl } from "@/lib/feety-app-origin"

export default function TokushohoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/lab/billing"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          プラン・お支払いに戻る
        </Link>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-8 text-2xl font-bold text-gray-900 text-center">
            特定商取引法に基づく表記
          </h1>

          <div className="divide-y divide-gray-100">
            <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <dt className="text-sm font-semibold text-gray-500">販売業者</dt>
              <dd className="text-gray-900 sm:col-span-2">ナチュラルアート</dd>
            </div>

            <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <dt className="text-sm font-semibold text-gray-500">代表者名</dt>
              <dd className="text-gray-900 sm:col-span-2">宮里 一成</dd>
            </div>

            <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <dt className="text-sm font-semibold text-gray-500">所在地</dt>
              <dd className="text-gray-900 sm:col-span-2">
                沖縄県糸満市阿波根51-1
              </dd>
            </div>

            <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <dt className="text-sm font-semibold text-gray-500">連絡先（メール）／問い合わせ窓口</dt>
              <dd className="text-gray-900 sm:col-span-2">
                <a href="mailto:tyu66457@gmail.com" className="text-blue-600 hover:underline">
                  tyu66457@gmail.com
                </a>
              </dd>
            </div>

            <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <dt className="text-sm font-semibold text-gray-500">連絡先（電話）</dt>
              <dd className="text-gray-900 sm:col-span-2">
                <a href="tel:08017449572" className="text-blue-600 hover:underline">
                  080-1744-9572
                </a>
              </dd>
            </div>

            <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <dt className="text-sm font-semibold text-gray-500">販売価格</dt>
              <dd className="text-gray-900 sm:col-span-2">
                <ul className="space-y-1">
                  <li>フリープラン：0円／月額（お試し利用。案件5件／月まで、提携医院3件まで等の上限あり）</li>
                  <li>ライトプラン：月額 3,980円（税別）</li>
                  <li>スタンダードプラン：月額 9,800円（税別）</li>
                  <li>プロプラン：月額 19,800円（税別）</li>
                </ul>
                <p className="mt-2 text-sm text-gray-600">
                  有料プランの表示は税別です。消費税は法令に従いご請求いたします。
                </p>
              </dd>
            </div>

            <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <dt className="text-sm font-semibold text-gray-500">代金の支払時期</dt>
              <dd className="text-gray-900 sm:col-span-2">
                初回申し込み時、および毎月自動更新
              </dd>
            </div>

            <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <dt className="text-sm font-semibold text-gray-500">支払方法</dt>
              <dd className="text-gray-900 sm:col-span-2">
                クレジットカード決済
              </dd>
            </div>

            <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <dt className="text-sm font-semibold text-gray-500">商品の引渡し時期</dt>
              <dd className="text-gray-900 sm:col-span-2">
                決済完了後、即時にシステム利用可能
              </dd>
            </div>

            <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <dt className="text-sm font-semibold text-gray-500">返品・キャンセル</dt>
              <dd className="text-gray-900 sm:col-span-2">
                サービスの性質上、返品・返金は承っておりません。<br />
                解約はプラン管理画面よりいつでも可能です。
              </dd>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-6">
            <p className="text-center text-xs text-gray-500">
              最終更新日：2026年4月12日
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-center">
          <Link href={feetyAppUrl("/")} className="text-blue-600 hover:underline">
            トップページ
          </Link>
          <Link href={feetyAppUrl("/plans")} className="text-blue-600 hover:underline">
            料金・プラン
          </Link>
          <Link href={feetyAppUrl("/legal/terms")} className="text-blue-600 hover:underline">
            利用規約
          </Link>
          <Link href={feetyAppUrl("/legal/privacy")} className="text-blue-600 hover:underline">
            プライバシーポリシー
          </Link>
        </div>
      </div>
    </div>
  )
}
