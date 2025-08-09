-- Insert default profile for existing superadmin user if not exists
INSERT INTO public.profiles (id, role, must_change_password)
SELECT au.id, 'super_admin'::app_role, false
FROM auth.users au
WHERE au.email = 'superadmin@domain.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = au.id
  );