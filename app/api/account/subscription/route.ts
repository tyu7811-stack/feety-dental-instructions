import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateSubscriptionStatus, exportDataAsCSV } from '@/lib/services/data-export'

/**
 * POST /api/account/cancel-subscription
 * ユーザーのサブスクリプション解約処理
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: '認証されていません' },
        { status: 401 }
      )
    }

    // ユーザーのメールアドレスを取得
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: 'ユーザー情報が見つかりません' },
        { status: 404 }
      )
    }

    const pr = profile as Record<string, unknown>
    const raw = String(pr.user_type ?? pr.role ?? '')
    const userType: 'lab' | 'clinic' =
      raw === 'clinic' ? 'clinic' : 'lab'

    const result = await updateSubscriptionStatus(
      user.id,
      userType,
      'pending_deletion'
    )

    if (!result.success) {
      throw new Error('ステータス更新に失敗しました')
    }

    return NextResponse.json(
      {
        success: true,
        message: 'アカウントは1年後に自動削除予定です。データはダウンロード可能です。',
        deletionDate: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Cancel subscription failed:', error)
    return NextResponse.json(
      { error: '解約処理に失敗しました' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/account/export-data
 * ユーザーのデータをエクスポート
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: '認証されていません' },
        { status: 401 }
      )
    }

    // データをCSVでエクスポート
    const exportResult = await exportDataAsCSV(user.id)

    if (!exportResult.success) {
      throw new Error(exportResult.error)
    }

    // CSVファイルとしてダウンロード
    return new NextResponse(exportResult.content, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${exportResult.filename}"`,
      },
    })
  } catch (error) {
    console.error('[v0] Export data failed:', error)
    return NextResponse.json(
      { error: 'データのエクスポートに失敗しました' },
      { status: 500 }
    )
  }
}
