-- =============================================
-- Panini WC2026 - Supabase Schema
-- =============================================

-- 1. Stickers catalog
CREATE TABLE IF NOT EXISTS public.stickers (
  id       SERIAL PRIMARY KEY,
  section  TEXT NOT NULL,          -- e.g. "Argentina"
  number   INTEGER NOT NULL,       -- number in the album
  name     TEXT NOT NULL,          -- player name or description
  type     TEXT NOT NULL DEFAULT 'player'
           CHECK (type IN ('player', 'badge', 'stadium', 'special'))
);

CREATE INDEX IF NOT EXISTS idx_stickers_section ON public.stickers (section);

-- 2. User sticker ownership
CREATE TABLE IF NOT EXISTS public.user_stickers (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sticker_id INTEGER NOT NULL REFERENCES public.stickers(id) ON DELETE CASCADE,
  count      INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, sticker_id)
);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER user_stickers_updated_at
  BEFORE UPDATE ON public.user_stickers
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

ALTER TABLE public.stickers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;

-- Stickers: everyone authenticated can read
CREATE POLICY "Authenticated users can read stickers"
  ON public.stickers FOR SELECT
  TO authenticated USING (true);

-- User stickers: users can read ALL (needed for exchanges), write own
CREATE POLICY "Users can read all user_stickers"
  ON public.user_stickers FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Users can insert own stickers"
  ON public.user_stickers FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stickers"
  ON public.user_stickers FOR UPDATE
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stickers"
  ON public.user_stickers FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

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

-- Enable realtime on user_stickers table
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_stickers;

-- =============================================
-- Sample Data (5 sections × ~10 stickers)
-- =============================================

INSERT INTO public.stickers (section, number, name, type) VALUES
  -- Argentina
  ('Argentina', 1,  'Escudo Argentina',         'badge'),
  ('Argentina', 2,  'Lionel Messi',              'player'),
  ('Argentina', 3,  'Ángel Di María',            'player'),
  ('Argentina', 4,  'Rodrigo De Paul',           'player'),
  ('Argentina', 5,  'Julián Álvarez',            'player'),
  ('Argentina', 6,  'Nicolás Otamendi',          'player'),
  ('Argentina', 7,  'Emiliano Martínez',         'player'),
  ('Argentina', 8,  'Alexis Mac Allister',       'player'),
  ('Argentina', 9,  'Paulo Dybala',              'player'),
  ('Argentina', 10, 'Germán Pezzella',           'player'),

  -- Brasil
  ('Brasil', 11, 'Escudo Brasil',               'badge'),
  ('Brasil', 12, 'Vinicius Jr.',                'player'),
  ('Brasil', 13, 'Rodrygo',                     'player'),
  ('Brasil', 14, 'Casemiro',                    'player'),
  ('Brasil', 15, 'Marquinhos',                  'player'),
  ('Brasil', 16, 'Alisson Becker',              'player'),
  ('Brasil', 17, 'Endrick',                     'player'),
  ('Brasil', 18, 'Raphinha',                    'player'),
  ('Brasil', 19, 'Éder Militão',                'player'),
  ('Brasil', 20, 'Lucas Paquetá',               'player'),

  -- España
  ('España', 21, 'Escudo España',               'badge'),
  ('España', 22, 'Pedri',                       'player'),
  ('España', 23, 'Lamine Yamal',                'player'),
  ('España', 24, 'Rodri',                       'player'),
  ('España', 25, 'Álvaro Morata',               'player'),
  ('España', 26, 'Unai Simón',                  'player'),
  ('España', 27, 'Dani Carvajal',               'player'),
  ('España', 28, 'Ferran Torres',               'player'),
  ('España', 29, 'Gavi',                        'player'),
  ('España', 30, 'Aymeric Laporte',             'player'),

  -- Francia
  ('Francia', 31, 'Escudo Francia',             'badge'),
  ('Francia', 32, 'Kylian Mbappé',              'player'),
  ('Francia', 33, 'Antoine Griezmann',          'player'),
  ('Francia', 34, 'Ousmane Dembélé',            'player'),
  ('Francia', 35, 'Mike Maignan',               'player'),
  ('Francia', 36, 'Raphaël Varane',             'player'),
  ('Francia', 37, 'Aurélien Tchouaméni',        'player'),
  ('Francia', 38, 'Marcus Thuram',              'player'),
  ('Francia', 39, 'William Saliba',             'player'),
  ('Francia', 40, 'Kingsley Coman',             'player'),

  -- Especiales
  ('Especiales', 41, 'Trofeo Copa del Mundo',   'special'),
  ('Especiales', 42, 'MetLife Stadium - NY',    'stadium'),
  ('Especiales', 43, 'AT&T Stadium - Dallas',   'stadium'),
  ('Especiales', 44, 'Estadio Azteca - México', 'stadium'),
  ('Especiales', 45, 'Portada Álbum',           'special'),
  ('Especiales', 46, 'FIFA WC 2026 Logo',       'special'),
  ('Especiales', 47, 'SoFi Stadium - LA',       'stadium'),
  ('Especiales', 48, 'Hard Rock Stadium - MIA', 'stadium'),
  ('Especiales', 49, 'Levi\'s Stadium - SF',    'stadium'),
  ('Especiales', 50, 'FIFA 100 Stars',          'special');
