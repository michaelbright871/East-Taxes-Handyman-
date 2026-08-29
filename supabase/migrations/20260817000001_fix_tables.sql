-- Ensure tables exist and are granted access
-- The previous migration might have failed if tables didn't exist or were named differently
-- Based on the error "trust_stats" is missing from types, but I saw it in the UI/ResourceManager.
-- Let's check existing tables first in the next turn if this fails.

CREATE TABLE IF NOT EXISTS public.trust_stats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    label text NOT NULL,
    value integer NOT NULL,
    suffix text DEFAULT '',
    description text,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

GRANT SELECT ON public.trust_stats TO authenticated, anon;
GRANT ALL ON public.trust_stats TO service_role;

ALTER TABLE public.trust_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.trust_stats FOR SELECT TO public USING (true);

INSERT INTO public.trust_stats (label, value, suffix, description) VALUES
('Homeowners Served', 450, '+', 'Across Longview and East Texas since 2018'),
('Quality Rating', 4, '.9', 'Based on 187+ verified Google reviews'),
('Average Response', 2, 'hr', 'From first contact to scheduling your estimate'),
('Service Warranty', 1, 'yr', 'On every project we complete for your peace of mind')
ON CONFLICT DO NOTHING;
