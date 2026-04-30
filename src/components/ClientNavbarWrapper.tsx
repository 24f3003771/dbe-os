"use client";

import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import { usePathname } from "next/navigation";
import TomatoSplash from "@/components/TomatoSplash";

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
                <TomatoSplash size="w-10 h-10" />
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
                        <Link href="/profile" className="flex items-center gap-3 group pl-4 border-l border-outline-variant/20">
                          <div className="w-9 h-9 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-black text-[11px] group-hover:bg-on-surface group-hover:text-surface transition-all duration-300 border border-outline-variant/10 shadow-inner">
                            {user.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'IJ'}
                          </div>
                          <span className="text-xs font-black text-on-surface hidden sm:block uppercase tracking-wider group-hover:text-primary transition-colors">
                            {user.user_metadata?.full_name || 'Scholar'}
                          </span>
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

          {/* Bottom Navigation for Mobile - Strict Optimization */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface border-t border-outline-variant/10 px-4 pt-3 pb-safe-area-inset-bottom rounded-t-[2.5rem] shadow-[0_-12px_24px_rgba(0,0,0,0.08)] print:hidden">
            <div className="w-12 h-1.5 bg-on-surface/10 rounded-full mx-auto mb-4" /> {/* Decoration handle */}
            <div className="flex items-center justify-around pb-2">
              <NavLinks showLabels={true} isBottomNav={true} />
            </div>
          </nav>
        </>
    );
}
