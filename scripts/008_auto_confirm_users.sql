-- 開発用: 新規ユーザーのメール確認を自動的に完了するトリガー
-- 本番環境では削除してください

-- ユーザー作成時にメール確認を自動で行う関数
create or replace function public.auto_confirm_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- メール確認を自動的に完了
  update auth.users
  set 
    email_confirmed_at = now(),
    confirmed_at = now(),
    updated_at = now()
  where id = new.id
    and email_confirmed_at is null;
  
  return new;
end;
$$;

-- 既存のトリガーを削除（存在する場合）
drop trigger if exists on_auth_user_created_confirm on auth.users;

-- トリガーを作成
create trigger on_auth_user_created_confirm
  after insert on auth.users
  for each row
  execute function public.auto_confirm_user();

-- 既存の未確認ユーザーも確認済みにする
update auth.users
set 
  email_confirmed_at = now(),
  confirmed_at = now(),
  updated_at = now()
where email_confirmed_at is null;
