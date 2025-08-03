-- Corriger les fonctions de sécurité pour éviter les warnings
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.user_sessions 
  WHERE expires_at < now() OR last_activity < (now() - interval '30 days');
$$;

CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.rate_limits 
  WHERE window_start < (now() - interval '1 hour');
$$;