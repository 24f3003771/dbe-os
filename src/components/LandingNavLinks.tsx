"use client";

import Link from "next/link";
import { Info, Users, BookOpen, Sparkles } from "lucide-react";

export default function LandingNavLinks() {
    return (
        <div className="flex items-center gap-2">
            <Link
                href="/developers"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest text-stone-500 hover:text-stone-700 hover:bg-stone-200/50 transition-all"
            >
                <Info className="w-4 h-4 text-stone-400" />
                <span>About</span>
            </Link>
            
            <Link
                href="/features"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest text-stone-500 hover:text-stone-700 hover:bg-stone-200/50 transition-all"
            >
                <Sparkles className="w-4 h-4 text-stone-400" />
                <span>Features</span>
            </Link>

            <a
                href="https://chat.whatsapp.com/placeholder"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest text-stone-500 hover:text-stone-700 hover:bg-stone-200/50 transition-all"
            >
                <Users className="w-4 h-4 text-stone-400" />
                <span>Community</span>
            </a>

            <Link
                href="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest text-stone-500 hover:text-stone-700 hover:bg-stone-200/50 transition-all"
            >
                <BookOpen className="w-4 h-4 text-stone-400" />
                <span>Resources</span>
            </Link>
        </div>
    );
}
