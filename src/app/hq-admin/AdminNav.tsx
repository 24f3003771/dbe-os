"use client";

import { ShieldAlert, Users, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();
  
  return (
    <div className="bg-error border-b border-error/20 py-3 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/hq-admin" className="flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest hover:opacity-80 transition-opacity">
            <ShieldAlert className="w-5 h-5" />
            HQ Admin Secure Zone
        </Link>
        
        <div className="flex items-center gap-2 bg-black/20 p-1 rounded-xl">
          <Link 
            href="/hq-admin" 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all ${
              pathname === '/hq-admin' ? 'bg-white text-error shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4" /> Users
          </Link>
          <Link 
            href="/hq-admin/settings" 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all ${
              pathname.includes('/settings') ? 'bg-white text-error shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
