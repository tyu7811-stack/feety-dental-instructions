import Stripe from "stripe"

let stripe: Stripe | null = null

export function getStripe(): Stripe {
  /** テストは `sk_test_...`、本番ライブは `sk_live_...`（いずれも環境変数 `STRIPE_SECRET_KEY`） */
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set")
  }
  if (process.env.NODE_ENV === "production" && key.startsWith("sk_test_")) {
    console.warn(
      "[stripe] Production is using a Stripe TEST secret key. Set sk_live_ and live Price IDs for live mode."
    )
  }
  if (!stripe) {
    stripe = new Stripe(key, { typescript: true })
  }
  return stripe
}
