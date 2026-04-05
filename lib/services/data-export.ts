import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

interface ExportOptions {
  format: 'csv' | 'pdf'
  labId?: string
}

/**
 * ユーザーのすべてのデータをCSV形式でエクスポート
 */
export async function exportDataAsCSV(userId: string) {
  const supabase = await createClient()

  try {
    const { data: labRows } = await supabase
      .from('labs')
      .select('id')
      .eq('user_id', userId)

    const labIds = (labRows ?? []).map((r) => r.id)

    const casesQuery =
      labIds.length > 0
        ? supabase.from('cases').select('*').in('lab_id', labIds)
        : Promise.resolve({ data: [] as unknown[] })

    const documentsQuery =
      labIds.length > 0
        ? supabase.from('documents').select('*').in('lab_id', labIds)
        : Promise.resolve({ data: [] as unknown[] })

    const [
      { data: profileData },
      { data: labData },
      { data: casesData },
      { data: documentsData },
      { data: clinicsData },
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId),
      supabase.from('labs').select('*').eq('user_id', userId),
      casesQuery,
      documentsQuery,
      supabase.from('clinics').select('*').eq('user_id', userId),
    ])

    const csvContent = [
      'Data Export Report',
      `Generated: ${new Date().toISOString()}`,
      `User ID: ${userId}`,
      '',
      '--- Profile Information ---',
      JSON.stringify(profileData, null, 2),
      '',
      '--- Lab Information ---',
      JSON.stringify(labData, null, 2),
      '',
      '--- Cases ---',
      JSON.stringify(casesData, null, 2),
      '',
      '--- Documents ---',
      JSON.stringify(documentsData, null, 2),
      '',
      '--- Clinics ---',
      JSON.stringify(clinicsData, null, 2),
    ].join('\n')

    return {
      success: true,
      content: csvContent,
      filename: `dental-data-export-${userId}-${Date.now()}.csv`,
    }
  } catch (error) {
    console.error('[v0] Export failed:', error)
    return {
      success: false,
      error: 'データのエクスポートに失敗しました',
    }
  }
}

/**
 * ユーザーのデータを削除してログを記録（Cron 等は SUPABASE_SERVICE_ROLE_KEY で RLS バイパス）
 */
export async function deleteUserDataPermanently(userId: string) {
  const admin = getSupabaseAdmin()
  const supabase = admin ?? (await createClient())

  try {
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    const pr = profileRow as Record<string, unknown> | null
    const raw = String(pr?.user_type ?? pr?.role ?? '')
    const userType: 'lab' | 'clinic' =
      raw === 'clinic' ? 'clinic' : 'lab'

    const deletionResult = {
      deletedAt: new Date().toISOString(),
      userId,
      tablesDeleted: [] as string[],
    }

    const { error: labsErr } = await supabase
      .from('labs')
      .delete()
      .eq('user_id', userId)
    if (!labsErr) deletionResult.tablesDeleted.push('labs')

    const { error: clinicsErr } = await supabase
      .from('clinics')
      .delete()
      .eq('user_id', userId)
    if (!clinicsErr) deletionResult.tablesDeleted.push('clinics')

    const { error: logErr } = await supabase.from('deletion_logs').insert({
      user_id: userId,
      user_type: userType,
      action: 'data_deleted',
      details: deletionResult,
    })
    if (logErr) {
      console.error('[v0] deletion_logs insert failed:', logErr)
    }

    const dataOk = !labsErr && !clinicsErr

    return {
      success: dataOk,
      message: dataOk
        ? 'アプリデータの削除が完了しました（認証ユーザーは別途削除してください）'
        : 'labs / clinics の削除に失敗した可能性があります',
    }
  } catch (error) {
    console.error('[v0] Permanent deletion failed:', error)
    return {
      success: false,
      error: 'データの削除に失敗しました',
    }
  }
}

/**
 * 解約ステータスを更新（public.subscriptions）
 */
export async function updateSubscriptionStatus(
  userId: string,
  userType: 'lab' | 'clinic',
  status: 'active' | 'cancelled' | 'pending_deletion'
) {
  const supabase = await createClient()

  try {
    const now = Date.now()
    const row: Record<string, unknown> = {
      user_id: userId,
      user_type: userType,
      status,
    }

    if (status === 'cancelled' || status === 'pending_deletion') {
      row.cancelled_at = new Date().toISOString()
    } else {
      row.cancelled_at = null
    }

    if (status === 'pending_deletion') {
      row.scheduled_deletion_at = new Date(
        now + 365 * 24 * 60 * 60 * 1000
      ).toISOString()
    } else {
      row.scheduled_deletion_at = null
    }

    const { error } = await supabase
      .from('subscriptions')
      .upsert(row, { onConflict: 'user_id' })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('[v0] Update subscription status failed:', error)
    return { success: false, error }
  }
}
