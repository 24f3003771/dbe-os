import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import NoteViewer from "./NoteViewer";

export default async function UniversalNotePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

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
        .select("id, module_number, content, topic_id, lecture_id")
        .eq("subject_id", id)
        .order("module_number", { ascending: true });

    // Fetch lectures
    const { data: lectures } = await supabase
        .from("lectures")
        .select("*")
        .eq("subject_id", id)
        .order("module_number", { ascending: true })
        .order("lecture_number", { ascending: true });

    return (
        <NoteViewer
            subject={subject}
            notes={notes ?? []}
            lectures={lectures ?? []}
        />
    );
}
