import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CurriculumManager from "./CurriculumManager";
import { getCurriculum, getOfficialSchedules } from "@/actions/curriculum";

export default async function CurriculumAdminPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    
    // Check if the user is a super admin or moderator
    if (!profile || (profile.role !== 'SUPER_ADMIN' && profile.role !== 'MODERATOR')) {
        redirect("/");
    }

    const curriculum = await getCurriculum();
    const schedules = await getOfficialSchedules();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-black font-headline text-on-surface tracking-tight mb-2">Curriculum & Schedule Manager</h1>
                <p className="text-sm font-bold text-on-surface-variant">Update term-wise subjects, notes, and official task schedules.</p>
            </div>

            <CurriculumManager initialCurriculum={curriculum} initialSchedules={schedules} />
        </div>
    );
}
