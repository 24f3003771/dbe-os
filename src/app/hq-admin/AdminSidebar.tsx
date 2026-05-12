"use client";

import { ShieldAlert, Users, BookOpen, Hash, Settings, LogOut, ChevronRight, Bell, Megaphone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
    { icon: Users,     label: "Users",         href: "/hq-admin",            exact: true  },
    { icon: Bell,      label: "Waitlist",      href: "/hq-admin#waitlist",   exact: true, section: "waitlist"  },
    { icon: Megaphone, label: "Announcements", href: "/hq-admin#notices",    exact: true, section: "notices"   },
    { icon: BookOpen,  label: "Curriculum",    href: "/hq-admin/curriculum", exact: false },
    { icon: Hash,      label: "Topics",        href: "/hq-admin/topics",     exact: false },
    { icon: Settings,  label: "Settings",      href: "/hq-admin/settings",   exact: false },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    const isActive = (item: typeof navItems[0]) =>
        item.exact ? pathname === item.href : pathname.startsWith(item.href);

    return (
        <aside className="w-60 min-h-screen bg-surface border-r border-outline-variant/20 flex flex-col fixed left-0 top-0 z-50 shadow-sm">
            {/* Logo */}
            <div className="p-5 border-b border-outline-variant/20 bg-error relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-3 relative z-10">
                    <img src="/icon.png" alt="Logo" className="w-10 h-10 rounded-xl shadow-lg" />
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white">HQ Admin</p>
                        <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest leading-tight">Secure Zone</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-0.5">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 px-3 py-2 mt-1">
                    Navigation
                </p>
                {navItems.map((item) => {
                    const active = isActive(item);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all group ${
                                active
                                    ? "bg-error/10 text-error"
                                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-error" : "text-on-surface-variant/60 group-hover:text-on-surface-variant"}`} />
                                <span>{item.label}</span>
                            </div>
                            {active && <ChevronRight className="w-3 h-3 text-error/50" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Sign Out */}
            <div className="p-3 border-t border-outline-variant/20">
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:text-error hover:bg-error/10 font-bold text-sm transition-all group"
                >
                    <LogOut className="w-4 h-4 group-hover:text-error" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
