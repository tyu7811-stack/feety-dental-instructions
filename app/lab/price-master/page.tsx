export default function LabPriceMasterPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold tracking-tight">価格マスタ</h1>
      <p className="text-sm text-muted-foreground max-w-xl">
        単価マスタはデータベースのテーブル（例: price_masters）と連携する実装に差し替える予定です。
        従来のモックデータ表示は本番前の混乱を避けるため削除しています。
      </p>
    </div>
  )
}
