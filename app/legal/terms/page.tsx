import Link from "next/link"
import { feetyAppUrl } from "@/lib/feety-app-origin"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-8 text-2xl font-bold text-gray-900">
            利用規約
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              この利用規約（以下「本規約」）は、ナチュラルアート（以下「当社」）が提供する歯科技工指示書管理システム「FEETY」（以下「本サービス」）の利用条件を定めるものです。ユーザーの皆様には、本規約に同意の上、本サービスをご利用いただきます。
            </p>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第1条（適用）</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。当社は本サービスに関し、本規約のほか、ご利用にあたってのルール等、各種の定め（以下「個別規定」）をすることがあります。これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第2条（利用登録）</h2>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                <li>登録希望者が当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。</li>
                <li>当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                    <li>本規約に違反したことがある者からの申請である場合</li>
                    <li>その他、当社が利用登録を相当でないと判断した場合</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第3条（ユーザーIDおよびパスワードの管理）</h2>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                <li>ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。</li>
                <li>ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。</li>
                <li>ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には、そのユーザーIDを登録しているユーザー自身による利用とみなします。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第4条（利用料金および支払方法）</h2>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                <li>ユーザーは、本サービスの有料部分の対価として、当社が別途定め、本ウェブサイトに表示する利用料金を、当社が指定する方法により支払うものとします。</li>
                <li>ユーザーが利用料金の支払を遅滞した場合には、ユーザーは年14.6％の割合による遅延損害金を支払うものとします。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第5条（禁止事項）</h2>
              <p className="text-sm text-gray-700 mb-2">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>当社のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                <li>当社のサービスの運営を妨害するおそれのある行為</li>
                <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                <li>不正アクセスをし、またはこれを試みる行為</li>
                <li>他のユーザーに成りすます行為</li>
                <li>当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                <li>その他、当社が不適切と判断する行為</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第6条（本サービスの提供の停止等）</h2>
              <p className="text-sm text-gray-700">
                当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                <li>その他、当社が本サービスの提供が困難と判断した場合</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第7条（退会）</h2>
              <p className="text-sm text-gray-700">
                ユーザーは、当社の定める退会手続により、本サービスから退会できるものとします。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第8条（免責事項）</h2>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                <li>当社は、本サービスに事実上または法律上の瑕疵がないことを明示的にも黙示的にも保証しておりません。</li>
                <li>当社は、本サービスに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。ただし、消費者契約法の適用がある場合はこの限りではありません。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第9条（サービス内容の変更等）</h2>
              <p className="text-sm text-gray-700">
                当社は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第10条（利用規約の変更）</h2>
              <p className="text-sm text-gray-700">
                当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">第11条（準拠法・裁判管轄）</h2>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
                <li>本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。</li>
              </ol>
            </section>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-6">
            <p className="text-center text-xs text-gray-500">
              制定日：2024年1月1日<br />
              最終更新日：2026年4月12日
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
              <Link href={feetyAppUrl("/")} className="text-blue-600 hover:underline">
                トップページ
              </Link>
              <Link href={feetyAppUrl("/plans")} className="text-blue-600 hover:underline">
                料金・プラン
              </Link>
              <Link href={feetyAppUrl("/legal/tokushoho")} className="text-blue-600 hover:underline">
                特定商取引法に基づく表記
              </Link>
            </div>
            <p className="mt-4 text-center text-xs text-gray-500">
              販売者・問い合わせ窓口：ナチュラルアート（
              <a href="mailto:tyu66457@gmail.com" className="text-blue-600 hover:underline">
                tyu66457@gmail.com
              </a>
              ）
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
