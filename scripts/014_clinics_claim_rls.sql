-- 技工所が登録した医院行（user_id NULL）を、同じメールでサインアップした医院ユーザーが閲覧・紐づけできるようにする
-- Supabase SQL Editor で実行してください（既存ポリシーと重複する場合は DROP してから）

-- 未連携の自分メール行を SELECT（クレーム前の解決用）
DROP POLICY IF EXISTS "clinics_select_pending_by_email" ON public.clinics;
CREATE POLICY "clinics_select_pending_by_email"
  ON public.clinics FOR SELECT TO authenticated
  USING (
    user_id IS NULL
    AND email IS NOT NULL
    AND lower(trim(both from email)) = lower(trim(both from (auth.jwt() ->> 'email')))
  );

-- 未連携行に user_id を付与（クレーム）
DROP POLICY IF EXISTS "clinics_claim_by_email" ON public.clinics;
CREATE POLICY "clinics_claim_by_email"
  ON public.clinics FOR UPDATE TO authenticated
  USING (
    user_id IS NULL
    AND email IS NOT NULL
    AND lower(trim(both from email)) = lower(trim(both from (auth.jwt() ->> 'email')))
  )
  WITH CHECK (auth.uid() = user_id);
