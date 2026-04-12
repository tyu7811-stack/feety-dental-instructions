/**
 * マーケ（HP）からのリンク先＝本番アプリのオリジン。
 * 未設定時は本番ドメイン。別 URL にする場合は NEXT_PUBLIC_FEETY_APP_ORIGIN を設定。
 */
export function getFeetyAppOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_FEETY_APP_ORIGIN?.replace(/\/$/, "") ??
    "https://www.seo-oji.space"
  )
}

export function feetyAppUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`
  return `${getFeetyAppOrigin()}${p}`
}
