-- =============================================
-- Panini WC2026 - Supabase Schema
-- =============================================

-- 1. Stickers catalog
CREATE TABLE IF NOT EXISTS public.stickers (
  id       SERIAL PRIMARY KEY,
  section  TEXT NOT NULL,          -- e.g. "Argentina"
  number   INTEGER NOT NULL,       -- global sequential 1-980
  name     TEXT NOT NULL,          -- player name or description
  type     TEXT NOT NULL DEFAULT 'player'
           CHECK (type IN ('player', 'badge', 'stadium', 'special'))
);

CREATE INDEX IF NOT EXISTS idx_stickers_section ON public.stickers (section);

-- 2. Shared album (one row per sticker, no user_id — Carlos & Camila share one album)
CREATE TABLE IF NOT EXISTS public.album_stickers (
  sticker_id INTEGER PRIMARY KEY REFERENCES public.stickers(id) ON DELETE CASCADE,
  count      INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER album_stickers_updated_at
  BEFORE UPDATE ON public.album_stickers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3. Profiles (display name per user)
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, SPLIT_PART(NEW.email, '@', 1));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- Row Level Security
-- =============================================

ALTER TABLE public.stickers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;

-- Stickers: everyone authenticated can read
CREATE POLICY "Authenticated users can read stickers"
  ON public.stickers FOR SELECT
  TO authenticated USING (true);

-- Album stickers: any authenticated user can read and write
CREATE POLICY "Authenticated users can read album_stickers"
  ON public.album_stickers FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert album_stickers"
  ON public.album_stickers FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update album_stickers"
  ON public.album_stickers FOR UPDATE
  TO authenticated USING (true);

-- Profiles: everyone can read, own write
CREATE POLICY "Users can read all profiles"
  ON public.profiles FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id);

-- =============================================
-- Realtime
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.album_stickers;

-- =============================================
-- After running this schema, run supabase/seed.sql
-- to load the 980 official stickers.
-- =============================================
