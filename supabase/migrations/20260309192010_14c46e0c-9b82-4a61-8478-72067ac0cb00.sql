
-- Create update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create cards table
CREATE TABLE public.cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  network TEXT NOT NULL DEFAULT 'Visa',
  open_date TEXT NOT NULL,
  product_change_date TEXT,
  card_type TEXT NOT NULL DEFAULT 'personal',
  status TEXT NOT NULL DEFAULT 'active',
  annual_fee INTEGER NOT NULL DEFAULT 0,
  annual_fee_month INTEGER NOT NULL DEFAULT 1,
  last_annual_fee_date TEXT,
  counts_toward_524 BOOLEAN NOT NULL DEFAULT true,
  signup_bonus_date TEXT,
  category TEXT NOT NULL DEFAULT 'other',
  decision TEXT NOT NULL DEFAULT 'undecided',
  tags TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own cards" ON public.cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cards" ON public.cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cards" ON public.cards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cards" ON public.cards FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON public.cards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create benefits table
CREATE TABLE public.benefits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  credit_type TEXT NOT NULL DEFAULT 'annual',
  value_type TEXT NOT NULL DEFAULT 'dollar',
  total_amount NUMERIC NOT NULL DEFAULT 0,
  amount_used NUMERIC NOT NULL DEFAULT 0,
  reset_date TEXT,
  expiration_date TEXT,
  last_used_date TEXT,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own benefits" ON public.benefits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own benefits" ON public.benefits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own benefits" ON public.benefits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own benefits" ON public.benefits FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_benefits_updated_at BEFORE UPDATE ON public.benefits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create user_settings table
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_days INTEGER NOT NULL DEFAULT 30,
  default_hide_business BOOLEAN NOT NULL DEFAULT false,
  date_format TEXT NOT NULL DEFAULT 'MM/dd/yyyy',
  custom_tags TEXT[] NOT NULL DEFAULT '{travel,hotel,airline,cashback,business,dining,groceries,lounge,premium,points,united,marriott}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile and settings on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
