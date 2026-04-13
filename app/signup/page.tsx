import { redirect } from "next/navigation"

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/**
 * マーケ LP（例: v0-dental-lab-automation.vercel.app/signup）の「お申し込み確定」後の遷移先用。
 * 本番では /signup2 へ寄せ、技工所かつ即セッション時は登録フロー内で /lab/billing（Stripe）へ進む。
 */
export default async function SignupPage({ searchParams }: PageProps) {
  const params = await searchParams
  const q = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      for (const v of value) q.append(key, v)
    } else {
      q.append(key, value)
    }
  }
  const qs = q.toString()
  redirect(qs ? `/signup2?${qs}` : "/signup2")
}
