-- Aligns the database schema with the application's expectations.

-- 1. TEAM Table: Add missing columns and rename 'role' to 'title'
ALTER TABLE public.team
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS expertise TEXT[];

-- Migrate data from 'role' to 'title' if it exists, then drop 'role'
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'team' AND column_name = 'role') THEN
    UPDATE public.team SET title = role WHERE title IS NULL;
    ALTER TABLE public.team DROP COLUMN role;
  END IF;
END $$;


-- 2. GALLERY Table: Rename columns to match service
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'gallery' AND column_name = 'image_url') THEN
    ALTER TABLE public.gallery RENAME COLUMN image_url TO src;
  END IF;
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'gallery' AND column_name = 'title') THEN
    ALTER TABLE public.gallery RENAME COLUMN title TO alt;
  END IF;
END $$;

-- Add 'dataAiHint' column if it doesn't exist
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS "dataAiHint" TEXT;


-- 3. CONTACT_INFO Table: Rename columns
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'contact_info' AND column_name = 'phone') THEN
    ALTER TABLE public.contact_info RENAME COLUMN phone TO generalphone;
  END IF;
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'contact_info' AND column_name = 'email') THEN
    ALTER TABLE public.contact_info RENAME COLUMN email TO generalemail;
  END IF;
END $$;


-- 4. ACTIVITIES Table: Add missing columns and adjust types
ALTER TABLE public.activities
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS shortdescription TEXT,
  ADD COLUMN IF NOT EXISTS longdescription TEXT,
  ADD COLUMN IF NOT EXISTS faculty_department TEXT,
  ADD COLUMN IF NOT EXISTS courses JSONB,
  ADD COLUMN IF NOT EXISTS focusareas TEXT[],
  ADD COLUMN IF NOT EXISTS dataaihint TEXT;

-- Rename 'title' and 'description' if they exist to match code expectations
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'title') THEN
    ALTER TABLE public.activities RENAME COLUMN title TO name;
  END IF;
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'image_url') THEN
    ALTER TABLE public.activities RENAME COLUMN image_url TO imageurl;
  END IF;
END $$;


-- 5. EVENTS Table: Add missing columns
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS type TEXT;


-- 6. ANNOUNCEMENTS Table: Remove unused 'visible' column
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'visible') THEN
    ALTER TABLE public.announcements DROP COLUMN visible;
  END IF;
END $$;


-- 7. FOOTER_CONTENT Table: Change 'html' column to 'content' JSONB
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'footer_content' AND column_name = 'html') THEN
    ALTER TABLE public.footer_content DROP COLUMN html;
  END IF;
END $$;
ALTER TABLE public.footer_content ADD COLUMN IF NOT EXISTS content JSONB;

-- 8. Enable public read access on all required tables
GRANT SELECT ON TABLE public.team TO anon, authenticated;
GRANT SELECT ON TABLE public.gallery TO anon, authenticated;
GRANT SELECT ON TABLE public.contact_info TO anon, authenticated;
GRANT SELECT ON TABLE public.activities TO anon, authenticated;
GRANT SELECT ON TABLE public.events TO anon, authenticated;
GRANT SELECT ON TABLE public.announcements TO anon, authenticated;
GRANT SELECT ON TABLE public.footer_content TO anon, authenticated;
GRANT SELECT ON TABLE public.departments TO anon, authenticated;
GRANT SELECT ON TABLE public.blocks TO anon, authenticated;

-- Set Row Level Security policies
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read all team members" ON public.team;
CREATE POLICY "Public can read all team members" ON public.team FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read all gallery images" ON public.gallery;
CREATE POLICY "Public can read all gallery images" ON public.gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read contact info" ON public.contact_info;
CREATE POLICY "Public can read contact info" ON public.contact_info FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read all activities" ON public.activities;
CREATE POLICY "Public can read all activities" ON public.activities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read all events" ON public.events;
CREATE POLICY "Public can read all events" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read all announcements" ON public.announcements;
CREATE POLICY "Public can read all announcements" ON public.announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read footer content" ON public.footer_content;
CREATE POLICY "Public can read footer content" ON public.footer_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read all departments" ON public.departments;
CREATE POLICY "Public can read all departments" ON public.departments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read all blocks" ON public.blocks;
CREATE POLICY "Public can read all blocks" ON public.blocks FOR SELECT USING (true);
