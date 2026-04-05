import type {
  Lab,
  Clinic,
  Case,
  Document,
  PriceMaster,
  MonthlyBill,
  Notification,
  ProsthesisType,
} from "./types"

// =============================================
// 技工所データ（3件）
// =============================================
export const labs: Lab[] = [
  {
    id: "lab-001",
    name: "山田デンタルラボ",
    owner: "山田 太郎",
    ownerEmail: "yamada@dentallab.jp",
    phone: "03-1234-5678",
    address: "東京都千代田区神田1-2-3",
    status: "active",
    lastLogin: "2026-02-28T09:15:00",
    paymentMethod: "credit_card",
    paymentStatus: "paid",
    subscriptionPlan: "スタンダード",
    monthlyFee: 9800,
    lastPaymentDate: "2026-02-01T00:00:00",
    cancelledAt: null,
    cancelCountdownDays: null,
    clinicCount: 5,
    activeCaseCount: 12,
  },
  {
    id: "lab-002",
    name: "佐藤技工所",
    owner: "佐藤 花子",
    ownerEmail: "sato@giko.jp",
    phone: "06-9876-5432",
    address: "大阪府大阪市中央区本町4-5-6",
    status: "active",
    lastLogin: "2026-02-27T14:30:00",
    paymentMethod: "bank_transfer",
    paymentStatus: "unpaid",
    subscriptionPlan: "プレミアム",
    monthlyFee: 14800,
    lastPaymentDate: "2026-01-05T00:00:00",
    cancelledAt: null,
    cancelCountdownDays: null,
    clinicCount: 8,
    activeCaseCount: 23,
  },
  {
    id: "lab-003",
    name: "鈴木デンタルワークス",
    owner: "鈴木 一郎",
    ownerEmail: "suzuki@dentalworks.jp",
    phone: "052-1111-2222",
    address: "愛知県名古屋市中区栄7-8-9",
    status: "cancelled",
    lastLogin: "2026-01-15T11:00:00",
    paymentMethod: "credit_card",
    paymentStatus: "overdue",
    subscriptionPlan: "スタンダード",
    monthlyFee: 9800,
    lastPaymentDate: "2025-12-01T00:00:00",
    cancelledAt: "2026-01-20T00:00:00",
    cancelCountdownDays: 327,
    clinicCount: 3,
    activeCaseCount: 0,
  },
]

// =============================================
// 歯科医院データ（各技工所に複数）
// =============================================
export const clinics: Clinic[] = [
  // 山田デンタルラボの提携医院
  {
    id: "clinic-001",
    name: "あおぞら歯科クリニック",
    labId: "lab-001",
    doctorName: "田中 健太",
    address: "東京都渋谷区代々木1-1-1",
    phone: "03-1111-0001",
    email: "tanaka@aozora-dc.jp",
    registeredAt: "2025-06-15T00:00:00",
  },
  {
    id: "clinic-002",
    name: "さくら歯科医院",
    labId: "lab-001",
    doctorName: "伊藤 美咲",
    address: "東京都新宿区西新宿2-2-2",
    phone: "03-1111-0002",
    email: "ito@sakura-dental.jp",
    registeredAt: "2025-07-20T00:00:00",
  },
  {
    id: "clinic-003",
    name: "ひまわり歯科",
    labId: "lab-001",
    doctorName: "高橋 大輔",
    address: "東京都中央区銀座3-3-3",
    phone: "03-1111-0003",
    email: "takahashi@himawari.jp",
    registeredAt: "2025-08-10T00:00:00",
  },
  {
    id: "clinic-004",
    name: "たんぽぽ歯科",
    labId: "lab-001",
    doctorName: "中村 優子",
    address: "東京都文京区本郷4-4-4",
    phone: "03-1111-0004",
    email: "nakamura@tanpopo.jp",
    registeredAt: "2025-09-01T00:00:00",
  },
  {
    id: "clinic-005",
    name: "みどり歯科クリニック",
    labId: "lab-001",
    doctorName: "小林 翔",
    address: "東京都豊島区池袋5-5-5",
    phone: "03-1111-0005",
    email: "kobayashi@midori-dc.jp",
    registeredAt: "2025-10-15T00:00:00",
  },
  // 佐藤技工所の提携医院
  {
    id: "clinic-006",
    name: "なにわ歯科クリニック",
    labId: "lab-002",
    doctorName: "松本 誠",
    address: "大阪府大阪市北区梅田1-1-1",
    phone: "06-2222-0001",
    email: "matsumoto@naniwa-dc.jp",
    registeredAt: "2025-05-01T00:00:00",
  },
  {
    id: "clinic-007",
    name: "道頓堀デンタル",
    labId: "lab-002",
    doctorName: "井上 真理",
    address: "大阪府大阪市中央区道頓堀2-2-2",
    phone: "06-2222-0002",
    email: "inoue@dotonbori-d.jp",
    registeredAt: "2025-05-15T00:00:00",
  },
  {
    id: "clinic-008",
    name: "天王寺歯科",
    labId: "lab-002",
    doctorName: "木村 拓也",
    address: "大阪府大阪市天王寺区3-3-3",
    phone: "06-2222-0003",
    email: "kimura@tennoji.jp",
    registeredAt: "2025-06-01T00:00:00",
  },
  // 鈴木デンタルワークスの提携医院
  {
    id: "clinic-009",
    name: "名古屋セントラル歯科",
    labId: "lab-003",
    doctorName: "加藤 健",
    address: "愛知県名古屋市中区錦1-1-1",
    phone: "052-3333-0001",
    email: "kato@central-dc.jp",
    registeredAt: "2025-04-01T00:00:00",
  },
  {
    id: "clinic-010",
    name: "栄デンタルクリニック",
    labId: "lab-003",
    doctorName: "渡辺 直美",
    address: "愛知県名古屋市中区栄2-2-2",
    phone: "052-3333-0002",
    email: "watanabe@sakae-dc.jp",
    registeredAt: "2025-04-15T00:00:00",
  },
]

// =============================================
// 案件データ（技工指示書）
// =============================================
export const cases: Case[] = [
  // あおぞら歯科クリニック → 山田デンタルラボ
  {
    id: "CASE-2026-0001",
    clinicId: "clinic-001",
    labId: "lab-001",
    patientName: "佐々木 太一",
    toothPositions: ["右上6", "右上7"],
    prosthesisTypes: ["インレー"],
    shade: "A2",
    metalType: "金パラ",
    notes: "咬合面の形態に注意",
    status: "製作中",
    createdAt: "2026-02-20T10:00:00",
    updatedAt: "2026-02-22T14:00:00",
    dueDate: "2026-03-05T00:00:00",
  },
  {
    id: "CASE-2026-0002",
    clinicId: "clinic-001",
    labId: "lab-001",
    patientName: "高木 理恵",
    toothPositions: ["左下5"],
    prosthesisTypes: ["FMC"],
    shade: "A3",
    metalType: "金パラ",
    notes: "",
    status: "完成",
    createdAt: "2026-02-15T09:00:00",
    updatedAt: "2026-02-26T16:00:00",
    dueDate: "2026-02-28T00:00:00",
  },
  {
    id: "CASE-2026-0003",
    clinicId: "clinic-001",
    labId: "lab-001",
    patientName: "岡田 修",
    toothPositions: ["右上1", "右上2", "右上3"],
    prosthesisTypes: ["ブリッジ", "前装冠"],
    shade: "A1",
    metalType: "メタルボンド",
    notes: "審美性重視。前歯部のため色調合わせ慎重に。",
    status: "起票済み",
    createdAt: "2026-02-28T08:30:00",
    updatedAt: "2026-02-28T08:30:00",
    dueDate: "2026-03-15T00:00:00",
  },
  // さくら歯科医院
  {
    id: "CASE-2026-0004",
    clinicId: "clinic-002",
    labId: "lab-001",
    patientName: "吉田 真由美",
    toothPositions: ["右下6"],
    prosthesisTypes: ["キャストコアー", "FMC"],
    shade: "A3.5",
    metalType: "金パラ",
    notes: "コア＋FMCの二重構造",
    status: "製作中",
    createdAt: "2026-02-18T11:00:00",
    updatedAt: "2026-02-24T09:00:00",
    dueDate: "2026-03-08T00:00:00",
  },
  {
    id: "CASE-2026-0005",
    clinicId: "clinic-002",
    labId: "lab-001",
    patientName: "河野 大輝",
    toothPositions: ["上顎全体"],
    prosthesisTypes: ["ブリッジ"],
    shade: "-",
    metalType: "コバルトクロム",
    notes: "部分床義歯。金属床希望。",
    status: "製作開始",
    createdAt: "2026-02-25T13:00:00",
    updatedAt: "2026-02-26T10:00:00",
    dueDate: "2026-03-20T00:00:00",
  },
  // ひまわり歯科
  {
    id: "CASE-2026-0006",
    clinicId: "clinic-003",
    labId: "lab-001",
    patientName: "森田 彩香",
    toothPositions: ["左上1"],
    prosthesisTypes: ["HJC"],
    shade: "B1",
    metalType: "-",
    notes: "セラミック ラミネートベニア",
    status: "納品済み",
    createdAt: "2026-02-05T09:00:00",
    updatedAt: "2026-02-20T15:00:00",
    dueDate: "2026-02-18T00:00:00",
  },
  {
    id: "CASE-2026-0007",
    clinicId: "clinic-003",
    labId: "lab-001",
    patientName: "石井 浩二",
    toothPositions: ["右下4"],
    prosthesisTypes: ["インレー"],
    shade: "A2",
    metalType: "セラミック",
    notes: "e.maxインレー希望",
    status: "製作中",
    createdAt: "2026-02-22T10:30:00",
    updatedAt: "2026-02-25T11:00:00",
    dueDate: "2026-03-07T00:00:00",
  },
  // たんぽぽ歯科
  {
    id: "CASE-2026-0008",
    clinicId: "clinic-004",
    labId: "lab-001",
    patientName: "山口 美穂",
    toothPositions: ["左下6", "左下7"],
    prosthesisTypes: ["ブリッジ"],
    shade: "A3",
    metalType: "金パラ",
    notes: "ブリッジ支台歯の状態良好",
    status: "起票済み",
    createdAt: "2026-02-27T15:00:00",
    updatedAt: "2026-02-27T15:00:00",
    dueDate: "2026-03-12T00:00:00",
  },
  // みどり歯科クリニック
  {
    id: "CASE-2026-0009",
    clinicId: "clinic-005",
    labId: "lab-001",
    patientName: "田村 信也",
    toothPositions: ["右上4"],
    prosthesisTypes: ["CRインレー"],
    shade: "-",
    metalType: "-",
    notes: "仮歯。最終補綴まで1ヶ月程度。",
    status: "納品済み",
    createdAt: "2026-02-10T08:00:00",
    updatedAt: "2026-02-15T12:00:00",
    dueDate: "2026-02-14T00:00:00",
  },
  {
    id: "CASE-2026-0010",
    clinicId: "clinic-005",
    labId: "lab-001",
    patientName: "大西 恵子",
    toothPositions: ["左上5"],
    prosthesisTypes: ["ハイブリット"],
    shade: "A2",
    metalType: "ジルコニア",
    notes: "インプラントアバットメント＋ジルコニアクラウン",
    status: "製作開始",
    createdAt: "2026-02-24T14:00:00",
    updatedAt: "2026-02-25T09:00:00",
    dueDate: "2026-03-18T00:00:00",
  },
  // 佐藤技工所の案件
  {
    id: "CASE-2026-0011",
    clinicId: "clinic-006",
    labId: "lab-002",
    patientName: "上田 孝雄",
    toothPositions: ["右下7"],
    prosthesisTypes: ["FMC"],
    shade: "A3",
    metalType: "金パラ",
    notes: "",
    status: "製作中",
    createdAt: "2026-02-19T09:00:00",
    updatedAt: "2026-02-23T10:00:00",
    dueDate: "2026-03-04T00:00:00",
  },
  {
    id: "CASE-2026-0012",
    clinicId: "clinic-006",
    labId: "lab-002",
    patientName: "前田 由美",
    toothPositions: ["下顎"],
    prosthesisTypes: ["ハイブリット(メタル付)"],
    shade: "-",
    metalType: "-",
    notes: "スポーツ用マウスガード（ラグビー）",
    status: "完成",
    createdAt: "2026-02-17T11:00:00",
    updatedAt: "2026-02-27T16:00:00",
    dueDate: "2026-02-28T00:00:00",
  },
  {
    id: "CASE-2026-0013",
    clinicId: "clinic-007",
    labId: "lab-002",
    patientName: "川上 隆史",
    toothPositions: ["左上4", "左上5"],
    prosthesisTypes: ["インレー"],
    shade: "B2",
    metalType: "セラミック",
    notes: "ハイブリッドセラミックインレー2歯",
    status: "製作中",
    createdAt: "2026-02-21T10:00:00",
    updatedAt: "2026-02-24T14:00:00",
    dueDate: "2026-03-06T00:00:00",
  },
  {
    id: "CASE-2026-0014",
    clinicId: "clinic-008",
    labId: "lab-002",
    patientName: "野口 里奈",
    toothPositions: ["右上2"],
    prosthesisTypes: ["ファイバーコア", "前装冠"],
    shade: "A1",
    metalType: "ファイバーポスト",
    notes: "ファイバーポスト＋メタルボンド前装冠",
    status: "起票済み",
    createdAt: "2026-02-28T07:00:00",
    updatedAt: "2026-02-28T07:00:00",
    dueDate: "2026-03-14T00:00:00",
  },
]

// =============================================
// 書類データ
// =============================================
export const documents: Document[] = [
  // CASE-2026-0001
  {
    id: "doc-001",
    caseId: "CASE-2026-0001",
    clinicId: "clinic-001",
    labId: "lab-001",
    type: "技工指示書",
    generatedAt: "2026-02-20T10:00:00",
    patientName: "佐々木 太一",
    clinicName: "あおぞら歯科クリニック",
  },
  // CASE-2026-0002
  {
    id: "doc-002",
    caseId: "CASE-2026-0002",
    clinicId: "clinic-001",
    labId: "lab-001",
    type: "技工指示書",
    generatedAt: "2026-02-15T09:00:00",
    patientName: "高木 理恵",
    clinicName: "あおぞら歯科クリニック",
  },
  {
    id: "doc-003",
    caseId: "CASE-2026-0002",
    clinicId: "clinic-001",
    labId: "lab-001",
    type: "納品書",
    generatedAt: "2026-02-26T16:00:00",
    patientName: "高木 理恵",
    clinicName: "あおぞら歯科クリニック",
  },
  {
    id: "doc-004",
    caseId: "CASE-2026-0002",
    clinicId: "clinic-001",
    labId: "lab-001",
    type: "納品書控",
    generatedAt: "2026-02-26T16:00:00",
    patientName: "高木 理恵",
    clinicName: "あおぞら歯科クリニック",
  },
  // CASE-2026-0006
  {
    id: "doc-005",
    caseId: "CASE-2026-0006",
    clinicId: "clinic-003",
    labId: "lab-001",
    type: "技工指示書",
    generatedAt: "2026-02-05T09:00:00",
    patientName: "森田 彩香",
    clinicName: "ひまわり歯科",
  },
  {
    id: "doc-006",
    caseId: "CASE-2026-0006",
    clinicId: "clinic-003",
    labId: "lab-001",
    type: "納品書",
    generatedAt: "2026-02-20T15:00:00",
    patientName: "森田 彩香",
    clinicName: "ひまわり歯科",
  },
  {
    id: "doc-007",
    caseId: "CASE-2026-0006",
    clinicId: "clinic-003",
    labId: "lab-001",
    type: "請求書",
    generatedAt: "2026-02-20T15:30:00",
    patientName: "森田 彩香",
    clinicName: "ひまわり歯科",
  },
  // CASE-2026-0009
  {
    id: "doc-008",
    caseId: "CASE-2026-0009",
    clinicId: "clinic-005",
    labId: "lab-001",
    type: "技工指示書",
    generatedAt: "2026-02-10T08:00:00",
    patientName: "田村 信也",
    clinicName: "みどり歯科クリニック",
  },
  {
    id: "doc-009",
    caseId: "CASE-2026-0009",
    clinicId: "clinic-005",
    labId: "lab-001",
    type: "納品書",
    generatedAt: "2026-02-15T12:00:00",
    patientName: "田村 信也",
    clinicName: "みどり歯科クリニック",
  },
  // 佐藤技工所の書類
  {
    id: "doc-010",
    caseId: "CASE-2026-0011",
    clinicId: "clinic-006",
    labId: "lab-002",
    type: "技工指示書",
    generatedAt: "2026-02-19T09:00:00",
    patientName: "上田 孝雄",
    clinicName: "なにわ歯科クリニック",
  },
  {
    id: "doc-011",
    caseId: "CASE-2026-0012",
    clinicId: "clinic-006",
    labId: "lab-002",
    type: "技工指示書",
    generatedAt: "2026-02-17T11:00:00",
    patientName: "前田 由美",
    clinicName: "なにわ歯科クリニック",
  },
  {
    id: "doc-012",
    caseId: "CASE-2026-0012",
    clinicId: "clinic-006",
    labId: "lab-002",
    type: "納品書",
    generatedAt: "2026-02-27T16:00:00",
    patientName: "前田 由美",
    clinicName: "なにわ歯科クリニック",
  },
]

// =============================================
// 金額マスタ
// =============================================
const prosthesisTypes: ProsthesisType[] = [
  "インレー", "4/5冠", "FMC", "前装冠", "キャストコアー",
  "ファイバーコア", "CRインレー", "HJC",
  "ハイブリット(メタル付)", "ハイブリット", "ブリッジ",
]

const defaultPrices: Record<ProsthesisType, number> = {
  "インレー": 3500,
  "4/5冠": 4000,
  "FMC": 4200,
  "前装冠": 5800,
  "キャストコアー": 2500,
  "ファイバーコア": 3000,
  "CRインレー": 3800,
  "HJC": 6500,
  "ハイブリット(メタル付)": 7000,
  "ハイブリット": 6000,
  "ブリッジ": 12000,
}

export const priceMasters: PriceMaster[] = (() => {
  const items: PriceMaster[] = []
  let idx = 1
  const lab001Clinics = clinics.filter((c) => c.labId === "lab-001")
  for (const clinic of lab001Clinics) {
    for (const pt of prosthesisTypes) {
      items.push({
        id: `pm-${String(idx).padStart(3, "0")}`,
        labId: "lab-001",
        clinicId: clinic.id,
        prosthesisType: pt,
        unitPrice: defaultPrices[pt],
      })
      idx++
    }
  }
  return items
})()

// =============================================
// 月締め請求書
// =============================================
export const monthlyBills: MonthlyBill[] = [
  {
    id: "mb-001",
    labId: "lab-001",
    clinicId: "clinic-001",
    clinicName: "あおぞら歯科クリニック",
    month: "2026-01",
    totalAmount: 45600,
    caseCount: 8,
    status: "入金済み",
    generatedAt: "2026-02-01T10:00:00",
  },
  {
    id: "mb-002",
    labId: "lab-001",
    clinicId: "clinic-002",
    clinicName: "さくら歯科医院",
    month: "2026-01",
    totalAmount: 32000,
    caseCount: 5,
    status: "発行済み",
    generatedAt: "2026-02-01T10:00:00",
  },
  {
    id: "mb-003",
    labId: "lab-001",
    clinicId: "clinic-003",
    clinicName: "ひまわり歯科",
    month: "2026-01",
    totalAmount: 28500,
    caseCount: 4,
    status: "入金済み",
    generatedAt: "2026-02-01T10:00:00",
  },
  {
    id: "mb-004",
    labId: "lab-001",
    clinicId: "clinic-004",
    clinicName: "たんぽぽ歯科",
    month: "2026-01",
    totalAmount: 15000,
    caseCount: 2,
    status: "発行済み",
    generatedAt: "2026-02-01T10:00:00",
  },
  {
    id: "mb-005",
    labId: "lab-001",
    clinicId: "clinic-005",
    clinicName: "みどり歯科クリニック",
    month: "2026-01",
    totalAmount: 21000,
    caseCount: 3,
    status: "入金済み",
    generatedAt: "2026-02-01T10:00:00",
  },
  // 未発行（2月分）
  {
    id: "mb-006",
    labId: "lab-001",
    clinicId: "clinic-001",
    clinicName: "あおぞら歯科クリニック",
    month: "2026-02",
    totalAmount: 0,
    caseCount: 3,
    status: "未発行",
    generatedAt: null,
  },
  {
    id: "mb-007",
    labId: "lab-001",
    clinicId: "clinic-002",
    clinicName: "さくら歯科医院",
    month: "2026-02",
    totalAmount: 0,
    caseCount: 2,
    status: "未発行",
    generatedAt: null,
  },
]

// =============================================
// 管理者用通知
// =============================================
export const notifications: Notification[] = [
  {
    id: "notif-001",
    type: "recovery_request",
    title: "データ復旧リクエスト",
    message: "鈴木デンタルワークスよりデータ復旧のリクエストが届いています。",
    createdAt: "2026-02-28T08:00:00",
    isRead: false,
  },
  {
    id: "notif-002",
    type: "payment_failed",
    title: "決済失敗",
    message: "佐藤技工所の2月分利用料が未入金です。期限を過ぎています。",
    createdAt: "2026-02-15T00:00:00",
    isRead: false,
  },
  {
    id: "notif-003",
    type: "system_alert",
    title: "自動抹消まで327日",
    message: "鈴木デンタルワークスの解約データが327日後に自動抹消されます。",
    createdAt: "2026-02-28T00:00:00",
    isRead: true,
  },
  {
    id: "notif-004",
    type: "new_case",
    title: "新規案件",
    message: "あおぞら歯科クリニックから新しい技工指示書が届きました。",
    createdAt: "2026-02-28T08:30:00",
    isRead: false,
  },
]

// =============================================
// ヘルパー関数
// =============================================
export function getLabById(id: string) {
  return labs.find((l) => l.id === id)
}

export function getClinicById(id: string) {
  return clinics.find((c) => c.id === id)
}

export function getCaseById(id: string) {
  return cases.find((c) => c.id === id)
}

export function getClinicsByLabId(labId: string) {
  return clinics.filter((c) => c.labId === labId)
}

export function getCasesByLabId(labId: string) {
  return cases.filter((c) => c.labId === labId)
}

export function getCasesByClinicId(clinicId: string) {
  return cases.filter((c) => c.clinicId === clinicId)
}

export function getDocumentsByCaseId(caseId: string) {
  return documents.filter((d) => d.caseId === caseId)
}

export function getDocumentsByLabId(labId: string) {
  return documents.filter((d) => d.labId === labId)
}

export function getMonthlyBillsByLabId(labId: string) {
  return monthlyBills.filter((b) => b.labId === labId)
}

export function getPriceMasterByLabAndClinic(labId: string, clinicId: string) {
  return priceMasters.filter((p) => p.labId === labId && p.clinicId === clinicId)
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-"
  const d = new Date(dateStr)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`
}

export function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "-"
  const d = new Date(dateStr)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

export function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString()}`
}
