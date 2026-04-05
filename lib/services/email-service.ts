import { createClient } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'

// メールトランスポーター設定（環境変数で設定）
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export interface EmailQueueItem {
  user_id: string
  email: string
  type: 'warning_60days' | 'warning_10months' | 'warning_30days' | 'warning_7days' | 'final_notice'
  scheduled_for: string
}

/**
 * 警告メールをキューに追加
 */
export async function addEmailToQueue(item: EmailQueueItem) {
  const supabase = await createClient()

  try {
    const { error } = await supabase.from('email_queue').insert({
      ...item,
      status: 'pending',
      created_at: new Date().toISOString(),
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('[v0] Add email to queue failed:', error)
    return { success: false, error }
  }
}

/**
 * 警告メールを送信
 */
export async function sendWarningEmail(
  email: string,
  userName: string,
  daysLeft: number,
  dataExportUrl: string
) {
  const subject = `重要: ご利用のアカウントは${daysLeft}日後に削除予定です`

  const htmlContent = `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0052CC; color: white; padding: 20px; text-align: center; border-radius: 5px; }
          .content { padding: 20px; border: 1px solid #ddd; margin-top: 20px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .button { 
            background: #0052CC; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 5px; 
            display: inline-block; 
            margin: 20px 0;
          }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DentalLab - アカウント削除のお知らせ</h1>
          </div>
          
          <div class="content">
            <p>${userName}様</p>
            
            <p>いつもDentalLabをご利用いただきありがとうございます。</p>
            
            <div class="warning">
              <strong>⚠️ 重要なお知らせ</strong>
              <p>
                ご利用のアカウントは<strong>${daysLeft}日後</strong>に自動削除予定です。<br>
                現在、ユーザー様のデータをバックアップすることをお勧めしています。
              </p>
            </div>
            
            <h3>必要な対応:</h3>
            <ul>
              <li><strong>データのバックアップ:</strong> 以下のリンクからCSV/PDF形式でデータをダウンロードしてください</li>
              <li><strong>アカウント復旧:</strong> アカウント削除前に弊社サポートまでご連絡ください</li>
            </ul>
            
            <a href="${dataExportUrl}" class="button">データをダウンロード</a>
            
            <h3>削除されるデータ:</h3>
            <ul>
              <li>プロフィール情報</li>
              <li>案件データ</li>
              <li>書類・指示書</li>
              <li>提携医院情報</li>
              <li>その他すべての関連データ</li>
            </ul>
            
            <p style="color: #666; font-size: 14px;">
              このメールに心当たりがない場合や、アカウントの復旧をご希望の場合は、
              お気軽にサポートまでお問い合わせください。
            </p>
          </div>
          
          <div class="footer">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tIaHAcU1Hz21sAgGFZS9xNDMRhLqQL.png" alt="ナチュラルアート" style="height: 28px; width: auto; margin-bottom: 8px;" /><br>
            このメールは自動送信です。返信はしないようお願いします。</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: htmlContent,
    })

    return { success: true }
  } catch (error) {
    console.error('[v0] Send warning email failed:', error)
    return { success: false, error }
  }
}

/**
 * 10ヶ月目のリマインドメールを送信
 */
export async function sendReminderEmail10Months(
  email: string,
  companyName: string,
  contactName: string,
  deletionDate: string,
  dataExportUrl: string,
  recontractUrl: string
) {
  const subject = `【重要】データ保管期限のご案内 - 残り2ヶ月となりました`

  const htmlContent = `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: "Hiragino Kaku Gothic Pro", "Yu Gothic", sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; }
          .header { background: #0052CC; color: white; padding: 30px; text-align: center; border-radius: 5px; }
          .content { padding: 30px; border: 1px solid #ddd; margin-top: 20px; }
          .section-title { background: #f5f5f5; padding: 10px 15px; margin-top: 20px; margin-bottom: 10px; font-weight: bold; border-left: 4px solid #0052CC; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .button { 
            background: #0052CC; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 5px; 
            display: inline-block; 
            margin: 10px 0;
            font-size: 14px;
          }
          .secondary-button {
            background: #6c757d;
            margin-left: 10px;
          }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          .attention { color: #d32f2f; font-weight: bold; }
          ul { margin: 10px 0; padding-left: 20px; }
          li { margin: 8px 0; }
        </style>
      </head>
      <body>
        <div class="container">
        <div class="header">
            <h1>クラウド歯科技工指示システム</h1>
            <p>FEETY（フィーティ）</p>
          </div>
          
          <div class="content">
            <p>${companyName}</p>
            <p>${contactName} 様</p>
            
            <p>いつも大変お世話になっております。</p>
            <p>クラウド歯科技工指示システムを運営するナチュラルアートでございます。</p>
            
            <p>本日は、お客様の大切なデータの保管期限につきまして、重要なお知らせがありご連絡いたしました。</p>
            
            <div class="warning">
              <strong>⚠️ 重要のお知らせ</strong>
              <p>当サービスでは、解約後も1年間はデータを安全に保管させていただいておりますが、お客様の保管期限まで<span class="attention">「残り2ヶ月」</span>となりました。</p>
              <p style="margin: 0;">
                <strong>■ データ保管期限：${deletionDate}</strong>
              </p>
            </div>
            
            <p>上記の期限を過ぎますと、セキュリティ保持のため、全てのデータ（指示書、画像、患者様情報等）がシステムから完全に削除されます。削除後は復元することができませんので、あらかじめご了承ください。</p>
            
            <div class="section-title">つきましては、以下のいずれかのご対応をお願い申し上げます</div>
            
            <h3>1. データの保存を希望される場合</h3>
            <p>過去の指示書データ等を残しておきたい場合は、期限までにログインし、データの書き出し（PDF・CSV等）を行ってください。</p>
            <a href="${dataExportUrl}" class="button">データをダウンロード</a>
            
            <h3>2. サービスを再開される場合</h3>
            <p>現在、以前のデータをそのまま引き継いでサービスを再開することが可能です。再度ご利用をご希望の場合は、以下のURLより再契約のお手続きをお願いいたします。</p>
            <a href="${recontractUrl}" class="button secondary-button">再契約を申し込む</a>
            
            <h3>3. データの削除に同意される場合</h3>
            <p>特にお手続きの必要はございません。期限をもって、弊社にて責任を持ってデータを消去させていただきます。</p>
            
            <div class="section-title">サポート</div>
            <p>ご不明な点や、データの取得方法についてサポートが必要な場合は、本メールへの返信またはお問い合わせフォームよりお気軽にご連絡ください。</p>
            <p>お客様のこれまでのご利用に、改めて感謝申し上げます。</p>
          </div>
          
          <div class="footer">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tIaHAcU1Hz21sAgGFZS9xNDMRhLqQL.png" alt="ナチュラルアート" style="height: 28px; width: auto; margin-bottom: 8px;" /><br>
            このメールは自動送信です。返信はしないようお願いします。</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: htmlContent,
    })

    return { success: true }
  } catch (error) {
    console.error('[v0] Send 10-month reminder email failed:', error)
    return { success: false, error }
  }
}

/**
 * キューのメールを送信
 */
export async function processEmailQueue() {
  const supabase = await createClient()

  try {
    // 送信予定のメールを取得
    const { data: emailQueue, error } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())

    if (error) throw error

    for (const emailItem of emailQueue || []) {
      // ユーザー情報を取得
      const { data: user } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', emailItem.user_id)
        .single()

      const userName = user
        ? `${user.first_name} ${user.last_name}`
        : 'ユーザー様'

      // メールを送信
      const daysLeft = Math.ceil(
        (new Date(emailItem.scheduled_for).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )

      const siteBase =
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? ''
      const dataExportUrl = siteBase ? `${siteBase}/account/settings` : ''

      const { success } = await sendWarningEmail(
        emailItem.email,
        userName,
        daysLeft,
        dataExportUrl
      )

      // キューの状態を更新
      if (success) {
        await supabase
          .from('email_queue')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('id', emailItem.id)
      } else {
        await supabase
          .from('email_queue')
          .update({
            status: 'failed',
            error: 'メール送信失敗',
          })
          .eq('id', emailItem.id)
      }
    }

    return { success: true, processed: emailQueue?.length || 0 }
  } catch (error) {
    console.error('[v0] Process email queue failed:', error)
    return { success: false, error }
  }
}
