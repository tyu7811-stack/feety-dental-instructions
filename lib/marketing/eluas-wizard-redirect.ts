import { getFeetyAppOrigin } from "@/lib/feety-app-origin"
import { ELUAS_WIZARD_TRIAL_PLAN_NOTICE } from "@/lib/content/eluas-wizard-strings"

export { ELUAS_WIZARD_TRIAL_PLAN_NOTICE }

/** ELUAS「お申し込みウィザード」完了時のリダイレクト先（v0 側でこの URL に統一する） */
export function eluasWizardCompletionRedirectUrl(): string {
  return `${getFeetyAppOrigin()}/signup`
}
