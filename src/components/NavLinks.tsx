"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarClock, BookOpen, Timer, MessageSquare, ShoppingBag, Map, Target, Flame, Rocket, Presentation } from "lucide-react";

const links = [
    { href: "/notes", label: "Notes", icon: BookOpen },
    { href: "/quiz", label: "Quiz", icon: Target },
    { href: "/deadlines", label: "Tasks", icon: CalendarClock },
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/opportunities", label: "Opportunities", icon: Rocket },
];

interface NavLinksProps {
    showLabels?: boolean;
    isBottomNav?: boolean;
}

export default function NavLinks({ showLabels = false, isBottomNav = false }: NavLinksProps) {
    const pathname = usePathname();

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
