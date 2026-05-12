-- =============================================
-- Migration 001: álbum compartido
-- Reemplaza user_stickers por album_stickers
-- (una fila por lámina, sin user_id)
--
-- Ejecutar en Supabase SQL Editor ANTES de
-- hacer el deploy del nuevo código.
-- =============================================

-- 1. Crear la nueva tabla compartida
CREATE TABLE IF NOT EXISTS public.album_stickers (
  sticker_id INTEGER PRIMARY KEY REFERENCES public.stickers(id) ON DELETE CASCADE,
  count      INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Migrar datos existentes (toma el máximo count entre todos los usuarios)
INSERT INTO public.album_stickers (sticker_id, count)
SELECT sticker_id, MAX(count)
FROM public.user_stickers
GROUP BY sticker_id
ON CONFLICT (sticker_id) DO UPDATE SET count = EXCLUDED.count;

-- 3. Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS album_stickers_updated_at ON public.album_stickers;
CREATE TRIGGER album_stickers_updated_at
  BEFORE UPDATE ON public.album_stickers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 4. RLS
ALTER TABLE public.album_stickers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read album_stickers"  ON public.album_stickers;
DROP POLICY IF EXISTS "Authenticated users can insert album_stickers" ON public.album_stickers;
DROP POLICY IF EXISTS "Authenticated users can update album_stickers" ON public.album_stickers;

CREATE POLICY "Authenticated users can read album_stickers"
  ON public.album_stickers FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert album_stickers"
  ON public.album_stickers FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update album_stickers"
  ON public.album_stickers FOR UPDATE TO authenticated USING (true);

-- 5. Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.album_stickers;
