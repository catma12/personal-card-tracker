
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Cards table
CREATE TABLE public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  network TEXT NOT NULL DEFAULT 'Visa',
  card_type TEXT NOT NULL DEFAULT 'personal',
  status TEXT NOT NULL DEFAULT 'active',
  open_date DATE NOT NULL,
  product_change_date DATE,
  annual_fee NUMERIC NOT NULL DEFAULT 0,
  annual_fee_month INTEGER NOT NULL DEFAULT 1,
  last_annual_fee_date DATE,
  counts_toward_524 BOOLEAN NOT NULL DEFAULT true,
  signup_bonus_date DATE,
  category TEXT NOT NULL DEFAULT 'other',
  decision TEXT NOT NULL DEFAULT 'undecided',
  tags TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own cards" ON public.cards FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Benefits table
CREATE TABLE public.benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  credit_type TEXT NOT NULL DEFAULT 'annual',
  value_type TEXT NOT NULL DEFAULT 'dollar',
  total_amount NUMERIC NOT NULL DEFAULT 0,
  amount_used NUMERIC NOT NULL DEFAULT 0,
  reset_date DATE,
  expiration_date DATE,
  last_used_date DATE,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own benefits" ON public.benefits FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Settings table
CREATE TABLE public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  reminder_days INTEGER NOT NULL DEFAULT 30,
  default_hide_business BOOLEAN NOT NULL DEFAULT false,
  date_format TEXT NOT NULL DEFAULT 'MM/dd/yyyy',
  custom_tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own settings" ON public.user_settings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
