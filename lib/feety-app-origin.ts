/**
 * マーケ（HP）からのリンク先＝本番アプリのオリジン。
 * 未設定時は Vercel 本番。別ドメインに移す場合は NEXT_PUBLIC_FEETY_APP_ORIGIN を設定。
 */
export function getFeetyAppOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_FEETY_APP_ORIGIN?.replace(/\/$/, "") ??
    "https://feety-dental-instructions.vercel.app"
  )
}

export function feetyAppUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`
  return `${getFeetyAppOrigin()}${p}`
}
