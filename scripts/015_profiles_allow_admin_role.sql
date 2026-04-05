-- 管理ユーザー用に profiles.role / profiles.user_type に 'admin' を許可
-- テーブル定義に合わせてスキップされます

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_role_check
      CHECK (role IN ('lab', 'clinic', 'admin'));
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'user_type'
  ) THEN
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_user_type_check
      CHECK (user_type IN ('lab', 'clinic', 'admin'));
  END IF;
END $$;
