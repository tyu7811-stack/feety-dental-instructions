-- 書類テーブル（納品書・請求書など）
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  lab_id uuid not null references public.labs(id) on delete cascade,
  case_id uuid references public.cases(id) on delete set null,
  clinic_id uuid references public.clinics(id) on delete set null,
  type text not null check (type in ('技工指示書', '納品書', '納品書控', '請求書')),
  document_number text,
  amount integer,
  tax_amount integer,
  total_amount integer,
  issued_at timestamp with time zone default now(),
  pdf_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- インデックス
create index if not exists documents_lab_id_idx on public.documents(lab_id);
create index if not exists documents_case_id_idx on public.documents(case_id);
create index if not exists documents_clinic_id_idx on public.documents(clinic_id);
create index if not exists documents_type_idx on public.documents(type);
create index if not exists documents_issued_at_idx on public.documents(issued_at desc);

-- RLS有効化
alter table public.documents enable row level security;

-- RLSポリシー: 技工所は自分の書類のみアクセス可能
create policy "documents_lab_select" on public.documents
  for select using (
    lab_id in (
      select id from public.labs where user_id = auth.uid()
    )
  );

create policy "documents_lab_insert" on public.documents
  for insert with check (
    lab_id in (
      select id from public.labs where user_id = auth.uid()
    )
  );

create policy "documents_lab_update" on public.documents
  for update using (
    lab_id in (
      select id from public.labs where user_id = auth.uid()
    )
  );

create policy "documents_lab_delete" on public.documents
  for delete using (
    lab_id in (
      select id from public.labs where user_id = auth.uid()
    )
  );

-- RLSポリシー: 医院は自分に関連する書類のみ閲覧可能
create policy "documents_clinic_select" on public.documents
  for select using (
    clinic_id in (
      select id from public.clinics where user_id = auth.uid()
    )
  );
