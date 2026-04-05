import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { sendReminderEmail10Months } from '@/lib/services/email-service'
import { deleteUserDataPermanently } from '@/lib/services/data-export'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Cronジョブ: 解約データの自動削除と警告メール送信
 * 1日1回実行（朝2時）
 *
 * 認証: Authorization: Bearer $CRON_SECRET（Vercel Cron 推奨）または x-cron-secret
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET が設定されていません' },
      { status: 503 }
    )
  }

  const auth = request.headers.get('authorization')
  const bearer =
    auth?.startsWith('Bearer ') ? auth.slice(7).trim() : null
  const headerSecret = request.headers.get('x-cron-secret')
  const ok =
    bearer === secret || headerSecret === secret

  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY が未設定です' },
      { status: 503 }
    )
  }

  const now = new Date()

  try {
    console.log('[v0] Starting data cleanup cron job')

    const tenMonthsAgoDate = new Date(
      now.getTime() - 10 * 30 * 24 * 60 * 60 * 1000
    )

    const { data: tenMonthReminders } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'pending_deletion')
      .eq('reminder_10months_sent', false)
      .lte('cancelled_at', tenMonthsAgoDate.toISOString())
      .gte(
        'cancelled_at',
        new Date(tenMonthsAgoDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
      )

    for (const item of tenMonthReminders || []) {
      const { data: userRes, error: userErr } =
        await supabase.auth.admin.getUserById(item.user_id)
      if (userErr || !userRes.user.email) {
        console.warn('[v0] skip reminder: no email', item.user_id, userErr)
        continue
      }
      const userEmail = userRes.user.email

      let companyName = userEmail
      if (item.user_type === 'lab') {
        const { data: lab } = await supabase
          .from('labs')
          .select('name')
          .eq('user_id', item.user_id)
          .maybeSingle()
        if (lab?.name) companyName = lab.name
      } else if (item.user_type === 'clinic') {
        const { data: clinic } = await supabase
          .from('clinics')
          .select('name')
          .eq('user_id', item.user_id)
          .maybeSingle()
        if (clinic?.name) companyName = clinic.name
      }

      const contactName = 'ご担当者'

      const deletionDateObj = new Date(item.cancelled_at as string)
      deletionDateObj.setFullYear(deletionDateObj.getFullYear() + 1)
      const deletionDate = deletionDateObj.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })

      const siteBase =
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? ''
      const dataExportUrl = siteBase ? `${siteBase}/account/settings` : ''
      const recontractUrl = siteBase ? `${siteBase}/lab/billing` : ''

      const emailResult = await sendReminderEmail10Months(
        userEmail,
        companyName,
        contactName,
        deletionDate,
        dataExportUrl,
        recontractUrl
      )

      if (emailResult.success) {
        await supabase
          .from('subscriptions')
          .update({
            reminder_10months_sent: true,
            reminder_10months_sent_at: now.toISOString(),
          })
          .eq('user_id', item.user_id)
        console.log('[v0] Sent 10-month reminder to:', userEmail)
      }
    }

    console.log('[v0] 10-month reminders sent:', tenMonthReminders?.length || 0)

    const sixtyDaysAgoDate = new Date(
      now.getTime() - 60 * 24 * 60 * 60 * 1000
    )

    const { data: sixtyDayReminders } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'pending_deletion')
      .is('warning_sent_at', null)
      .lte('cancelled_at', sixtyDaysAgoDate.toISOString())

    console.log('[v0] Found 60-day reminders to send:', sixtyDayReminders?.length || 0)

    const oneYearAgoDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

    const { data: readyForDeletion } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'pending_deletion')
      .is('deleted_at', null)
      .lte('cancelled_at', oneYearAgoDate.toISOString())

    for (const item of readyForDeletion || []) {
      const deleteResult = await deleteUserDataPermanently(item.user_id)

      if (deleteResult.success) {
        try {
          await supabase.auth.admin.deleteUser(item.user_id)
        } catch (e) {
          console.error('[v0] auth.admin.deleteUser failed:', item.user_id, e)
        }

        console.log('[v0] Deleted user data:', item.user_id)
      }
    }

    console.log('[v0] Users data deleted:', readyForDeletion?.length || 0)

    return NextResponse.json(
      {
        success: true,
        message: 'Cron job completed successfully',
        stats: {
          reminder_10months_sent: tenMonthReminders?.length || 0,
          users_data_deleted: readyForDeletion?.length || 0,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Cron job failed:', error)
    return NextResponse.json(
      { error: 'Cron job failed', details: String(error) },
      { status: 500 }
    )
  }
}
