/**
 * トップページ・料金ページで共有するコピー（表記を完全一致させる）
 */
export const rolePersonaCompactIntro = {
  clinicLead: "パートナー（歯科医院）",
  clinicTail:
    "は指示書の入力・送信に特化したシンプルな操作。請求書発行不要・最小限の作業負担。",
  labLead: "ライセンスメンバー（技工所）",
  labTail: "は受注から請求まで一元管理。フル機能アクセス。",
} as const

export const rolePersonaSection = {
  title: "医院と技工所、それぞれに合った機能",
  subtitle:
    "役割に応じて画面と機能が分かれています。まずはご自身の立場に合う内容をご確認ください。",
} as const

export const rolePersonaPartner = {
  badge: "パートナー",
  title: "歯科医院",
  lines: [
    "指示書の入力・送信に特化したシンプルな操作",
    "請求書発行不要・最小限の作業負担",
  ],
  bullets: [
    {
      id: "send",
      title: "入力 & 送信",
      body: "デジタル指示書を簡単入力、ワンクリック送信",
    },
    {
      id: "usb",
      title: "USBバックアップ",
      body: "送信データをUSBに保存してローカルバックアップ",
      /** 未実装の明示（文言も両ページで共通） */
      disclaimer: "※USBメモリへのローカルバックアップ（一括エクスポート）は現在準備中です。",
    },
    {
      id: "history",
      title: "履歴の閲覧・印刷・コピー",
      body: "過去の指示書を簡単に確認・再利用",
    },
  ],
} as const

export const rolePersonaLab = {
  badge: "ライセンスメンバー",
  title: "技工所",
  lines: ["受注から請求まで一元管理", "フル機能アクセス"],
  bullets: [
    {
      id: "inbox",
      title: "注文の受信",
      body: "パートナーからの指示書をリアルタイムで受信",
    },
    {
      id: "aggregate",
      title: "自動集計",
      body: "受注データを自動で集計・分析",
    },
    {
      id: "pdf",
      title: "請求書・納品書の発行",
      body: "PDF形式で請求書・納品書を自動生成",
    },
  ],
} as const
