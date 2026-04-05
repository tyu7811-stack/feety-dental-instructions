-- 技工所テーブル
CREATE TABLE IF NOT EXISTS public.labs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  representative_name TEXT,
  postal_code TEXT,
  prefecture TEXT,
  city TEXT,
  address TEXT,
  building TEXT,
  phone TEXT,
  email TEXT,
  plan TEXT DEFAULT 'lite' CHECK (plan IN ('lite', 'standard', 'professional')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLSを有効化
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;

-- RLSポリシー（技工所は自分のデータのみ閲覧・編集可能）
CREATE POLICY "labs_select_own" ON public.labs 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "labs_insert_own" ON public.labs 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "labs_update_own" ON public.labs 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "labs_delete_own" ON public.labs 
  FOR DELETE USING (auth.uid() = user_id);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_labs_user_id ON public.labs(user_id);
CREATE INDEX IF NOT EXISTS idx_labs_name ON public.labs(name);
