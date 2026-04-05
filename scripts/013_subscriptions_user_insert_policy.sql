-- ユーザーが初回解約フローで subscriptions に upsert できるようにする（既存ポリシーは SELECT/UPDATE のみだった）
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscriptions;
CREATE POLICY "Users can insert their own subscription"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
