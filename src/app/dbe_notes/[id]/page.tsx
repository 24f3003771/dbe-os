import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import NoteViewer from "./NoteViewer";

export default async function UniversalNotePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
        { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    // Fetch subject
    const { data: subject } = await supabase
        .from("subjects")
        .select("id, name, code, module_count, term_id")
        .eq("id", id)
        .single();

    if (!subject) notFound();

    // Fetch all notes for this subject
    const { data: notes } = await supabase
        .from("notes")
        .select("id, module_number, content, topic_id")
        .eq("subject_id", id)
        .order("module_number", { ascending: true });

    return (
        <NoteViewer
            subject={subject}
            notes={notes ?? []}
        />
    );
}
