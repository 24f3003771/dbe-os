"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarClock, BookOpen, Target, Rocket, Wrench, Code2 } from "lucide-react";

const desktopLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/notes", label: "Notes", icon: BookOpen },
    { href: "/quiz", label: "Quiz", icon: Target },
    { href: "/deadlines", label: "Tasks", icon: CalendarClock },
    { href: "/tools", label: "Tools", icon: Wrench },
    { href: "/developers", label: "Devs", icon: Code2 },
];

const mobileLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/notes", label: "Notes", icon: BookOpen },
    { href: "/quiz", label: "Quiz", icon: Target },
    { href: "/deadlines", label: "Tasks", icon: CalendarClock },
    { href: "/tools", label: "Tools", icon: Wrench },
    { href: "/developers", label: "Devs", icon: Code2 },
];

interface NavLinksProps {
    showLabels?: boolean;
    isBottomNav?: boolean;
}

export default function NavLinks({ showLabels = false, isBottomNav = false }: NavLinksProps) {
    const pathname = usePathname();

    const links = isBottomNav ? mobileLinks : desktopLinks;

    return (
        <div className={isBottomNav ? "flex w-full justify-around" : "flex items-center gap-2"}>
            {links.map(({ href, label, icon: Icon }) => {
                const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

                return (
                    <Link
                        key={href}
                        href={href}
                        className={`flex transition-all ${
                            isBottomNav
                                ? "flex-col items-center gap-1.5 px-1 py-1 min-w-[60px] flex-1"
                                : `items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest ${
                                    isActive 
                                    ? "bg-white text-[#FF5F56] shadow-sm border border-stone-200" 
                                    : "text-stone-500 hover:text-stone-700 hover:bg-stone-200/50"
                                }`
                        }`}
                    >
                        {isBottomNav ? (
                            <>
                                <Icon className={`w-5 h-5 ${isActive ? "text-[#FF5F56]" : "text-stone-400"}`} />
                                <span className={`text-[9px] font-black tracking-tight ${isActive ? "text-[#FF5F56]" : "text-stone-400"}`}>
                                    {label}
                                </span>
                            </>
                        ) : (
                            <>
                                <Icon className={`w-4 h-4 ${isActive ? "text-[#FF5F56]" : "text-stone-400"}`} />
                                <span>{label}</span>
                            </>
                        )}
                    </Link>
                );
            })}
        </div>
    );
}
