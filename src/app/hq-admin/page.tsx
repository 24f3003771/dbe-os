import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminTable from "./AdminTable";

export default async function HQAdminPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Middleware already protects this route, but doing a double check is good practice
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  
  if (!profile || profile.role !== 'SUPER_ADMIN') {
      redirect("/");
  }

  // Fetch all users on the server side initially for fast rendering
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black font-headline text-on-surface tracking-tight mb-2">User Management</h1>
        <p className="text-sm font-bold text-on-surface-variant">Manage all registered accounts, statuses, and permissions.</p>
      </div>

      <AdminTable initialUsers={users || []} />
    </div>
  );
}
