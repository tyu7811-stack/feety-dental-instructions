-- 案件（cases）テーブルを作成
CREATE TABLE IF NOT EXISTS public.cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lab_id UUID REFERENCES public.labs(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE SET NULL,
  patient_name TEXT,
  case_number TEXT,
  status TEXT DEFAULT 'pending',
  prosthesis_type TEXT,
  material TEXT,
  shade TEXT,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLSを有効化
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- 技工所が自分の案件を読み書きできるポリシー
CREATE POLICY "Labs can manage their own cases" ON public.cases
  FOR ALL USING (
    lab_id IN (SELECT id FROM public.labs WHERE user_id = auth.uid())
  );

-- 医院が自分に関連する案件を読めるポリシー
CREATE POLICY "Clinics can view their cases" ON public.cases
  FOR SELECT USING (
    clinic_id IN (SELECT id FROM public.clinics WHERE user_id = auth.uid())
  );

-- インデックス
CREATE INDEX IF NOT EXISTS idx_cases_lab_id ON public.cases(lab_id);
CREATE INDEX IF NOT EXISTS idx_cases_clinic_id ON public.cases(clinic_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON public.cases(status);
