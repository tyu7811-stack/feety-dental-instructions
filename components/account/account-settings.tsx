'use client'

import { useState } from 'react'
import { AlertCircle, Download, LogOut, Calendar } from 'lucide-react'

export function AccountSettingsPage() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [deleteDate, setDeleteDate] = useState<string | null>(null)

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/account/subscription', {
        method: 'GET',
      })

      if (!response.ok) throw new Error('エクスポート失敗')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `dental-data-${new Date().getTime()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export failed:', error)
      alert('データのエクスポートに失敗しました')
    }
  }

  const handleCancelSubscription = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/account/subscription', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setDeleteDate(data.deletionDate)
        setShowConfirmation(false)
        alert('解約処理が完了しました。1年後にデータが自動削除されます。')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Cancellation failed:', error)
      alert('解約処理に失敗しました')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* アカウント情報セクション */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">アカウント設定</h2>

        {deleteDate && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">解約済み</p>
              <p className="text-sm text-red-800 mt-1">
                ご利用のアカウントは{' '}
                {new Date(deleteDate).toLocaleDateString('ja-JP')}
                に自動削除予定です
              </p>
            </div>
          </div>
        )}

        {/* データエクスポートボタン */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Download className="h-4 w-4" />
            データのバックアップ
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            ご利用のデータをCSV形式でダウンロードしてください
          </p>
          <button
            onClick={handleExportData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            データをダウンロード
          </button>
        </div>

        {/* 解約セクション */}
        {!deleteDate && (
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-600">
              <LogOut className="h-4 w-4" />
              アカウント解約
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              アカウントを解約すると、1年後にすべてのデータが自動削除されます。
              削除前のバックアップをお忘れなく。
            </p>
            {!showConfirmation ? (
              <button
                onClick={() => setShowConfirmation(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                アカウントを解約する
              </button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-900 mb-2">
                  本当に解約してもよろしいですか？
                </p>
                <p className="text-sm text-red-800 mb-4">
                  この操作は取り消せません。60日後に警告メールが送信され、365日後にすべてのデータが削除されます。
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelSubscription}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                  >
                    {isDeleting ? '処理中...' : '確認して解約'}
                  </button>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg transition"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 削除スケジュール情報 */}
      {deleteDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4" />
            削除スケジュール
          </h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>
              • <strong>60日後:</strong> 最終確認のため警告メールを送信
            </li>
            <li>
              • <strong>365日後:</strong> すべてのデータを自動削除
            </li>
            <li>
              • <strong>復旧期間:</strong> 削除前にサポートへお問い合わせ
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
