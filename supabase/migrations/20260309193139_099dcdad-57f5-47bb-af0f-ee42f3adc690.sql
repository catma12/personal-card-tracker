CREATE TABLE public.starred_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  card_name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, card_name)
);

ALTER TABLE public.starred_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own starred offers" ON public.starred_offers FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own starred offers" ON public.starred_offers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own starred offers" ON public.starred_offers FOR DELETE TO authenticated USING (auth.uid() = user_id);