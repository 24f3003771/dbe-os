-- Table for personal to-do tasks
CREATE TABLE public.user_todos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for admin-pushed assignments (weekly)
CREATE TABLE public.global_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table to track which user completed which global assignment
CREATE TABLE public.user_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    assignment_id UUID NOT NULL REFERENCES public.global_assignments(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, assignment_id)
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.user_todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assignments ENABLE ROW LEVEL SECURITY;

-- user_todos policies
CREATE POLICY "Users can manage their own todos" ON public.user_todos
    FOR ALL USING (auth.uid()::text = user_id);

-- global_assignments policies (viewable by all, editable by none since admin edits via server or trusted role)
CREATE POLICY "Anyone can view global assignments" ON public.global_assignments
    FOR SELECT USING (true);

-- user_assignments policies
CREATE POLICY "Users can manage their own assignments" ON public.user_assignments
    FOR ALL USING (auth.uid()::text = user_id);
