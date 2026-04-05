-- 案件テーブル（技工所が管理する案件）
create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  lab_id uuid not null references public.labs(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  patient_name text not null,
  patient_gender text check (patient_gender in ('男性', '女性', 'その他')),
  patient_age integer,
  prosthesis_types text[] not null default '{}',
  teeth text[] not null default '{}',
  shade text,
  metal_ag boolean default false,
  metal_pd boolean default false,
  opposing_teeth text,
  bite text,
  notes text,
  status text not null default '受付' check (status in ('受付', '模型到着', '製作中', '完成', '発送済み')),
  delivery_date date,
  delivery_time text check (delivery_time in ('AM', 'PM')),
  ordered_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- インデックス
create index if not exists cases_lab_id_idx on public.cases(lab_id);
create index if not exists cases_clinic_id_idx on public.cases(clinic_id);
create index if not exists cases_status_idx on public.cases(status);
create index if not exists cases_ordered_at_idx on public.cases(ordered_at desc);

-- RLS有効化
alter table public.cases enable row level security;

-- RLSポリシー: 技工所は自分の案件のみアクセス可能
create policy "cases_lab_select" on public.cases
  for select using (
    lab_id in (
      select id from public.labs where user_id = auth.uid()
    )
  );

create policy "cases_lab_insert" on public.cases
  for insert with check (
    lab_id in (
      select id from public.labs where user_id = auth.uid()
    )
  );

create policy "cases_lab_update" on public.cases
  for update using (
    lab_id in (
      select id from public.labs where user_id = auth.uid()
    )
  );

create policy "cases_lab_delete" on public.cases
  for delete using (
    lab_id in (
      select id from public.labs where user_id = auth.uid()
    )
  );

-- RLSポリシー: 医院は自分に関連する案件のみアクセス可能
create policy "cases_clinic_select" on public.cases
  for select using (
    clinic_id in (
      select id from public.clinics where user_id = auth.uid()
    )
  );

create policy "cases_clinic_insert" on public.cases
  for insert with check (
    clinic_id in (
      select id from public.clinics where user_id = auth.uid()
    )
  );
