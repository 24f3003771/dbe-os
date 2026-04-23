"use client";

import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import { usePathname } from "next/navigation";

export default function ClientNavbarWrapper({ user }: { user: any }) {
    const pathname = usePathname();

    if (pathname.startsWith('/hq-admin')) {
        return null;
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                <div className="relative w-9 h-9 flex items-center justify-center">
                  <div className="absolute inset-0 bg-red-500 rounded-full shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-0 w-3 h-1.5 bg-[#29664c] rounded-full -translate-y-[20%]" />
                  <span className="relative z-10 font-black text-white text-xs tracking-tighter">DB</span>
                </div>
                <span className="font-bold font-headline tracking-tighter text-[#1A1A1A] text-xl group-hover:text-red-500 transition-colors">
                  DBE OS
                </span>
              </Link>
              <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium text-on-surface-variant">
                <div className="hidden md:flex items-center gap-1">
                  <NavLinks />
                </div>
                <div className="md:ml-4 md:pl-4 md:border-l border-outline-variant/20 flex items-center gap-2">
                  <div className="flex flex-col items-end gap-1">
                    {user ? (
                        <Link href="/profile" className="flex items-center gap-2 group">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-[10px] group-hover:bg-primary group-hover:text-white transition-colors border border-primary/20">
                            {user.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'MS'}
                          </div>
                          <span className="text-xs font-bold text-on-surface hidden sm:block group-hover:text-primary transition-colors">{user.user_metadata?.full_name || 'Scholar'}</span>
                        </Link>
                    ) : (
                      <>
                        <Link href="/login">
                          <button className="bg-primary text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-95 text-[10px] sm:text-xs uppercase tracking-wider">
                            Sign In
                          </button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </nav>
            </div>
          </header>

          {/* Bottom Navigation for Mobile */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface/90 backdrop-blur-xl border-t border-outline-variant/20 px-4 py-2 pb-safe-area-inset-bottom shadow-[0_-4px_12px_rgba(0,0,0,0.05)] print:hidden">
            <div className="flex items-center justify-around">
              <NavLinks showLabels={true} isBottomNav={true} />
            </div>
          </nav>
        </>
    );
}
