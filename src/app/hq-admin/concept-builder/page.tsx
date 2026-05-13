import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ConceptBuilderAdminPanel from "../ConceptBuilderAdminPanel";

export default async function ConceptBuilderAdminPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "SUPER_ADMIN") redirect("/");

    // Fetch all subjects across all terms
    const { data: subjects } = await supabase
        .from("subjects")
        .select("id, name, code")
        .order("name", { ascending: true });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black font-headline text-on-surface tracking-tight mb-1">Concept Builder Levels</h1>
                <p className="text-sm font-bold text-on-surface-variant">
                    Tag MCQ questions with difficulty levels (Easy / Medium / Hard) to build the gamified 3-level quiz system.
                </p>
            </div>
            <ConceptBuilderAdminPanel subjects={subjects ?? []} />
        </div>
    );
}
