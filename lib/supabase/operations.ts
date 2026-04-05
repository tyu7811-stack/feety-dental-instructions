import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/types"

type Case = Database["public"]["Tables"]["cases"]["Row"]
type Document = Database["public"]["Tables"]["documents"]["Row"]
type PriceMaster = Database["public"]["Tables"]["price_masters"]["Row"]

// 案件関連操作
export async function getCasesByLab(labId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("lab_id", labId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Case[]
}

export async function getCasesByClinic(clinicId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("clinic_id", clinicId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Case[]
}

export async function getCaseById(caseId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("id", caseId)
    .single()

  if (error) throw error
  return data as Case
}

export async function createCase(caseData: Omit<Case, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("cases")
    .insert([caseData])
    .select()
    .single()

  if (error) throw error
  return data as Case
}

export async function updateCase(caseId: string, updates: Partial<Case>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("cases")
    .update(updates)
    .eq("id", caseId)
    .select()
    .single()

  if (error) throw error
  return data as Case
}

export async function deleteCase(caseId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("cases").delete().eq("id", caseId)

  if (error) throw error
}

// 書類関連操作
export async function getDocumentsByLab(labId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("lab_id", labId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Document[]
}

export async function getDocumentByCase(caseId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("case_id", caseId)

  if (error) throw error
  return data as Document[]
}

export async function createDocument(docData: Omit<Document, "id" | "created_at">) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("documents")
    .insert([docData])
    .select()
    .single()

  if (error) throw error
  return data as Document
}

export async function updateDocument(docId: string, updates: Partial<Document>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("documents")
    .update(updates)
    .eq("id", docId)
    .select()
    .single()

  if (error) throw error
  return data as Document
}

// 金額マスタ関連操作
export async function getPriceMasterByLabAndClinic(
  labId: string,
  clinicId: string
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("price_masters")
    .select("*")
    .eq("lab_id", labId)
    .eq("clinic_id", clinicId)
    .single()

  if (error && error.code !== "PGRST116") throw error
  return data as PriceMaster | null
}

export async function updatePriceMaster(
  labId: string,
  clinicId: string,
  prices: Record<string, number>
) {
  const supabase = await createClient()

  // 既存レコードを確認
  const existing = await getPriceMasterByLabAndClinic(labId, clinicId)

  if (existing) {
    // 更新
    const { data, error } = await supabase
      .from("price_masters")
      .update({ prices })
      .eq("lab_id", labId)
      .eq("clinic_id", clinicId)
      .select()
      .single()

    if (error) throw error
    return data as PriceMaster
  } else {
    // 新規作成
    const { data, error } = await supabase
      .from("price_masters")
      .insert([{ lab_id: labId, clinic_id: clinicId, prices }])
      .select()
      .single()

    if (error) throw error
    return data as PriceMaster
  }
}
