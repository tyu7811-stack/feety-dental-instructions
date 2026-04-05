export default function LabMonthlyBillingPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold tracking-tight">月締め請求</h1>
      <p className="text-sm text-muted-foreground max-w-xl">
        月次請求の一覧・発行は Stripe / 請求書テーブルと連携して実装する想定です。
        モックの月締めデータ表示は削除しました。
      </p>
    </div>
  )
}
