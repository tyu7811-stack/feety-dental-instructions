-- サインアップ時に自動でプロファイルを作成するトリガー
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, user_type, display_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'user_type', 'clinic'),
    COALESCE(new.raw_user_meta_data ->> 'display_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;

  -- user_typeが'lab'の場合、技工所レコードも自動作成
  IF new.raw_user_meta_data ->> 'user_type' = 'lab' THEN
    INSERT INTO public.labs (user_id, name, email)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data ->> 'company_name', '新規技工所'),
      new.email
    );
  END IF;

  RETURN new;
END;
$$;

-- 既存のトリガーを削除して再作成
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
