-- 歯科医院テーブル
CREATE TABLE IF NOT EXISTS public.clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  lab_id UUID REFERENCES public.labs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  doctor_name TEXT,
  postal_code TEXT,
  prefecture TEXT,
  city TEXT,
  address TEXT,
  building TEXT,
  phone TEXT,
  email TEXT,
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLSを有効化
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

-- RLSポリシー
-- 医院は自分のデータを閲覧可能
CREATE POLICY "clinics_select_own" ON public.clinics 
  FOR SELECT USING (auth.uid() = user_id);

-- 技工所は自分に紐づく医院を閲覧可能
CREATE POLICY "clinics_select_by_lab" ON public.clinics 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.labs 
      WHERE labs.id = clinics.lab_id 
      AND labs.user_id = auth.uid()
    )
  );

-- 技工所は医院を追加・編集・削除可能
CREATE POLICY "clinics_insert_by_lab" ON public.clinics 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.labs 
      WHERE labs.id = lab_id 
      AND labs.user_id = auth.uid()
    )
  );

CREATE POLICY "clinics_update_by_lab" ON public.clinics 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.labs 
      WHERE labs.id = clinics.lab_id 
      AND labs.user_id = auth.uid()
    )
  );

CREATE POLICY "clinics_delete_by_lab" ON public.clinics 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.labs 
      WHERE labs.id = clinics.lab_id 
      AND labs.user_id = auth.uid()
    )
  );

-- インデックス
CREATE INDEX IF NOT EXISTS idx_clinics_user_id ON public.clinics(user_id);
CREATE INDEX IF NOT EXISTS idx_clinics_lab_id ON public.clinics(lab_id);
CREATE INDEX IF NOT EXISTS idx_clinics_name ON public.clinics(name);
