"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function markModuleComplete(subjectId: string, moduleNumber: number) {
    try {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Unauthorized");

        const { error } = await supabase
            .from("user_module_progress")
            .insert({
                user_id: user.id,
                subject_id: subjectId,
                module_number: moduleNumber
            })
            // Ignore if already marked complete
            .upsert({
                user_id: user.id,
                subject_id: subjectId,
                module_number: moduleNumber
            }, { onConflict: 'user_id, subject_id, module_number' });

        if (error) {
            console.error("markModuleComplete error:", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getCompletedModules(subjectId: string): Promise<number[]> {
    try {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return [];

        const { data, error } = await supabase
            .from("user_module_progress")
            .select("module_number")
            .eq("user_id", user.id)
            .eq("subject_id", subjectId);

        if (error) {
            console.error("getCompletedModules error:", error);
            return [];
        }

        return data.map(row => row.module_number);
    } catch (e) {
        console.error("getCompletedModules exception:", e);
        return [];
    }
}
