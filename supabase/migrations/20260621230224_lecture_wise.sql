-- ============================================================
-- ADD LECTURE-WISE SUPPORT
-- Creates `lectures` table and updates `notes` and `questions`
-- ============================================================

-- 1. Create lectures table
CREATE TABLE public.lectures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    module_number INTEGER NOT NULL,
    lecture_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(subject_id, module_number, lecture_number)
);

-- 2. Add lecture_id to notes
ALTER TABLE public.notes ADD COLUMN lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE;

-- 3. Add lecture_id to questions
ALTER TABLE public.questions ADD COLUMN lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE;

-- 4. Enable RLS on lectures
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

-- 5. Add RLS Policies for lectures
CREATE POLICY "lectures_select_all"   ON public.lectures FOR SELECT USING (true);
CREATE POLICY "lectures_insert_admin" ON public.lectures FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);
CREATE POLICY "lectures_update_admin" ON public.lectures FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);
CREATE POLICY "lectures_delete_admin" ON public.lectures FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);
