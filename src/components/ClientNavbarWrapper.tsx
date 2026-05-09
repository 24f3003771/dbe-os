"use client";

import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import { usePathname } from "next/navigation";
import TomatoSplash from "@/components/TomatoSplash";
import { useFarmStore } from "@/hooks/useFarmStore";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const AssistantWidget = dynamic(() => import("@/components/AssistantWidget"), {
    ssr: false,
});

const OfflineOverlay = dynamic(() => import("@/components/OfflineOverlay"), {
    ssr: false,
});

export default function ClientNavbarWrapper({ user }: { user: any }) {
    const pathname = usePathname();
    const { tomatoesBalance, isInitialized, fetchFarmData } = useFarmStore();

    useEffect(() => {
        if (user && !isInitialized) {
            fetchFarmData();
        }
    }, [user, isInitialized, fetchFarmData]);

    if (pathname.startsWith('/hq-admin')) {
        return null;
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
              <Link href="/" className="flex flex-col group flex-shrink-0">
                {user ? (
                  <>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 group-hover:text-primary transition-all">
                      Welcome back,
                    </span>
                    <span className="font-bold font-headline tracking-tighter text-[#1A1A1A] text-xl group-hover:text-primary transition-all">
                      {user.user_metadata?.full_name?.split(' ')[0] || 'Scholar'}
                    </span>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <TomatoSplash size="w-12 h-12" />
                    <span className="font-bold font-headline tracking-tighter text-[#1A1A1A] text-xl group-hover:text-primary transition-all">
                      DBE OS
                    </span>
                  </div>
                )}
              </Link>

              <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium text-on-surface-variant">
                <div className="hidden md:flex items-center gap-1">
                  <NavLinks />
                </div>
                <div className="md:ml-4 md:pl-4 md:border-l border-outline-variant/20 flex items-center gap-2">
                  <div className="flex flex-col items-end gap-1">
                    {user ? (
                        <div className="flex items-center gap-2">
                          {/* Global Tomato Balance */}
                          <Link href="/profile" className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-highest/50 rounded-full border border-outline-variant/10 hover:bg-white hover:shadow-sm transition-all duration-300">
                             <span className="text-sm">🍅</span>
                             <span className="font-black text-on-surface text-[13px]">{tomatoesBalance}</span>
                          </Link>

                          <div className="relative group/profile">
                            <button 
                              className="flex items-center gap-3 group pl-2 transition-all"
                            >
                              <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-black text-[11px] group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 border border-outline-variant/10 shadow-inner overflow-hidden">
                                {user.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'IJ'}
                              </div>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute top-full right-0 pt-3 z-50 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-300 translate-y-2 group-hover/profile:translate-y-0">
                                <div className="w-64 bg-surface border border-outline-variant/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] py-4 overflow-hidden backdrop-blur-xl">
                                    <div className="px-6 pb-4 mb-2 border-b border-outline-variant/10">
                                        <p className="text-xs font-black text-on-surface truncate">{user.user_metadata?.full_name || 'Student'}</p>
                                        <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest truncate">{user.email}</p>
                                    </div>
                                    <div className="px-2 space-y-1">
                                        <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-on-surface hover:bg-primary/5 hover:text-primary transition-all">
                                            <span className="material-symbols-outlined text-lg">person</span>
                                            My Profile
                                        </Link>
                                        <Link href="/deadlines" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-on-surface hover:bg-primary/5 hover:text-primary transition-all">
                                            <span className="material-symbols-outlined text-lg">task_alt</span>
                                            My Tasks
                                        </Link>
                                        <Link href="/tools/cgpa-calculator" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-on-surface hover:bg-primary/5 hover:text-primary transition-all">
                                            <span className="material-symbols-outlined text-lg">calculate</span>
                                            CGPA Tracker
                                        </Link>
                                        <div className="h-px bg-outline-variant/10 mx-4 my-2" />
                                        <form action="/auth/signout" method="post">
                                          <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-error hover:bg-error/5 transition-all text-left">
                                              <span className="material-symbols-outlined text-lg">logout</span>
                                              Sign Out
                                          </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>
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
          <AssistantWidget />
          <OfflineOverlay />
        </>
    );
}
