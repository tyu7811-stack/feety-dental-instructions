-- Remove any existing triggers on auth.users that auto-insert into public tables
-- This prevents "Database error saving new user" errors during signup

-- Drop the trigger if it exists (this won't error if it doesn't exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user();
