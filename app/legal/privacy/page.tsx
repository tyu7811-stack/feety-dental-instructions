import type { Metadata } from "next"
import Link from "next/link"
import { feetyAppUrl } from "@/lib/feety-app-origin"

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "FEETY（歯科技工指示書クラウド）における個人情報の取扱いについて定めます。",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-8 text-2xl font-bold text-gray-900">
            プライバシーポリシー
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              ナチュラルアート（以下「当社」）は、歯科技工指示書管理サービス「FEETY」（以下「本サービス」）の提供にあたり、ユーザーの個人情報および本サービスを通じて取り扱う情報の保護に努めます。本ポリシーは、本サービスにおける個人情報等の取扱いについて定めるものです。
            </p>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第1条（取得する情報）</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                当社は、本サービスの提供に必要な範囲で、次の情報を取得する場合があります。
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>氏名、勤務先名、メールアドレス、電話番号等の登録情報</li>
                <li>アカウント認証・セッション維持に関する技術情報（Cookie、端末識別子等を含む）</li>
                <li>本サービス上でユーザーが入力・送信する技工指示書、添付資料、案件・納品に関する業務データ</li>
                <li>お問い合わせ内容、サポート履歴</li>
                <li>アクセスログ、利用状況、エラー情報等のログ情報</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第2条（利用目的）</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                取得した情報は、次の目的の範囲内で利用します。
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>本サービスの提供、本人確認、認証、サポート対応</li>
                <li>料金の請求、決済、契約に関する連絡（決済代行事業者への提供を含む）</li>
                <li>不正利用の防止、セキュリティの維持、障害対応、品質改善</li>
                <li>利用規約に基づく違反調査、紛争対応</li>
                <li>お知らせ、機能改善のための統計的な分析（個人が識別されない形式に加工する場合を含む）</li>
                <li>法令に基づく開示・報告</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第3条（第三者への提供・委託）</h2>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                <li>
                  当社は、次の場合を除き、個人情報を第三者に提供しません。
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>ユーザーの同意がある場合</li>
                    <li>法令に基づく場合</li>
                    <li>人の生命、身体または財産の保護のために必要で、本人の同意を得ることが困難である場合</li>
                  </ul>
                </li>
                <li>
                  本サービスの運用にあたり、クラウド基盤の提供、決済処理、メール送信等について、個人情報の取扱いの全部または一部を外部事業者に委託することがあります。この場合、当社は委託先を適切に監督します。
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第4条（安全管理）</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                当社は、個人情報の漏えい、滅失、毀損等を防止するため、組織的・人的・物理的・技術的安全管理措置を講じ、必要かつ適切な安全管理を行います。ただし、インターネット上の通信や保存が絶対に安全であるとは限らず、ユーザーにもパスワード管理等のご協力をお願いします。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第5条（保存期間）</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                当社は、利用目的の達成に必要な期間、個人情報等を保存します。保存期間経過後または利用目的が達成された後は、法令に定めがある場合を除き、消去または匿名化します。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第6条（開示・訂正・削除等）</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                ユーザーは、当社が保有する自己の個人情報について、個人情報保護法その他の法令に従い、開示、訂正、追加、削除、利用停止等を求めることができます。ご請求は、末尾の窓口までご連絡ください。当社は、法令に従い適切に対応します。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第7条（Cookie 等）</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                本サービスは、ログイン状態の維持、セキュリティ、利用状況の把握のために、Cookie およびこれに類する技術を使用することがあります。ブラウザの設定により Cookie を無効化できる場合がありますが、その結果本サービスの一部が利用できなくなることがあります。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第8条（本ポリシーの変更）</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                当社は、法令の改正や事業内容の変更等に応じ、本ポリシーを変更することがあります。変更後の内容は、本サービス上での掲載その他当社が適当と判断する方法により周知します。重要な変更がある場合は、法令の定めに従い通知します。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第9条（お問い合わせ窓口）</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                本ポリシーに関するお問い合わせは、次の窓口までご連絡ください。
              </p>
              <p className="text-sm text-gray-700 mt-3">
                販売者・個人情報取扱い窓口：ナチュラルアート
                <br />
                メール：
                <a href="mailto:tyu66457@gmail.com" className="text-blue-600 hover:underline">
                  tyu66457@gmail.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-6">
            <p className="text-center text-xs text-gray-500">
              制定日：2026年4月12日
              <br />
              最終更新日：2026年4月12日
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
              <Link href={feetyAppUrl("/")} className="text-blue-600 hover:underline">
                トップページ
              </Link>
              <Link href={feetyAppUrl("/legal/terms")} className="text-blue-600 hover:underline">
                利用規約
              </Link>
              <Link href={feetyAppUrl("/legal/tokushoho")} className="text-blue-600 hover:underline">
                特定商取引法に基づく表記
              </Link>
              <Link href={feetyAppUrl("/plans")} className="text-blue-600 hover:underline">
                料金・プラン
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
