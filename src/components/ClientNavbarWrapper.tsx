"use client";

import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import { usePathname } from "next/navigation";
import { useFarmStore } from "@/hooks/useFarmStore";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";

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
            <nav className="w-full pt-4 px-6 md:px-8 relative z-50">
                <div className="mx-auto w-full max-w-[1400px] flex items-center justify-between">
                    
                    {/* Left: Mac Dots & Profile Greeting */}
                    <div className="flex items-center gap-6">
                        {/* Mac Dots */}
                        <div className="flex gap-2">
                            <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] shadow-sm border border-[#E0443E]" />
                            <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] shadow-sm border border-[#DEA123]" />
                            <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] shadow-sm border border-[#1AAB29]" />
                        </div>
                        
                        {/* Greeting */}
                        {user ? (
                            <Link href="/profile" className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-0.5">
                                    Welcome back,
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-black tracking-tight text-stone-900 text-lg leading-none">
                                        {user.user_metadata?.full_name?.split(' ')[0] || 'Scholar'}
                                    </span>
                                    <span className="text-lg leading-none">👋</span>
                                </div>
                            </Link>
                        ) : (
                            <Link href="/" className="font-black tracking-tight text-stone-900 text-lg">
                                DBE OS
                            </Link>
                        )}
                    </div>

                    {/* Center: Nav Links */}
                    <div className="hidden md:flex items-center p-1.5 bg-stone-100/50 rounded-full border border-stone-200/50">
                        <NavLinks />
                    </div>

                    {/* Right: Quick Actions */}
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-stone-100/50 hover:bg-stone-200/50 transition-colors rounded-full border border-stone-200/50">
                            <Search className="w-4 h-4 text-stone-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">⌘ K</span>
                        </button>
                        
                        {user && (
                            <>
                                <Link href="/profile" className="flex items-center gap-1.5 px-4 py-2 bg-[#FFF0EB] rounded-full hover:bg-[#FFEBE5] transition-all border border-[#FFEBE5]">
                                    <span className="text-sm leading-none">🍅</span>
                                    <span className="font-black text-[#FF5F56] text-[13px] leading-none">{tomatoesBalance}</span>
                                </Link>
                                
                                <Link href="/profile" className="w-9 h-9 rounded-full bg-[#FFF0EB] text-[#FF5F56] flex items-center justify-center font-black text-[11px] border border-[#FFEBE5] hover:scale-105 transition-all shadow-sm">
                                    {user.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'IJ'}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-6 inset-x-6 z-50">
                <div className="bg-white/90 backdrop-blur-xl border border-stone-200 shadow-xl rounded-3xl p-2 flex justify-around">
                    <NavLinks isBottomNav={true} />
                </div>
            </div>

            <AssistantWidget />
            <OfflineOverlay />
        </>
    );
}
