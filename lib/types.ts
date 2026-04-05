// =============================================
// 技工指示書自動化システム - 型定義
// =============================================

// --- 役割 ---
export type UserRole = "admin" | "lab" | "clinic"

// --- 技工物11種（実際の技工指示書に基づく） ---
export type ProsthesisType =
  | "インレー"
  | "4/5冠"
  | "FMC"
  | "前装冠"
  | "キャストコアー"
  | "ファイバーコア"
  | "CRインレー"
  | "HJC"
  | "ハイブリット(メタル付)"
  | "ハイブリット"
  | "ブリッジ"

// --- ステータス ---
export type CaseStatus =
  | "受付"
  | "起票済み"
  | "製作開始"
  | "製作中"
  | "完成"
  | "納品済み"

// --- 書類タイプ ---
export type DocumentType =
  | "技工指示書"
  | "納品書"
  | "納品書控"
  | "請求書"
  | "月締め請求書"

// --- 決済方法 ---
export type PaymentMethod = "credit_card" | "bank_transfer"

// --- 決済ステータス ---
export type PaymentStatusType = "paid" | "unpaid" | "error" | "overdue"

// --- 技工所ステータス ---
export type LabStatus = "active" | "suspended" | "cancelled"

// --- 技工所 ---
export interface Lab {
  id: string
  name: string
  owner: string
  ownerEmail: string
  phone: string
  address: string
  status: LabStatus
  lastLogin: string
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatusType
  subscriptionPlan: string
  monthlyFee: number
  lastPaymentDate: string | null
  cancelledAt: string | null
  cancelCountdownDays: number | null
  clinicCount: number
  activeCaseCount: number
}

// --- 歯科医院 ---
export interface Clinic {
  id: string
  name: string
  labId: string
  doctorName: string
  address: string
  phone: string
  email: string
  registeredAt: string
}

// --- 案件（技工指示書） ---
export interface Case {
  id: string
  clinicId: string
  labId: string
  patientName: string
  toothPositions: string[]
  prosthesisTypes: ProsthesisType[]
  shade: string
  metalType: string
  notes: string
  status: CaseStatus
  createdAt: string
  updatedAt: string
  dueDate: string | null
}

// --- 書類 ---
export interface Document {
  id: string
  caseId: string
  clinicId: string
  labId: string
  type: DocumentType
  generatedAt: string
  patientName: string
  clinicName: string
}

// --- 金額マスタ ---
export interface PriceMaster {
  id: string
  labId: string
  clinicId: string
  prosthesisType: ProsthesisType
  unitPrice: number
}

// --- 月締め請求書 ---
export interface MonthlyBill {
  id: string
  labId: string
  clinicId: string
  clinicName: string
  month: string // "2026-01" etc
  totalAmount: number
  caseCount: number
  status: "未発行" | "発行済み" | "入金済み"
  generatedAt: string | null
}

// --- 通知 ---
export interface Notification {
  id: string
  type: "recovery_request" | "payment_failed" | "system_alert" | "new_case"
  title: string
  message: string
  createdAt: string
  isRead: boolean
}

// --- ユーザー ---
export interface User {
  id: string
  name: string
  role: UserRole
  labId?: string
  clinicId?: string
}
