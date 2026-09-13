CREATE TABLE public.pixel_icons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 16,
  pixels JSONB NOT NULL,
  palette JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pixel_icons_name_len CHECK (char_length(name) BETWEEN 1 AND 40),
  CONSTRAINT pixel_icons_size_valid CHECK (size IN (8, 16, 32))
);

GRANT SELECT ON public.pixel_icons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pixel_icons TO authenticated;
GRANT ALL ON public.pixel_icons TO service_role;

ALTER TABLE public.pixel_icons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pixel icons are publicly readable"
  ON public.pixel_icons FOR SELECT
  USING (true);

CREATE POLICY "Authors can insert their own pixel icons"
  ON public.pixel_icons FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Authors can update their own pixel icons"
  ON public.pixel_icons FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Authors can delete their own pixel icons"
  ON public.pixel_icons FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE INDEX pixel_icons_created_at_idx ON public.pixel_icons (created_at DESC);