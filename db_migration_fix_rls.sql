
-- Helper function to create a public SELECT policy if one doesn't exist for a table.
CREATE OR REPLACE FUNCTION _maybe_create_select_policy(table_name TEXT) 
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = table_name 
    AND policyname = table_name || '_public_select'
  ) THEN
    EXECUTE 'CREATE POLICY "' || table_name || '_public_select" ON public.' || table_name || ' FOR SELECT USING (true)';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant public read-only access to the 'blocks' table.
SELECT _maybe_create_select_policy('blocks');

-- Also ensure other critical public tables have read access.
SELECT _maybe_create_select_policy('announcements');
SELECT _maybe_create_select_policy('events');
SELECT _maybe_create_select_policy('departments');
SELECT _maybe_create_select_policy('team');
SELECT _maybe_create_select_policy('gallery');
SELECT _maybe_create_select_policy('contact_info');
SELECT _maybe_create_select_policy('footer_content');
SELECT _maybe_create_select_policy('activities');
