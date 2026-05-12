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
    const subjects = getAllSubjects();

    const links = isBottomNav ? mobileLinks : desktopLinks;

    const dropdownData: Record<string, { label: string; href: string }[]> = {
        Notes: subjects.map(s => ({ label: s.title, href: `/dbe_notes/${s.id}` })),
        Quiz: subjects.map(s => ({ label: s.title, href: `/${s.id}` })),
        Tools: [
            { label: "MatchForge", href: "/matchforge" },
            { label: "CGPA Calculator", href: "/tools/cgpa-calculator" },
            { label: "AI Resume Forge", href: "/tools/resume-builder" },
            { label: "Internships", href: "/tools/internships" },
            { label: "Competitions", href: "/tools/competitions" },
            { label: "Pro Pitch Decks", href: "/tools/pitch-decks" },
            { label: "Winners Bank", href: "/tools/winning-repository" },
            { label: "Career Guides", href: "/tools/career-guides" },
        ],
    };

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

                const dropdownItems = dropdownData[label];

                if (!isBottomNav && dropdownItems) {
                    // Dropdowns removed per request. Now just renders standard link.
                }

                return (
                    <Link
                        key={href}
                        href={href}
                        className={`flex transition-all ${isBottomNav
                            ? "flex-col items-center gap-1.5 px-1 py-1 min-w-[60px] flex-1"
                            : "items-center gap-2 px-4 py-2 rounded-xl group"
                            } ${isActive
                                ? isBottomNav ? "text-primary" : "bg-surface-container-highest shadow-sm ring-1 ring-outline-variant/20"
                                : "text-on-surface-variant hover:text-on-surface" + (isBottomNav ? "" : " hover:bg-surface-container-low")
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
                                <Icon className={`w-4 h-4 transition-colors ${isActive ? iconColors[label] : "text-on-surface-variant group-hover:" + iconColors[label]}`} />
                                <span className={`text-xs font-black uppercase tracking-widest ${isActive ? "text-on-surface" : "text-on-surface-variant"}`}>
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
