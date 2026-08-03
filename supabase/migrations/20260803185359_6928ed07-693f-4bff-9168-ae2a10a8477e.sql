CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (_user_id = auth.uid() OR auth.uid() IS NULL)
  )
$function$;

CREATE POLICY "Buyers can read files they purchased"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'papers'
  AND EXISTS (
    SELECT 1
    FROM public.purchases p
    JOIN public.resources r ON r.id::text = p.resource_id
    WHERE p.user_id = auth.uid()
      AND p.status = 'paid'
      AND (r.paper_path = storage.objects.name OR r.scheme_path = storage.objects.name)
  )
);