import type { SupabaseClient, User } from "@supabase/supabase-js"

export type SignupRole = "lab" | "clinic"

function roleFromUser(user: User): SignupRole {
  const m = user.user_metadata || {}
  const r = (m.role ?? m.user_type) as string | undefined
  return r === "lab" ? "lab" : "clinic"
}

/**
 * 新規登録後の profiles / labs / clinics を揃える。
 * メール確認ONのときはセッション確立後（auth コールバック）でも呼ぶ。
 */
export async function completeSignupProvisioning(
  supabase: SupabaseClient,
  user: User
): Promise<{ error: string | null }> {
  const meta = user.user_metadata || {}
  const role = roleFromUser(user)
  const email = (user.email || "").trim()
  const companyName = String(meta.company_name || "").trim() || "未設定"
  const contactName = String(meta.contact_name || meta.display_name || "").trim()
  const phone = String(meta.phone || "").trim()

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: email || user.id,
      role,
      company_name: companyName,
      contact_name: contactName,
      phone,
    },
    { onConflict: "id" }
  )

  if (profileError) {
    return { error: profileError.message }
  }

  if (role === "lab") {
    const { data: existingLab } = await supabase
      .from("labs")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()

    if (!existingLab) {
      const { error: labError } = await supabase.from("labs").insert({
        user_id: user.id,
        name: companyName,
        contact_name: contactName || null,
        phone: phone || null,
      })
      if (labError) {
        return { error: labError.message }
      }
    }
  } else {
    const { data: pending, error: pendingErr } = await supabase
      .from("clinics")
      .select("id")
      .is("user_id", null)
      .maybeSingle()

    if (pendingErr) {
      return { error: pendingErr.message }
    }

    if (pending) {
      const { error: updErr } = await supabase
        .from("clinics")
        .update({
          user_id: user.id,
          name: companyName,
          doctor_name: contactName || null,
          phone: phone || null,
        })
        .eq("id", pending.id)

      if (updErr) {
        return { error: updErr.message }
      }
    } else {
      const { error: insErr } = await supabase.from("clinics").insert({
        user_id: user.id,
        name: companyName,
        doctor_name: contactName || null,
        phone: phone || null,
        email: email || null,
      })

      if (insErr) {
        return { error: insErr.message }
      }
    }
  }

  return { error: null }
}
