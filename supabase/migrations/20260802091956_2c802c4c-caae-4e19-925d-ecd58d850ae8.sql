CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Grant admin to the designated email (existing + future confirmed signups)
CREATE OR REPLACE FUNCTION public.grant_admin_for_designated_email()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND lower(NEW.email) = 'testingweb200011@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_admin_for_designated_email();

CREATE TRIGGER on_auth_user_confirmed_grant_admin
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.grant_admin_for_designated_email();

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE lower(email) = 'testingweb200011@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Real paper library
CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  grade_slug text NOT NULL,
  subject_slug text NOT NULL,
  type text NOT NULL,
  term text NOT NULL,
  price_kes integer NOT NULL CHECK (price_kes >= 0),
  includes text[] NOT NULL DEFAULT '{}',
  paper_path text,
  scheme_path text,
  published boolean NOT NULL DEFAULT true,
  popular boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.resources TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO authenticated;
GRANT ALL ON public.resources TO service_role;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published papers" ON public.resources
  FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "Admins can view all papers" ON public.resources
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can add papers" ON public.resources
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update papers" ON public.resources
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete papers" ON public.resources
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX resources_grade_idx ON public.resources (grade_slug);
CREATE INDEX resources_subject_idx ON public.resources (subject_slug);

-- Admin reporting access
CREATE POLICY "Admins can view all purchases" ON public.purchases
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));