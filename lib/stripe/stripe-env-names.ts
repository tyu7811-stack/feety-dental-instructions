/**
 * Stripe Checkout / Webhook が参照する環境変数名（本番ライブの `price_...` を Vercel に設定）。
 * 金額のソース・オブリは `lib/stripe/catalog.ts`。
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
