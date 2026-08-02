CREATE POLICY "Admins can read paper files" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'papers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can upload paper files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'papers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update paper files" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'papers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete paper files" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'papers' AND public.has_role(auth.uid(), 'admin'));