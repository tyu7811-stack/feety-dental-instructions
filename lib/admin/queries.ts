import { getSupabaseAdmin } from "@/lib/supabase/admin"

export type AdminLabRow = {
  id: string
  name: string
  contact_name: string | null
  phone: string | null
  created_at: string | null
  clinicCount: number
  activeCaseCount: number
}

export async function fetchLabsForAdmin(): Promise<{
  data: AdminLabRow[]
  error: string | null
}> {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return {
      data: [],
      error:
        "SUPABASE_SERVICE_ROLE_KEY が未設定のため、管理画面で技工所一覧を取得できません。",
    }
  }

  const { data: labs, error: labErr } = await admin
    .from("labs")
    .select("id, name, contact_name, phone, created_at")
    .order("created_at", { ascending: false })

  if (labErr || !labs?.length) {
    return { data: [], error: labErr?.message ?? null }
  }

  const rows: AdminLabRow[] = []
  for (const lab of labs) {
    const { count: clinicCount } = await admin
      .from("clinics")
      .select("id", { count: "exact", head: true })
      .eq("lab_id", lab.id)

    const { count: activeCaseCount } = await admin
      .from("cases")
      .select("id", { count: "exact", head: true })
      .eq("lab_id", lab.id)
      .neq("status", "納品済み")

    rows.push({
      id: lab.id,
      name: lab.name,
      contact_name: lab.contact_name,
      phone: lab.phone,
      created_at: lab.created_at,
      clinicCount: clinicCount ?? 0,
      activeCaseCount: activeCaseCount ?? 0,
    })
  }

  return { data: rows, error: null }
}

export type AdminLabDetail = {
  lab: {
    id: string
    name: string
    contact_name: string | null
    phone: string | null
    created_at: string | null
  }
  clinics: Array<{
    id: string
    name: string
    doctor_name: string | null
    email: string | null
    phone: string | null
  }>
  cases: Array<{
    id: string
    clinic_id: string | null
    patient_name: string
    status: string
    created_at: string | null
  }>
}

export async function fetchLabDetailForAdmin(
  labId: string
): Promise<{ data: AdminLabDetail | null; error: string | null }> {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return {
      data: null,
      error:
        "SUPABASE_SERVICE_ROLE_KEY が未設定のため、詳細を取得できません。",
    }
  }

  const { data: lab, error: lErr } = await admin
    .from("labs")
    .select("id, name, contact_name, phone, created_at")
    .eq("id", labId)
    .maybeSingle()

  if (lErr || !lab) {
    return { data: null, error: lErr?.message ?? "技工所が見つかりません" }
  }

  const { data: clinics } = await admin
    .from("clinics")
    .select("id, name, doctor_name, email, phone")
    .eq("lab_id", labId)
    .order("name")

  const { data: cases } = await admin
    .from("cases")
    .select("id, clinic_id, patient_name, status, created_at")
    .eq("lab_id", labId)
    .order("created_at", { ascending: false })
    .limit(100)

  return {
    data: {
      lab,
      clinics: clinics ?? [],
      cases: cases ?? [],
    },
    error: null,
  }
}

export type AdminDocumentRow = {
  id: string
  type: string
  issued_at: string | null
  case_id: string | null
  clinic_id: string | null
  lab_id: string
}

export async function fetchDocumentsForAdmin(): Promise<{
  data: AdminDocumentRow[]
  error: string | null
}> {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return {
      data: [],
      error:
        "SUPABASE_SERVICE_ROLE_KEY が未設定のため、書類一覧を取得できません。",
    }
  }

  const { data, error } = await admin
    .from("documents")
    .select("id, type, issued_at, case_id, clinic_id, lab_id")
    .order("issued_at", { ascending: false })
    .limit(200)

  if (error) {
    return { data: [], error: error.message }
  }
  return { data: data ?? [], error: null }
}
