import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// This route uses the SERVICE ROLE key to delete from Supabase Auth.
// It must ONLY be called from the server-guarded admin panel.
const getAdminClient = () =>
    createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

export async function DELETE(req: Request) {
    try {
        const { userId } = await req.json();
        if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

        const admin = getAdminClient();

        // 1. Delete from public.users table
        const { error: dbError } = await admin.from("users").delete().eq("id", userId);
        if (dbError) return NextResponse.json({ error: `DB delete failed: ${dbError.message}` }, { status: 500 });

        // 2. Delete from Supabase Auth
        const { error: authError } = await admin.auth.admin.deleteUser(userId);
        if (authError) return NextResponse.json({ error: `Auth delete failed: ${authError.message}` }, { status: 500 });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
