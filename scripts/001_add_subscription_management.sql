-- 解約管理テーブルを作成
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('lab', 'clinic')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'pending_deletion', 'deleted')),
  plan TEXT DEFAULT 'standard',
  
  -- 重要な日付
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  scheduled_deletion_at TIMESTAMP WITH TIME ZONE,
  warning_sent_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- メタデータ
  cancellation_reason TEXT,
  data_exported BOOLEAN DEFAULT FALSE,
  last_export_at TIMESTAMP WITH TIME ZONE
);

-- インデックスを作成
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_scheduled_deletion ON public.subscriptions(scheduled_deletion_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_warning_sent ON public.subscriptions(warning_sent_at);

-- RLSを有効化
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLSポリシーを作成
CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- 管理者用ポリシー（service_roleでアクセス）
CREATE POLICY "Service role can manage all subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- データ削除ログテーブル
CREATE TABLE IF NOT EXISTS public.deletion_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id),
  user_id UUID NOT NULL,
  user_type TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('warning_sent', 'data_exported', 'data_deleted')),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLSを有効化
ALTER TABLE public.deletion_logs ENABLE ROW LEVEL SECURITY;

-- 管理者のみアクセス可能
CREATE POLICY "Service role can manage deletion logs"
  ON public.deletion_logs FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- メール送信キューテーブル
CREATE TABLE IF NOT EXISTS public.email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  to_name TEXT,
  subject TEXT NOT NULL,
  template TEXT NOT NULL,
  template_data JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON public.email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled ON public.email_queue(scheduled_at);

-- RLSを有効化
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

-- 管理者のみアクセス可能
CREATE POLICY "Service role can manage email queue"
  ON public.email_queue FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
