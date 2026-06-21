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
            <div className="w-full flex justify-center sticky top-6 z-50 px-4 mb-8 pointer-events-none print:hidden">
              <header className="pointer-events-auto flex items-center justify-between bg-[#FCF8F6] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] px-8 py-3 w-full max-w-5xl border border-white">
                <Link href="/" className="flex flex-col group flex-shrink-0">
                  {user ? (
                    <>
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                        Welcome back,
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black tracking-tight text-gray-900 text-lg leading-none group-hover:text-[#E87A5D] transition-colors">
                          {user.user_metadata?.full_name?.split(' ')[0] || 'Scholar'}
                        </span>
                        <span className="text-lg leading-none">👋</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <TomatoSplash size="w-8 h-8" />
                      <span className="font-black tracking-tight text-gray-900 text-lg group-hover:text-[#E87A5D] transition-colors">
                        DBE OS
                      </span>
                    </div>
                  )}
                </Link>

                <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
                  <div className="hidden md:flex items-center gap-2">
                    <NavLinks />
                  </div>
                  
                  {/* Right side icons */}
                  <div className="md:ml-6 md:pl-6 md:border-l border-gray-200 flex items-center gap-3">
                    {user ? (
                        <>
                          {/* Tomato Balance */}
                          <Link href="/profile" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF0EB] rounded-full hover:bg-[#FFEBE5] transition-all">
                             <span className="text-sm">🍅</span>
                             <span className="font-black text-[#4A3D36] text-[13px]">{tomatoesBalance}</span>
                          </Link>
                          
                          {/* Avatar Dropdown */}
                          <div className="relative group/profile pointer-events-auto">
                            <button className="w-10 h-10 rounded-full bg-[#FFF0EB] text-[#E87A5D] flex items-center justify-center font-black text-xs border border-[#FFEBE5] hover:scale-105 transition-all shadow-sm">
                               {user.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'IJ'}
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
                        </>
                    ) : (
                      <Link href="/login" className="pointer-events-auto">
                        <button className="bg-[#E87A5D] text-white px-5 py-2 rounded-full font-bold shadow-md hover:-translate-y-0.5 transition-all text-[11px] uppercase tracking-wider">
                          Sign In
                        </button>
                      </Link>
                    )}
                  </div>
                </nav>
              </header>
            </div>

            {/* Bottom Navigation for Mobile - Strict Optimization */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface border-t border-outline-variant/10 px-4 pt-3 pb-safe-area-inset-bottom rounded-t-[2.5rem] shadow-[0_-12px_24px_rgba(0,0,0,0.08)] print:hidden pointer-events-auto">
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
