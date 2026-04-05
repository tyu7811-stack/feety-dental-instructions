-- 10ヶ月目リマインドメール用のカラムを追加
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS reminder_10months_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reminder_10months_sent_at TIMESTAMP WITH TIME ZONE;

-- コメントを追加
COMMENT ON COLUMN public.subscriptions.reminder_10months_sent IS '10ヶ月目のリマインドメール送信済みフラグ';
COMMENT ON COLUMN public.subscriptions.reminder_10months_sent_at IS '10ヶ月目のリマインドメール送信日時';
