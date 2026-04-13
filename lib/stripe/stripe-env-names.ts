/**
 * Stripe Checkout / Webhook が参照する環境変数名。
 *
 * 本番ライブ例:
 * - `STRIPE_SECRET_KEY`: `sk_live_...`
 * - `STRIPE_WEBHOOK_SECRET`: ライブ Webhook エンドポイントの Signing secret（`whsec_...`）
 * - 月額・初回: 下記 `price*` キーに各 `price_...`（単一の `STRIPE_PRICE_ID` は未使用。プラン別 ID を推奨）
 * - Webhook が Supabase の `subscriptions` を更新するには `SUPABASE_SERVICE_ROLE_KEY` が必須（`lib/supabase/admin.ts`）
 *
 * 金額のフォールバックは `lib/stripe/catalog.ts`。
 */
export const STRIPE_ENV = {
  secretKey: "STRIPE_SECRET_KEY",
  webhookSecret: "STRIPE_WEBHOOK_SECRET",
  priceLiteMonthly: "STRIPE_PRICE_LITE_MONTHLY",
  priceStandardMonthly: "STRIPE_PRICE_STANDARD_MONTHLY",
  priceProfessionalMonthly: "STRIPE_PRICE_PROFESSIONAL_MONTHLY",
  /** 後方互換（月額・_MONTHLY 未設定時） */
  priceLiteLegacy: "STRIPE_PRICE_LITE",
  priceStandardLegacy: "STRIPE_PRICE_STANDARD",
  priceProfessionalLegacy: "STRIPE_PRICE_PROFESSIONAL",
  priceInitialFee: "STRIPE_PRICE_INITIAL_FEE",
} as const
