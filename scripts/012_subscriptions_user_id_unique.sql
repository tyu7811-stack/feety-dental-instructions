-- 1ユーザー1サブスクリプション: user_id に UNIQUE を付与
-- 重複がある場合は created_at が新しい行を残し、それ以外を削除（空テーブルでは何も削除しない）

WITH ranked AS (
  SELECT
    ctid,
    row_number() OVER (
      PARTITION BY user_id
      ORDER BY created_at DESC NULLS LAST, id DESC
    ) AS rn
  FROM public.subscriptions
)
DELETE FROM public.subscriptions s
USING ranked r
WHERE s.ctid = r.ctid
  AND r.rn > 1;

ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);

COMMENT ON CONSTRAINT subscriptions_user_id_key ON public.subscriptions IS
  '有効なサブスクリプションはユーザーあたり1件のみ';
