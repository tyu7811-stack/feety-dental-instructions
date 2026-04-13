import { getFeetyAppOrigin } from "@/lib/feety-app-origin"

/** ELUAS「お申し込みウィザード」完了時のリダイレクト先（v0 側でこの URL に統一する） */
export function eluasWizardCompletionRedirectUrl(): string {
  return `${getFeetyAppOrigin()}/signup`
}
