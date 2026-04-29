-- ============================================================
-- CURRICULUM SCHEMA — Full Replacement
-- Tables: terms, subjects, topics, notes, questions
-- NOTE: No separate 'modules' table — module is just a number
-- ============================================================

-- =====================
-- 1. TERMS
-- =====================
CREATE TABLE public.terms (
    id              INTEGER PRIMARY KEY CHECK (id BETWEEN 1 AND 9),
    name            TEXT NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT FALSE,
    assigned_batch  TEXT DEFAULT NULL  -- 'Batch 1', 'Batch 2', or NULL
);

-- =====================
-- 2. SUBJECTS
-- =====================
CREATE TABLE public.subjects (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term_id             INTEGER NOT NULL REFERENCES public.terms(id) ON DELETE RESTRICT,
    name                TEXT NOT NULL,
    code                TEXT NOT NULL,        -- College-assigned e.g. 'ES21x'
    module_count        INTEGER NOT NULL CHECK (module_count IN (4, 8)),
    strict_time_limit   INTEGER DEFAULT NULL, -- In minutes; NULL = use global default
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================
-- 3. TOPICS
-- =====================
CREATE TABLE public.topics (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id  UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================
-- 4. NOTES
-- =====================
CREATE TABLE public.notes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id      UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    module_number   INTEGER NOT NULL,          -- 1 to 4, or 1 to 8
    topic_id        UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    content         TEXT NOT NULL,             -- Raw markdown content
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (subject_id, module_number)         -- One note per module per subject
);

-- =====================
-- 5. QUESTIONS
-- =====================
CREATE TABLE public.questions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id      UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    type            TEXT NOT NULL CHECK (type IN ('cla', 'midterm', 'pyq', 'practice')),
    input_type      TEXT NOT NULL CHECK (input_type IN ('mcq', 'text')),
    module_from     INTEGER NOT NULL,
    module_to       INTEGER NOT NULL,
    topic_id        UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    question        TEXT NOT NULL,
    options         JSONB DEFAULT NULL,         -- Array of 4 strings; NULL for text type
    correct_index   INTEGER DEFAULT NULL CHECK (correct_index BETWEEN 0 AND 3),
    explanation     TEXT DEFAULT NULL,
    pyq_year        INTEGER DEFAULT NULL,       -- e.g. 2025
    pyq_month       TEXT DEFAULT NULL,          -- e.g. 'April'
    pyq_attempt     TEXT DEFAULT NULL,          -- e.g. 'A', 'B', 'C'
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- MCQ must have options and correct_index
    CONSTRAINT mcq_requires_options CHECK (
        input_type != 'mcq' OR (options IS NOT NULL AND correct_index IS NOT NULL)
    ),
    -- module range must be valid
    CONSTRAINT module_range_valid CHECK (module_from <= module_to),
    -- PYQ must have a year
    CONSTRAINT pyq_requires_year CHECK (
        type != 'pyq' OR pyq_year IS NOT NULL
    )
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.terms     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Helper: is the current user a SUPER_ADMIN?
-- We check the public.users table (already exists from init schema)

-- ----- TERMS -----
CREATE POLICY "terms_select_all"   ON public.terms FOR SELECT USING (true);
CREATE POLICY "terms_insert_admin" ON public.terms FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);
CREATE POLICY "terms_update_admin" ON public.terms FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);
CREATE POLICY "terms_delete_admin" ON public.terms FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- ----- SUBJECTS -----
CREATE POLICY "subjects_select_all"   ON public.subjects FOR SELECT USING (true);
CREATE POLICY "subjects_insert_admin" ON public.subjects FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);
CREATE POLICY "subjects_update_admin" ON public.subjects FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);
CREATE POLICY "subjects_delete_admin" ON public.subjects FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- ----- TOPICS -----
CREATE POLICY "topics_select_all"   ON public.topics FOR SELECT USING (true);
CREATE POLICY "topics_insert_admin" ON public.topics FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);
CREATE POLICY "topics_update_admin" ON public.topics FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);
CREATE POLICY "topics_delete_admin" ON public.topics FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- ----- NOTES -----
CREATE POLICY "notes_select_all"   ON public.notes FOR SELECT USING (true);
CREATE POLICY "notes_insert_admin" ON public.notes FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);
CREATE POLICY "notes_update_admin" ON public.notes FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);
CREATE POLICY "notes_delete_admin" ON public.notes FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- ----- QUESTIONS -----
CREATE POLICY "questions_select_all"   ON public.questions FOR SELECT USING (true);
CREATE POLICY "questions_insert_admin" ON public.questions FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);
CREATE POLICY "questions_update_admin" ON public.questions FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);
CREATE POLICY "questions_delete_admin" ON public.questions FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);
