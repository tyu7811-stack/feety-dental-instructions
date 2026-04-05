"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { formatDate } from "@/lib/mock-data"
import { Users, Plus, Phone, Mail, MapPin, X, KeyRound, ToggleLeft, ToggleRight, History, Save, Loader2, Send, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { addClinic, getClinics, updateClinic, inviteClinic, getInvitations, cancelInvitation, resendInvitation, type ClinicFormData, type InvitationData } from "./actions"

// Supabaseから取得する医院の型
type ClinicData = {
  id: string
  name: string
  doctor_name: string
  phone: string
  email: string
  postal_code: string | null
  prefecture: string | null
  city: string | null
  address: string | null
  building: string | null
  account_status: string
  created_at: string
  updated_at: string
}

// デモ用データ
const demoClinics: ClinicData[] = [
  { id: "c1", name: "山田歯科医院", doctor_name: "山田太郎", phone: "03-1234-5678", email: "yamada@dental.jp", postal_code: "100-0001", prefecture: "東京都", city: "千代田区", address: "丸の内1-1-1", building: "デンタルビル3F", account_status: "active", created_at: "2024-01-15T00:00:00Z", updated_at: "2024-03-01T00:00:00Z" },
  { id: "c2", name: "佐藤デンタルクリニック", doctor_name: "佐藤花子", phone: "06-9876-5432", email: "sato@dental-clinic.jp", postal_code: "530-0001", prefecture: "大阪府", city: "大阪市北区", address: "梅田2-2-2", building: null, account_status: "active", created_at: "2024-02-01T00:00:00Z", updated_at: "2024-02-15T00:00:00Z" },
  { id: "c3", name: "鈴木歯科", doctor_name: "鈴木一郎", phone: "052-111-2222", email: "suzuki@shika.jp", postal_code: "460-0001", prefecture: "愛知県", city: "名古屋市中区", address: "栄3-3-3", building: "栄ビル5F", account_status: "inactive", created_at: "2023-12-01T00:00:00Z", updated_at: "2024-01-10T00:00:00Z" },
]

export default function LabClinicsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <LabClinicsPageContent />
    </Suspense>
  )
}

function LabClinicsPageContent() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"
  
  const [clinics, setClinics] = useState<ClinicData[]>([])
  const [invitations, setInvitations] = useState<InvitationData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [selectedClinic, setSelectedClinic] = useState<ClinicData | null>(null)
  const [accountStatus, setAccountStatus] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [error, setError] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteClinicName, setInviteClinicName] = useState("")
  const [inviteSuccess, setInviteSuccess] = useState("")
  const [inviteError, setInviteError] = useState("")
  const [isInviting, setIsInviting] = useState(false)

  // 医院一覧と招待一覧を取得
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      
      // デモモードの場合はデモデータを使用
      if (isDemo) {
        setClinics(demoClinics)
        setIsLoading(false)
        return
      }
      
      const [clinicsResult, invitationsResult] = await Promise.all([
        getClinics(),
        getInvitations()
      ])
      
      if (clinicsResult.error) {
        setError(clinicsResult.error)
      } else {
        setClinics(clinicsResult.data as ClinicData[])
      }
      
      if (!invitationsResult.error) {
        setInvitations(invitationsResult.data as InvitationData[])
      }
      
      setIsLoading(false)
    }
    loadData()
  }, [isDemo])

  function openAccountModal(clinic: ClinicData) {
    setSelectedClinic(clinic)
    setAccountStatus(clinic.account_status === "active")
    setSaveMessage("")
  }

  function closeAccountModal() {
    setSelectedClinic(null)
    setSaveMessage("")
  }

  async function handleSaveAccount() {
    if (!selectedClinic) return
    setIsSaving(true)
    
    const result = await updateClinic(selectedClinic.id, {
      accountStatus: accountStatus ? "active" : "inactive",
    })
    
    if (result.error) {
      setSaveMessage("エラー: " + result.error)
    } else {
      setSaveMessage("保存しました")
      // 一覧を更新
      const updated = await getClinics()
      if (!updated.error) {
        setClinics(updated.data as ClinicData[])
      }
    }
    setIsSaving(false)
    setTimeout(() => setSaveMessage(""), 2000)
  }

  function handleResetPassword() {
    alert(`${selectedClinic?.email} にパスワードリセットメールを送信しました`)
  }

  // 招待を送信
  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteEmail || !inviteClinicName) return
    
    setIsInviting(true)
    setInviteError("")
    setInviteSuccess("")
    
    // 医院名はメール送信時の宛名として使用（DBには保存しない）
    const result = await inviteClinic(inviteEmail, inviteClinicName)
    
    if (result.error) {
      setInviteError(result.error)
    } else {
      setInviteSuccess(`${inviteClinicName}（${inviteEmail}）に招待を送信しました`)
      setInviteEmail("")
      setInviteClinicName("")
      // 招待一覧を更新
      const updated = await getInvitations()
      if (!updated.error) {
        setInvitations(updated.data as InvitationData[])
      }
      setTimeout(() => {
        setShowInviteForm(false)
        setInviteSuccess("")
      }, 2000)
    }
    setIsInviting(false)
  }

  // 招待をキャンセル
  async function handleCancelInvitation(id: string) {
    if (!confirm("この招待をキャンセルしますか？")) return
    
    const result = await cancelInvitation(id)
    if (!result.error) {
      setInvitations(invitations.filter(inv => inv.id !== id))
    }
  }

  // 招待を再送信
  async function handleResendInvitation(id: string) {
    const result = await resendInvitation(id)
    if (!result.error) {
      const updated = await getInvitations()
      if (!updated.error) {
        setInvitations(updated.data as InvitationData[])
      }
      alert("招待を再送信しました")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">提携医院管理</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            提携歯科医院のアカウント管理と一覧
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowInviteForm(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-primary bg-white px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
          >
            <Send className="h-4 w-4" />
            医院を招待
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            医院を追加
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">読み込み中...</span>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Invitations List Table */}
      {!isLoading && invitations.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border bg-muted/50 px-6 py-4">
            <h2 className="text-lg font-semibold text-card-foreground">招待・連携医院一覧</h2>
            <p className="text-sm text-muted-foreground mt-1">
              招待した医院の状態を管理します
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-xs font-semibold text-muted-foreground">
                  <th className="px-6 py-3">医院名</th>
                  <th className="px-6 py-3">メールアドレス</th>
                  <th className="px-6 py-3">ステータス</th>
                  <th className="px-6 py-3">招待日時</th>
                  <th className="px-6 py-3 text-right">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invitations.map((inv) => {
                  const isPending = inv.status === "pending"
                  
                  return (
                    <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">
                          {inv.clinic_name || "（医院名未設定）"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {inv.clinic_email}
                      </td>
                      <td className="px-6 py-4">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            招待中
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            連携済み
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(inv.created_at).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleResendInvitation(inv.id)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                                再送信
                              </button>
                              <button
                                onClick={() => handleCancelInvitation(inv.id)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                削除
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && clinics.length === 0 && invitations.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">提携医院がありません</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            「医院を招待」または「医院を追加」ボタ��から新しい提携医院を登録し��ください
          </p>
        </div>
      )}

      {/* Clinic cards */}
      {!isLoading && clinics.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clinics.map((clinic) => {
            const fullAddress = [
              clinic.prefecture,
              clinic.city,
              clinic.address,
              clinic.building,
            ].filter(Boolean).join(" ")
            return (
              <div
                key={clinic.id}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-card-foreground">{clinic.name}</p>
                      <p className="text-xs text-muted-foreground">{clinic.doctor_name}</p>
                    </div>
                  </div>
                  {clinic.account_status === "inactive" && (
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      無効
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {clinic.phone || "-"}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {clinic.email || "-"}
                  </div>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                    {fullAddress || "-"}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground">
                    登録日: {formatDate(clinic.created_at)}
                  </p>
                  <button
                    onClick={() => openAccountModal(clinic)}
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    アカウント管理
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Account Management Modal */}
      {selectedClinic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-lg rounded-xl border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-lg font-bold">アカウント管理</h2>
              <button
                onClick={closeAccountModal}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Clinic info */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedClinic.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedClinic.doctor_name}</p>
                  </div>
                </div>
              </div>

              {/* Login info */}
              <div>
                <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  ログイン情報
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      メールアドレス
                    </label>
                    <input
                      type="email"
                      defaultValue={selectedClinic.email}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <button
                    onClick={handleResetPassword}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    パスワードリセットメールを送信
                  </button>
                </div>
              </div>

              {/* Account status */}
              <div>
                <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
                  {accountStatus ? (
                    <ToggleRight className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                  )}
                  アカウント状態
                </h3>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {accountStatus ? "有効" : "無効"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {accountStatus
                        ? "ログインとシステム利用が可能です"
                        : "ログインが無効になっています"}
                    </p>
                  </div>
                  <button
                    onClick={() => setAccountStatus(!accountStatus)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      accountStatus ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        accountStatus ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Usage stats */}
              <div>
                <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
                  <History className="h-4 w-4" />
                  利用状況
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">登録日</p>
                    <p className="text-sm font-semibold">
                      {formatDate(selectedClinic.created_at)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">最終更新</p>
                    <p className="text-sm font-semibold">
                      {formatDate(selectedClinic.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border px-5 py-4">
              {saveMessage && (
                <span className="text-sm text-emerald-600 font-medium">{saveMessage}</span>
              )}
              {!saveMessage && <span />}
              <div className="flex gap-3">
                <button
                  onClick={closeAccountModal}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                >
                  閉じる
                </button>
                <button
                  onClick={handleSaveAccount}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "保存中..." : "保存"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite form dialog */}
      {showInviteForm && (
        <InviteModal
          onClose={() => {
            setShowInviteForm(false)
            setInviteError("")
            setInviteSuccess("")
          }}
          inviteEmail={inviteEmail}
          setInviteEmail={setInviteEmail}
          inviteClinicName={inviteClinicName}
          setInviteClinicName={setInviteClinicName}
          inviteSuccess={inviteSuccess}
          inviteError={inviteError}
          isInviting={isInviting}
          onSubmit={handleInvite}
        />
      )}

      {/* Add form dialog */}
      {showAddForm && (
        <AddClinicModal
        onClose={() => setShowAddForm(false)}
          onSuccess={async () => {
            setShowAddForm(false)
            const result = await getClinics()
            if (!result.error) {
              setClinics(result.data as ClinicData[])
            }
          }}
        />
      )}
    </div>
  )
}

function AddClinicModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState<ClinicFormData>({
    name: "",
    doctorName: "",
    phone: "",
    email: "",
    postalCode: "",
    prefecture: "",
    city: "",
    address: "",
    building: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit() {
    if (!formData.name || !formData.email) {
      setError("医院名とメールアドレスは必須です")
      return
    }
    
    setIsSubmitting(true)
    setError("")
    
    const result = await addClinic(formData)
    
    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      onSuccess()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-lg rounded-xl bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-base font-semibold text-card-foreground">
          新規医院を追加
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          提携歯科医院の情報を入力してアカウントを発行します
        </p>
        
        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        
        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              医院��� <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="例: やまもと歯科"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              院長名
            </label>
            <input
              type="text"
              value={formData.doctorName}
              onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
              placeholder="例: 山本 太郎"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              電話番号
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="例: 03-1234-5678"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="例: info@yamamoto-dc.jp"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                郵便番号
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="例: 123-4567"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                都道府県
              </label>
              <input
                type="text"
                value={formData.prefecture}
                onChange={(e) => setFormData({ ...formData, prefecture: e.target.value })}
                placeholder="例: 東京都"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              市区町村
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="例: 港区"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              住所
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="例: 六本木1-2-3"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              建物名
            </label>
            <input
              type="text"
              value={formData.building}
              onChange={(e) => setFormData({ ...formData, building: e.target.value })}
              placeholder="例: ABCビル 5F"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="mt-5 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "登録中..." : "追加する"}
          </button>
        </div>
      </div>
    </div>
  )
}

// 招待フォームモーダル
function InviteModal({
  onClose,
  inviteEmail,
  setInviteEmail,
  inviteClinicName,
  setInviteClinicName,
  inviteSuccess,
  inviteError,
  isInviting,
  onSubmit,
}: {
  onClose: () => void
  inviteEmail: string
  setInviteEmail: (v: string) => void
  inviteClinicName: string
  setInviteClinicName: (v: string) => void
  inviteSuccess: string
  inviteError: string
  isInviting: boolean
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-card-foreground">医院を招待</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        
        <p className="mb-4 text-sm text-muted-foreground">
          招待したい歯科医院の情報を入力してください。招待メールが送信されます。
        </p>

        {inviteSuccess && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {inviteSuccess}
          </div>
        )}

        {inviteError && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            {inviteError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              医院名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={inviteClinicName}
              onChange={(e) => setInviteClinicName(e.target.value)}
              placeholder="例: 山田歯科医院"
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="例: info@yamada-dental.jp"
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isInviting}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isInviting || !inviteEmail || !inviteClinicName}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isInviting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  送信中...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  招待を送信
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
