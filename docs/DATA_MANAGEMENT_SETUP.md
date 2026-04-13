# 解約データ管理システム - セットアップガイド

## 必要な環境変数

以下の環境変数をVercelプロジェクト設定に追加してください：

### メール送信設定
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Cronジョブセキュリティ
```
CRON_SECRET=your-secure-random-string
```

### サイトURL
本番は **https://www.seo-oji.space** のみを参照する（旧プレビュー `v0-dental-system-roles.vercel.app` は使わない）。
```
NEXT_PUBLIC_SITE_URL=https://www.seo-oji.space
```

## Cronジョブの設定

### Vercel Crons を使用する場合

1. `vercel.json` に以下を追加：

```json
{
  "crons": [
    {
      "path": "/api/cron/data-cleanup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### 外部Cronサービス（例: EasyCron）を使用する場合

1. **EasyCron** (https://www.easycron.com/) にアクセス
2. 新しいCronジョブを作成
3. URL: `https://www.seo-oji.space/api/cron/data-cleanup`
4. ヘッダー:
   - `x-cron-secret`: CRON_SECRET環境変数の値
5. スケジュール: `0 2 * * *` (毎日 2時)

## 動作フロー

### タイムライン

| タイミング | イベント | 処理内容 |
|----------|---------|--------|
| **解約時** | アカウント解約 | `subscriptions` テーブルの `status` を `pending_deletion` に設定、`cancelled_at` を記録 |
| **10ヶ月後** | リマインドメール送信 | ユーザーにデータ保管期限（残り2ヶ月）を通知 |
| **10ヶ月 + 60日 = 1年前** | データ削除警告 | 削除予定日の60日前に最終警告メール送信 |
| **1年後** | 自動削除実行 | データベースからすべてのユーザーデータを完全削除 |

### 10ヶ月目のリマインドメール

**送信条件:**
- 解約から10ヶ月経過
- `reminder_10months_sent` が `false`
- ステータスが `pending_deletion`

**メール内容:**
- データ保管期限（残り2ヶ月）を明示
- データダウンロード（CSV/PDF）へのリンク
- サービス再開（再契約）へのリンク
- 削除に同意する場合の説明

**ユーザーの選択肢:**
1. データを書き出し（CSV/PDF形式）
2. サービスを再開（データ保持）
3. 削除に同意（何もしない）

## データ削除フロー

### 削除対象データ

以下のテーブルから`user_id`でフィルタリングして削除：
- `cases` - 技工案件
- `documents` - 関連書類
- `profiles` - ユーザープロフィール
- `labs` - 技工所情報
- `clinics` - 医院情報
- `price_masters` - 価格設定

### 削除ログ

削除実行時に `deletion_logs` テーブルに記録：
- `user_id` - 削除対象ユーザーID
- `user_type` - ユーザータイプ（lab/clinic）
- `subscription_id` - サブスクリプションID
- `action` - 実行アクション（"permanent_delete"）
- `details` - 削除詳細情報（JSON）
- `created_at` - 削除日時

### 復元不可

**重要:** データ削除後は復元できません。必要なデータはあらかじめダウンロード（書き出し）してください。

### 1. ユーザーが解約した場合
- ユーザーがアカウント設定から「アカウントを解約する」をクリック
- `POST /api/account/subscription` が実行
- `subscription_management` テーブルに `status: 'pending_deletion'` で記録

### 2. 解約から60日後（自動実行）
- Cronジョブが実行
- 警告メールがメールキューに追加
- `email_queue` テーブルで送信予定

### 3. メールキュー処理
- `processEmailQueue()` がペンディング中のメールを処理
- ユーザーへ警告メール送信
- メール内にデータエクスポートリンク付き

### 4. ユーザーがデータをバックアップ
- ユーザーがメール内のリンクまたは設定ページからダウンロード
- CSV形式でローカル保存

### 5. 解約から365日後（自動実行）
- Cronジョブが再度実行
- 1年以上経過したデータを確認
- `deleteUserDataPermanently()` を実行
- すべてのデータを削除
- `deletion_logs` テーブルに記録

## テスト方法

### ローカルテスト
```bash
# 手動でCronジョブをトリガー
curl -H "x-cron-secret: your-cron-secret" \
  https://www.seo-oji.space/api/cron/data-cleanup
```

### データエクスポート
- アカウント設定ページにアクセス: `/account/settings`
- 「データをダウンロード」をクリック
- CSV形式でダウンロード可能

## テーブル構造

### subscription_management
- `user_id`: ユーザーID（プライマリキー）
- `user_email`: ユーザーメール
- `status`: active | cancelled | pending_deletion | deleted
- `cancelled_at`: 解約日時
- `deletion_scheduled_at`: 削除予定日時
- `warning_sent`: 警告メール送信済みフラグ
- `warning_sent_at`: 警告メール送信日時
- `data_deleted`: データ削除完了フラグ
- `deleted_at`: 削除日時

### email_queue
- `id`: UUID
- `user_id`: ユーザーID
- `email`: メールアドレス
- `type`: warning_60days | warning_30days | warning_7days | final_notice
- `status`: pending | sent | failed
- `scheduled_for`: 送信予定日時
- `sent_at`: 実際の送信日時
- `error`: エラーメッセージ（失敗時）
- `created_at`: 作成日時

### deletion_logs
- `id`: UUID
- `user_id`: ユーザーID
- `deleted_data`: 削除されたデータ（JSON）
- `deleted_at`: 削除日時

## セキュリティ考慮事項

✅ **実装済み**
- Cronシークレットキーによる認証
- ユーザー認証確認
- データベースRLS設定
- メール送信時のユーザー確認

⚠️ **注意点**
- 本番環境では必ずHTTPSを使用
- Cronシークレットキーは複雑にしてください
- メール認証情報は環境変数で管理
- 定期的なバックアップを推奨

## トラブルシューティング

### メールが送信されない
1. 環境変数 `EMAIL_USER`, `EMAIL_PASSWORD` を確認
2. Gmailの場合、アプリパスワードを使用してください
3. `email_queue` テーブルで失敗したメール確認

### Cronジョブが実行されない
1. `CRON_SECRET` が正しく設定されているか確認
2. URL が正しいか確認
3. Vercelログで エラーを確認

### データが削除されない
1. `subscription_management.status` が `pending_deletion` か確認
2. `cancelled_at` が365日以上前か確認
3. `data_deleted` フラグが `false` か確認
