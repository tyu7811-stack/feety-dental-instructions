-- clinic_relations テーブルに clinic_name カラムを追加
ALTER TABLE public.clinic_relations ADD COLUMN IF NOT EXISTS clinic_name TEXT;
