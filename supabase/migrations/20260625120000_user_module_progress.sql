-- Migration to track user progress for specific modules

CREATE TABLE IF NOT EXISTS public.user_module_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    module_number INTEGER NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, subject_id, module_number)
);

-- Enable RLS
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view their own module progress"
    ON public.user_module_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own module progress"
    ON public.user_module_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_user_module_progress_user_subject 
    ON public.user_module_progress(user_id, subject_id);
