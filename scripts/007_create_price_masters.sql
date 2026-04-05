-- 金額マスタテーブル（技工所と医院ごとの単価設定）
create table if not exists public.price_masters (
  id uuid primary key default gen_random_uuid(),
  lab_id uuid not null references public.labs(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  prosthesis_type text not null,
  unit_price integer not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(lab_id, clinic_id, prosthesis_type)
);

-- インデックス
create index if not exists price_masters_lab_clinic_idx on public.price_masters(lab_id, clinic_id);

-- RLS有効化
alter table public.price_masters enable row level security;

-- RLSポリシー: 技工所は自分の単価のみアクセス可能
create policy "price_masters_lab_select" on public.price_masters
  for select using (
    lab_id in (
      select id from public.labs where user_id = auth.uid()
    )
  );

create policy "price_masters_lab_insert" on public.price_masters
  for insert with check (
    lab_id in (
      select id from public.labs where user_id = auth.uid()
    )
  );

create policy "price_masters_lab_update" on public.price_masters
  for update using (
    lab_id in (
      select id from public.labs where user_id = auth.uid()
    )
  );

create policy "price_masters_lab_delete" on public.price_masters
  for delete using (
    lab_id in (
      select id from public.labs where user_id = auth.uid()
    )
  );

-- RLSポリシー: 医院は自分に関連する単価を閲覧可能
create policy "price_masters_clinic_select" on public.price_masters
  for select using (
    clinic_id in (
      select id from public.clinics where user_id = auth.uid()
    )
  );
