"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Case } from "@/lib/types"
import type { LabSubscriptionSnapshot } from "@/lib/subscription/lab-subscription"
import { fetchLabSubscriptionSnapshot } from "@/lib/subscription/lab-subscription"

// 技工所の案件一覧を取得
export async function getLabCases() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "ログインが必要です", data: [] }
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

  // 技工所の案件一覧を取得（パラメータ化クエリでSQLインジェクション対策済み）
  const { data, error } = await supabase
    .from("cases")
    .select(`
      *,
      clinics (
        id,
        name,
        doctor_name
      )
    `)
    .eq("lab_id", lab.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Cases fetch error:", error)
    return { error: "案件一覧の取得に失敗しました", data: [] }
  }

  return { data: data || [] }
}

function metalLabel(ag: boolean | null, pd: boolean | null) {
  const parts: string[] = []
  if (ag) parts.push("Ag")
  if (pd) parts.push("Pd")
  return parts.length ? parts.join(" / ") : "なし"
}

export type LabCaseDocumentVM = {
  id: string
  type: string
  generatedAt: string
}

export async function getLabCaseBundle(caseId: string): Promise<{
  caseData: Case
  clinicName: string
  clinicDoctorName: string
  documents: LabCaseDocumentVM[]
  labSubscription: LabSubscriptionSnapshot
} | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: lab } = await supabase
    .from("labs")
    .select("id")
    .eq("user_id", user.id)
    .single()
  if (!lab) return null

  const { data: row, error } = await supabase
    .from("cases")
    .select(`*, clinics ( id, name, doctor_name )`)
    .eq("id", caseId)
    .eq("lab_id", lab.id)
    .maybeSingle()

  if (error || !row) return null

  const clinic = row.clinics as {
    name: string
    doctor_name: string | null
  } | null

  const { data: docs } = await supabase
    .from("documents")
    .select("id, type, issued_at")
    .eq("case_id", caseId)
    .order("issued_at", { ascending: false })

  const documents: LabCaseDocumentVM[] = (docs ?? []).map((d) => ({
    id: d.id,
    type: d.type,
    generatedAt: d.issued_at ?? new Date().toISOString(),
  }))

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

  const labSubscription = await fetchLabSubscriptionSnapshot(supabase, user.id)

  return {
    caseData,
    clinicName: clinic?.name ?? "—",
    clinicDoctorName: clinic?.doctor_name ?? "—",
    documents,
    labSubscription,
  }
}

// 案件のステータスを更新
export async function updateCaseStatus(caseId: string, status: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "ログインが必要です" }
  }

  const { data: lab } = await supabase
    .from("labs")
    .select("id")
    .eq("user_id", user.id)
    .single()
  if (!lab) {
    return { error: "技工所情報が見つかりません" }
  }

  const { data: existing } = await supabase
    .from("cases")
    .select("lab_id")
    .eq("id", caseId)
    .maybeSingle()
  if (!existing || existing.lab_id !== lab.id) {
    return { error: "案件を更新する権限がありません" }
  }

  const updateData: Record<string, unknown> = {
    status: status,
  }

  if (status === "完成" || status === "納品済み") {
    updateData.completed_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from("cases")
    .update(updateData)
    .eq("id", caseId)
    .select()
    .single()

  if (error) {
    console.error("Case update error:", error)
    return { error: "ステータスの更新に失敗しました" }
  }

  revalidatePath("/lab/cases")
  revalidatePath("/lab/dashboard")
  revalidatePath(`/lab/cases/${caseId}`)
  return { data }
}
