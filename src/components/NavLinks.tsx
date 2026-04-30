"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarClock, BookOpen, Timer, MessageSquare, ShoppingBag, Map, Target, Flame, Rocket, Presentation, Wrench } from "lucide-react";
import { getAllSubjects } from "@/data/db";

// Desktop: Dashboard first
const desktopLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/notes", label: "Notes", icon: BookOpen },
    { href: "/quiz", label: "Quiz", icon: Target },
    { href: "/deadlines", label: "Tasks", icon: CalendarClock },
    { href: "/opportunities", label: "Opportunities", icon: Rocket },
    { href: "/tools", label: "Tools", icon: Wrench },
];

// Mobile bottom nav: Dashboard in 3rd position (center)
const mobileLinks = [
    { href: "/notes", label: "Notes", icon: BookOpen },
    { href: "/quiz", label: "Quiz", icon: Target },
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/deadlines", label: "Tasks", icon: CalendarClock },
    { href: "/tools", label: "Tools", icon: Wrench },
];

interface NavLinksProps {
    showLabels?: boolean;
    isBottomNav?: boolean;
}

export default function NavLinks({ showLabels = false, isBottomNav = false }: NavLinksProps) {
    const pathname = usePathname();
    const subjects = getAllSubjects();

    const links = isBottomNav ? mobileLinks : desktopLinks;

    const dropdownData: Record<string, { label: string; href: string }[]> = {
        Notes: subjects.map(s => ({ label: s.title, href: `/dbe_notes/${s.id}` })),
        Quiz: subjects.map(s => ({ label: s.title, href: `/${s.id}` })),
        Opportunities: [
            { label: "Competitions", href: "/opportunities/competitions" },
            { label: "Internships", href: "/opportunities/internships" },
            { label: "Pitch Decks", href: "/opportunities/pitch-decks" },
            { label: "Career Guides", href: "/opportunities/career-guides" },
        ],
    };

    return (
        <>
            {links.map(({ href, label, icon: Icon }) => {
                const isActive =
                    href === "/"
                        ? pathname === "/" || pathname.match(/^\/[A-Z]{2}\d/)
                        : pathname.startsWith(href);

                const dropdownItems = dropdownData[label];

                if (!isBottomNav && dropdownItems) {
                    return (
                        <div key={href} className="relative group">
                            <Link
                                href={href}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? "bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary/20"
                                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-highest"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden md:inline">{label}</span>
                            </Link>

                            {/* Dropdown Menu */}
                            <div className="absolute top-full left-0 pt-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                                <div className="w-64 bg-white border border-outline-variant/20 rounded-2xl shadow-2xl py-2 overflow-hidden">
                                    {dropdownItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="block px-4 py-2.5 text-xs font-bold text-stone-700 hover:text-primary hover:bg-stone-50 transition-colors uppercase tracking-tight"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                }

                const iconColors: Record<string, string> = {
                    "Notes": "text-blue-500",
                    "Quiz": "text-emerald-500",
                    "Dashboard": "text-rose-500",
                    "Tasks": "text-amber-500",
                    "Tools": "text-indigo-500",
                };

                const activeBgColors: Record<string, string> = {
                    "Notes": "bg-blue-50/80 ring-blue-100",
                    "Quiz": "bg-emerald-50/80 ring-emerald-100",
                    "Dashboard": "bg-rose-50/80 ring-rose-100",
                    "Tasks": "bg-amber-50/80 ring-amber-100",
                    "Tools": "bg-indigo-50/80 ring-indigo-100",
                };

                return (
                    <Link
                        key={href}
                        href={href}
                        className={`flex flex-col items-center transition-all ${isBottomNav
                            ? "gap-1.5 px-2 py-1 min-w-[72px]"
                            : "gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
                            } ${isActive
                                ? isBottomNav ? "text-primary" : "bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary/20"
                                : "text-on-surface-variant hover:text-primary" + (isBottomNav ? "" : " hover:bg-surface-container-highest")
                            }`}
                    >
                        <div className={`relative flex items-center justify-center transition-all duration-300 ${isBottomNav && isActive ? `w-14 h-9 rounded-2xl ring-1 ${activeBgColors[label]}` : "w-14 h-9"}`}>
                            <Icon className={`${isBottomNav ? "w-6 h-6" : "w-4 h-4"} ${isBottomNav ? iconColors[label] : ""} ${isActive && isBottomNav ? "scale-110" : ""}`} />
                        </div>
                        {(showLabels || !isBottomNav) && (
                            <span className={`${isBottomNav ? "text-[11px] font-black tracking-tight" : "hidden md:inline"} ${isActive && isBottomNav ? "text-on-surface" : "text-on-surface-variant"}`}>
                                {label}
                            </span>
                        )}
                    </Link>
                );
            })}
        </>
    );
}
