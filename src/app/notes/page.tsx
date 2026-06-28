import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import dynamic from "next/dynamic";
const NotesDashboard = dynamic(() => import("./NotesDashboard"), {
    loading: () => <div className="animate-pulse bg-white rounded-3xl h-[600px] w-full" />
});

export default async function UniversalNotesListPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    const batch = user?.user_metadata?.batch as string | undefined;

    let subjects: { id: string; name: string; code: string; module_count: number }[] = [];
    let termName = "";
    let progressData: { subject_id: string; module_number: number; created_at: string }[] = [];

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

            if (user) {
                const { data: pData } = await supabase
                    .from("user_module_progress")
                    .select("subject_id, module_number, created_at")
                    .eq("user_id", user.id);
                progressData = pData ?? [];
            }
        }
    }

    return (
        <div className="px-4 py-8 md:p-12 bg-[#FCF8F6] min-h-screen">
            <NotesDashboard
                subjects={subjects}
                termName={termName}
                batch={batch ?? ""}
                progressData={progressData}
            />
        </div>
    );
}
