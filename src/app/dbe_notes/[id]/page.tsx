import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import NoteViewer from "./NoteViewer";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

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
    const { data: notes, error: notesError } = await supabase
        .from("notes")
        .select("*")
        .eq("subject_id", id)
        .order("module_number", { ascending: true });

    if (notesError) {
        console.error("Error fetching notes:", notesError);
    }

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
