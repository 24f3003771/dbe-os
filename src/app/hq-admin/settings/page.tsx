import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";

export default async function HQAdminSettingsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Double check admin role
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  
  if (!profile || profile.role !== 'SUPER_ADMIN') {
      redirect("/");
  }

  // Fetch current setting
  const { data: settings } = await supabase
    .from('app_settings')
    .select('restrict_emails')
    .eq('id', 1)
    .single();

  const restrictEmails = settings ? settings.restrict_emails : true; // Default to true if not found

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black font-headline text-on-surface tracking-tight mb-2">Global Settings</h1>
        <p className="text-sm font-bold text-on-surface-variant">Configure platform-wide settings and security rules.</p>
      </div>

      <SettingsForm initialRestrictEmails={restrictEmails} />
    </div>
  );
}
