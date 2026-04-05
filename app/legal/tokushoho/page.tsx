import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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
              <dt className="text-sm font-semibold text-gray-500">連絡先（メール）</dt>
              <dd className="text-gray-900 sm:col-span-2">
                <a href="mailto:0369tyu@gmail.com" className="text-blue-600 hover:underline">
                  0369tyu@gmail.com
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
                  <li>ライトプラン：月額 2,000円（税込）</li>
                  <li>スタンダードプラン：月額 12,000円（税込）</li>
                  <li>プロフェッショナルプラン：月額 39,800円（税込）</li>
                </ul>
              </dd>
            </div>

            <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <dt className="text-sm font-semibold text-gray-500">初期導入費用</dt>
              <dd className="text-gray-900 sm:col-span-2">
                全プラン共通：初回のみ 50,000円（税込）
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
              最終更新日：2026年3月21日
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/legal/terms"
            className="text-sm text-blue-600 hover:underline"
          >
            利用規約を見る
          </Link>
        </div>
      </div>
    </div>
  )
}
