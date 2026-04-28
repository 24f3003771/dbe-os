"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarClock, BookOpen, Timer, MessageSquare, ShoppingBag, Map, Target, Flame, Rocket, Presentation } from "lucide-react";
import { getAllSubjects } from "@/data/db";

// Desktop: Dashboard first
const desktopLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/notes", label: "Notes", icon: BookOpen },
    { href: "/quiz", label: "Quiz", icon: Target },
    { href: "/deadlines", label: "Tasks", icon: CalendarClock },
    { href: "/opportunities", label: "Opportunities", icon: Rocket },
];

// Mobile bottom nav: Dashboard in 3rd position (center)
const mobileLinks = [
    { href: "/notes", label: "Notes", icon: BookOpen },
    { href: "/quiz", label: "Quiz", icon: Target },
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/deadlines", label: "Tasks", icon: CalendarClock },
    { href: "/opportunities", label: "Opportunities", icon: Rocket },
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

                return (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center transition-all ${isBottomNav
                            ? "flex-col gap-1 px-1 py-1 min-w-[64px]"
                            : "gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
                            } ${isActive
                                ? isBottomNav ? "text-primary" : "bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary/20"
                                : "text-on-surface-variant hover:text-primary" + (isBottomNav ? "" : " hover:bg-surface-container-highest")
                            }`}
                    >
                        <Icon className={`${isBottomNav ? "w-6 h-6" : "w-4 h-4"} ${isActive && isBottomNav ? "fill-primary/10" : ""}`} />
                        {(showLabels || !isBottomNav) && (
                            <span className={`${isBottomNav ? "text-[10px] font-bold uppercase tracking-tight" : "hidden md:inline"}`}>
                                {label}
                            </span>
                        )}
                        {isBottomNav && isActive && (
                            <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"></div>
                        )}
                    </Link>
                );
            })}
        </>
    );
}
