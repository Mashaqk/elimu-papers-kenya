CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view all papers" ON public.resources;
CREATE POLICY "Admins can view all papers" ON public.resources FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can add papers" ON public.resources;
CREATE POLICY "Admins can add papers" ON public.resources FOR INSERT TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update papers" ON public.resources;
CREATE POLICY "Admins can update papers" ON public.resources FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete papers" ON public.resources;
CREATE POLICY "Admins can delete papers" ON public.resources FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view all purchases" ON public.purchases;
CREATE POLICY "Admins can view all purchases" ON public.purchases FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can read paper files" ON storage.objects;
CREATE POLICY "Admins can read paper files" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'papers' AND private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can upload paper files" ON storage.objects;
CREATE POLICY "Admins can upload paper files" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'papers' AND private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update paper files" ON storage.objects;
CREATE POLICY "Admins can update paper files" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'papers' AND private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete paper files" ON storage.objects;
CREATE POLICY "Admins can delete paper files" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'papers' AND private.has_role(auth.uid(), 'admin'));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);