"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarClock, BookOpen, Target, Rocket, Wrench } from "lucide-react";
import { getAllSubjects } from "@/data/db";

// Desktop: Dashboard first
const desktopLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/notes", label: "Notes", icon: BookOpen },
    { href: "/quiz", label: "Quiz", icon: Target },
    { href: "/deadlines", label: "Tasks", icon: CalendarClock },
    { href: "/tools", label: "Tools", icon: Wrench },
];

// Mobile bottom nav
const mobileLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/notes", label: "Notes", icon: BookOpen },
    { href: "/quiz", label: "Quiz", icon: Target },
    { href: "/deadlines", label: "Tasks", icon: CalendarClock },
    { href: "/tools", label: "Tools", icon: Wrench },
];

interface NavLinksProps {
    showLabels?: boolean;
    isBottomNav?: boolean;
}

export default function NavLinks({ showLabels = false, isBottomNav = false }: NavLinksProps) {
    const pathname = usePathname();

    const links = isBottomNav ? mobileLinks : desktopLinks;

    const iconColors: Record<string, string> = {
        "Dashboard": "text-rose-500",
        "Notes": "text-blue-500",
        "Quiz": "text-emerald-500",
        "Tasks": "text-amber-500",
        "Tools": "text-indigo-500",
    };

    const activeBgColors: Record<string, string> = {
        "Dashboard": "bg-rose-50/80 ring-rose-100",
        "Notes": "bg-blue-50/80 ring-blue-100",
        "Quiz": "bg-emerald-50/80 ring-emerald-100",
        "Tasks": "bg-amber-50/80 ring-amber-100",
        "Tools": "bg-indigo-50/80 ring-indigo-100",
    };

    return (
        <>
            {links.map(({ href, label, icon: Icon }) => {
                const isActive =
                    href === "/"
                        ? pathname === "/" || pathname.match(/^\/[A-Z]{2}\d/)
                        : pathname.startsWith(href);

                return (
                    <Link
                        key={href}
                        href={href}
                        className={`flex transition-all ${isBottomNav
                            ? "flex-col items-center gap-1.5 px-1 py-1 min-w-[60px] flex-1"
                            : `items-center gap-2 px-5 py-2.5 rounded-xl group ${isActive ? "bg-[#FFEBE5]" : "hover:bg-gray-100/50"}`
                            } ${isActive && isBottomNav ? "text-primary" : ""
                            }`}
                    >
                        {isBottomNav ? (
                            <>
                                <div className={`relative flex items-center justify-center transition-all duration-300 ${isActive ? `w-12 h-8 rounded-2xl ring-1 ${activeBgColors[label]}` : "w-12 h-8"}`}>
                                    <Icon className={`w-5 h-5 ${iconColors[label]} ${isActive ? "scale-110" : "opacity-70"}`} />
                                </div>
                                <span className={`text-[9px] font-black tracking-tight ${isActive ? "text-on-surface" : "text-on-surface-variant"}`}>
                                    {label}
                                </span>
                            </>
                        ) : (
                            <>
                                <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-[#E87A5D]" : "text-gray-400 group-hover:text-gray-600"}`} />
                                <span className={`text-[11px] font-black uppercase tracking-widest ${isActive ? "text-[#E87A5D]" : "text-gray-500 group-hover:text-gray-800"}`}>
                                    {label}
                                </span>
                            </>
                        )}
                    </Link>
                );
            })}
        </>
    );
}
