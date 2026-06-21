import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import NotesDashboard from "./NotesDashboard";

export default async function UniversalNotesListPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    const batch = user?.user_metadata?.batch as string | undefined;

    let subjects: { id: string; name: string; code: string; module_count: number }[] = [];
    let termName = "";

    if (batch) {
        const { data: term } = await supabase
            .from("terms")
            .select("id, name")
            .eq("assigned_batch", batch)
            .eq("is_active", true)
            .single();

        if (term) {
            termName = term.name;
            const { data } = await supabase
                .from("subjects")
                .select("id, name, code, module_count")
                .eq("term_id", term.id)
                .order("created_at", { ascending: true });
            subjects = data ?? [];
        }
    }

    return (
        <div className="px-4 py-8 md:p-12 bg-[#FCF8F6] min-h-screen">
            <NotesDashboard
                subjects={subjects}
                termName={termName}
                batch={batch ?? ""}
            />
        </div>
    );
}
