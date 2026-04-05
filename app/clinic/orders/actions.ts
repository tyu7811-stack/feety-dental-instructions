"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { resolveClinicForUser } from "@/lib/clinic/resolve-clinic-for-user"
import type { Case } from "@/lib/types"

function metalLabel(ag: boolean | null, pd: boolean | null) {
  const parts: string[] = []
  if (ag) parts.push("Ag")
  if (pd) parts.push("Pd")
  return parts.length ? parts.join(" / ") : "なし"
}

export async function getClinicCaseBundle(caseId: string): Promise<{
  caseData: Case
  clinicName: string
  clinicAddress: string
} | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: clinic } = await resolveClinicForUser(supabase, user)
  if (!clinic) return null

  const { data: row, error } = await supabase
    .from("cases")
    .select(`*, clinics ( id, name, address, doctor_name )`)
    .eq("id", caseId)
    .eq("clinic_id", clinic.id)
    .maybeSingle()

  if (error || !row) return null

  const cr = row.clinics as {
    name: string
    address: string | null
  } | null

  const caseData: Case = {
    id: row.id,
    clinicId: row.clinic_id,
    labId: row.lab_id,
    patientName: row.patient_name,
    toothPositions: row.teeth ?? [],
    prosthesisTypes: (row.prosthesis_types ?? []) as Case["prosthesisTypes"],
    shade: row.shade ?? "—",
    metalType: metalLabel(row.metal_ag, row.metal_pd),
    notes: row.notes ?? "",
    status: row.status as Case["status"],
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? row.created_at,
    dueDate: row.delivery_date,
  }

  return {
    caseData,
    clinicName: cr?.name ?? "—",
    clinicAddress: cr?.address ?? "",
  }
}

// 医院情報を取得
export async function getClinicInfo() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { 
      clinicName: "（ログインが必要です）",
      clinicAddress: "",
      clinicTel: ""
    }
  }

  const { data: resolved } = await resolveClinicForUser(supabase, user)
  if (!resolved) {
    return {
      clinicName: "（医院未登録）",
      clinicAddress: "",
      clinicTel: "",
    }
  }

  const { data: clinic } = await supabase
    .from("clinics")
    .select("name, address, phone")
    .eq("id", resolved.id)
    .single()

  if (!clinic) {
    return { 
      clinicName: "（医院未登録）",
      clinicAddress: "",
      clinicTel: ""
    }
  }

  return {
    clinicName: clinic.name || "（医院名未設定）",
    clinicAddress: clinic.address || "",
    clinicTel: clinic.phone || ""
  }
}

export type CaseFormData = {
  patientName: string
  patientGender?: string
  patientAge?: number
  deliveryDate?: string
  deliveryTime?: string
  prosthesisTypes: string[]
  teeth: string[]
  shade?: string
  metalAg?: boolean
  metalPd?: boolean
  opposingTeeth?: string
  bite?: string
  notes?: string
}

// 技工指示書（案件）を作成
export async function createCase(formData: CaseFormData) {
  const supabase = await createClient()
  
  // 現在のユーザーを取得
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "認証エラー: ログインしてください" }
  }

  const { data: clinic, error: resolveErr } = await resolveClinicForUser(
    supabase,
    user
  )
  if (resolveErr || !clinic) {
    return {
      error:
        "医院アカウントが未登録か、技工所との紐づけがありません。技工所からの招待後に同じメールで登録するか、医院情報を登録してください。",
    }
  }

  if (!clinic.lab_id) {
    return {
      error:
        "提携技工所が設定されていません。技工所側で医院登録（メール一致）が完了するまでお待ちください。",
    }
  }

  const labId = clinic.lab_id

  // 案件を作成（パラメータ化クエリでSQLインジェクション対策済み）
  const { data, error } = await supabase
    .from("cases")
    .insert({
      clinic_id: clinic.id,
      lab_id: labId,
      patient_name: formData.patientName,
      patient_gender: formData.patientGender || null,
      patient_age: formData.patientAge || null,
      delivery_date: formData.deliveryDate || null,
      delivery_time: formData.deliveryTime || null,
      prosthesis_types: formData.prosthesisTypes,
      teeth: formData.teeth,
      shade: formData.shade || null,
      metal_ag: formData.metalAg || false,
      metal_pd: formData.metalPd || false,
      opposing_teeth: formData.opposingTeeth || null,
      bite: formData.bite || null,
      notes: formData.notes || null,
      status: "受付",
      ordered_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Case insert error:", error)
    return { error: "技工指示書の作成に失敗しました: " + error.message }
  }

  revalidatePath("/clinic/dashboard")
  revalidatePath("/lab/cases")
  return { data }
}

// 医院の案件一覧を取得
export async function getClinicCases() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "認証エラー", data: [] }
  }

  const { data: clinic, error: resolveErr } = await resolveClinicForUser(
    supabase,
    user
  )
  if (resolveErr || !clinic) {
    return { error: "医院情報が見つかりません", data: [] }
  }

  // 案件一覧を取得（パラメータ化クエリでSQLインジェクション対策済み）
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Cases fetch error:", error)
    return { error: "案件一覧の取得に失敗しました", data: [] }
  }

  return { data: data || [] }
}
