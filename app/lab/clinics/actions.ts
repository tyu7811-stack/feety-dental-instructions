"use server"
// Cache bust: v3 - removed invite_code and expires_at
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type ClinicFormData = {
  name: string
  doctorName: string
  phone: string
  email: string
  postalCode?: string
  prefecture?: string
  city?: string
  address?: string
  building?: string
}

// 医院を追加
export async function addClinic(formData: ClinicFormData) {
  const supabase = await createClient()
  
  // 現在のユーザーを取得
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "認証エラー: ログインしてください" }
  }

  // ユーザーの技工所IDを取得
  const { data: lab, error: labError } = await supabase
    .from("labs")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (labError || !lab) {
    return { error: "技工所情報が見つかりません" }
  }

  // 医院を追加（パラメータ化クエリでSQLインジェクション対策済み）
  const { data, error } = await supabase
    .from("clinics")
    .insert({
      user_id: null,
      lab_id: lab.id,
      name: formData.name,
      doctor_name: formData.doctorName,
      phone: formData.phone,
      email: formData.email,
      postal_code: formData.postalCode || null,
      prefecture: formData.prefecture || null,
      city: formData.city || null,
      address: formData.address || null,
      building: formData.building || null,
      account_status: "active",
    })
    .select()
    .single()

  if (error) {
    console.error("Clinic insert error:", error)
    return { error: "医院の登録に失敗しました: " + error.message }
  }

  revalidatePath("/lab/clinics")
  return { data }
}

// 招待データ型（テーブルの実際のカラムのみ）
export type InvitationData = {
  id: string
  lab_id: string
  clinic_email: string
  clinic_name: string | null
  clinic_id: string | null
  status: string
  created_at: string
}

// 医院を招待
export async function inviteClinic(email: string, clinicName: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "認証エラー: ログインしてください" }
  }

  // ユーザーの技工所IDを取得
  const { data: lab, error: labError } = await supabase
    .from("labs")
    .select("id, name")
    .eq("user_id", user.id)
    .single()

  if (labError || !lab) {
    return { error: "技工所情報が見つかりません" }
  }

  // 既に招待済みかチェック
  const { data: existingInvite } = await supabase
    .from("clinic_relations")
    .select("id, status")
    .eq("lab_id", lab.id)
    .eq("clinic_email", email)
    .single()

  if (existingInvite) {
    if (existingInvite.status === "pending") {
      return { error: "このメールアドレスには既に招待を送信済みです" }
    } else if (existingInvite.status === "accepted") {
      return { error: "このメールアドレスは既に提携済みです" }
    }
  }

  // 招待を作成
  const { data, error } = await supabase
    .from("clinic_relations")
    .insert({
      lab_id: lab.id,
      clinic_email: email,
      clinic_name: clinicName,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Invitation insert error:", error)
    return { error: "招待の送信に失敗しました: " + error.message }
  }

  // TODO: 実際の環境ではここでメール送信処理を行う
  // 医院名はメール送信時の宛名として、DBにも保存される
  console.log(`招待メール送信: ${email}`)
  console.log(`医院名（宛名）: ${clinicName}`)
  console.log(`技工所名: ${lab.name}`)

  revalidatePath("/lab/clinics")
  return { data }
}

// 招待一覧を取得
export async function getInvitations() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "認証エラー", data: [] }
  }

  // ユーザーの技工所IDを取得
  const { data: lab } = await supabase
    .from("labs")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!lab) {
    return { error: "技工所情報が見つかりません", data: [] }
  }

  // 招待一覧を取得
  const { data, error } = await supabase
    .from("clinic_relations")
    .select("*")
    .eq("lab_id", lab.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Invitations fetch error:", error)
    return { error: "招待一覧の取得に失敗しました", data: [] }
  }

  return { data: data || [] }
}

// 招待をキャンセル
export async function cancelInvitation(invitationId: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "認証エラー" }
  }

  const { error } = await supabase
    .from("clinic_relations")
    .delete()
    .eq("id", invitationId)

  if (error) {
    console.error("Invitation cancel error:", error)
    return { error: "招待のキャンセルに失敗しました" }
  }

  revalidatePath("/lab/clinics")
  return { success: true }
}

// 招待を再送信
export async function resendInvitation(invitationId: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "認証エラー" }
  }

  const { data, error } = await supabase
    .from("clinic_relations")
    .select("*")
    .eq("id", invitationId)
    .single()

  if (error) {
    console.error("Invitation fetch error:", error)
    return { error: "招待情報の取得に失敗しました" }
  }

  // TODO: 実際の環境ではここでメール再送信処理を行う
  console.log(`招待メール再送信: ${data.clinic_email}`)

  revalidatePath("/lab/clinics")
  return { data }
}

// 医院一覧を取得
export async function getClinics() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "認証エラー", data: [] }
  }

  // 医院一覧を取得（パラメータ化クエリでSQLインジェクション対策済み）
  const { data, error } = await supabase
    .from("clinics")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    console.error("Clinics fetch error:", error)
    return { error: "医院一覧の取得に失敗しました", data: [] }
  }

  return { data: data || [] }
}

// 医院情報を更新
export async function updateClinic(clinicId: string, formData: Partial<ClinicFormData> & { accountStatus?: string }) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "認証エラー" }
  }

  // 更新データを構築
  const updateData: Record<string, unknown> = {}
  if (formData.name !== undefined) updateData.name = formData.name
  if (formData.doctorName !== undefined) updateData.doctor_name = formData.doctorName
  if (formData.phone !== undefined) updateData.phone = formData.phone
  if (formData.email !== undefined) updateData.email = formData.email
  if (formData.postalCode !== undefined) updateData.postal_code = formData.postalCode
  if (formData.prefecture !== undefined) updateData.prefecture = formData.prefecture
  if (formData.city !== undefined) updateData.city = formData.city
  if (formData.address !== undefined) updateData.address = formData.address
  if (formData.building !== undefined) updateData.building = formData.building
  if (formData.accountStatus !== undefined) updateData.account_status = formData.accountStatus

  // 医院を更新（パラメータ化クエリでSQLインジェクション対策済み）
  const { data, error } = await supabase
    .from("clinics")
    .update(updateData)
    .eq("id", clinicId)
    .select()
    .single()

  if (error) {
    console.error("Clinic update error:", error)
    return { error: "医院情報の更新に失敗しました" }
  }

  revalidatePath("/lab/clinics")
  return { data }
}
