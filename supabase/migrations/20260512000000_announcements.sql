-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    batch TEXT NOT NULL,
    term TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Allow anyone to select (since client might query them without auth if needed, or with auth)
-- But we can restrict it to authenticated users to be safe.
CREATE POLICY "Enable read access for authenticated users" ON public.announcements FOR SELECT TO authenticated USING (true);

-- Allow only SUPER_ADMIN to insert/update/delete
CREATE POLICY "Enable insert for super admins" ON public.announcements FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid() AND users.role = 'SUPER_ADMIN'
    )
);

CREATE POLICY "Enable delete for super admins" ON public.announcements FOR DELETE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid() AND users.role = 'SUPER_ADMIN'
    )
);
