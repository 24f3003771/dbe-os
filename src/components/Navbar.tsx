import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Linkedin, ArrowLeft, User } from "lucide-react";


export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    // TODO: Replace with Supabase session fetching
    const user = null;
    const isLoaded = true;
    const isHome = pathname === "/";

    return (
        <nav className="bg-gradient-to-r from-slate-900 via-slate-800/95 to-slate-900 backdrop-blur-xl border-b border-slate-600/30 sticky top-0 z-10 shadow-xl shadow-black/30 print:hidden">
            <div className="max-w-5xl mx-auto px-8 sm:px-16 lg:px-24 py-3 sm:py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                    {!isHome && (
                        <button
                            onClick={() => router.push('/')}
                            className="p-1.5 sm:p-2 hover:bg-slate-700/60 transition-all duration-200 rounded-lg group mr-1"
                            aria-label="Back"
                        >
                            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-white transition-colors" />
                        </button>
                    )}

                    <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group transition-all duration-300 hover:scale-[1.02]">
                        <div className="relative w-10 h-10 flex items-center justify-center text-2xl">
                            <span>🍅</span>
                            <div className="absolute inset-0 bg-red-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent tracking-tight">DBE - OS</span>
                            <span className="text-[8px] sm:text-[9px] text-slate-400 font-semibold tracking-wider uppercase -mt-0.5">EXCEL BBA-DBE EXAMS</span>
                        </div>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <a href="https://www.linkedin.com/in/madhavgupta2002/" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-full transition-all duration-300 text-xs font-semibold border border-slate-600/30">
                        <Linkedin className="h-3.5 w-3.5" />
                        <span>Connect</span>
                    </a>
                    {isLoaded && user ? (
                        <div className="flex items-center gap-3 pl-2 border-l border-slate-700/50">
                            <div className="hidden md:flex flex-col items-end mr-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">Student</span>
                                <span className="text-xs font-black text-white">Scholar</span>
                            </div>
                            <div className="h-9 w-9 rounded-full border-2 border-indigo-500/30 flex items-center justify-center bg-slate-800 text-slate-400">
                                <User className="w-4 h-4" />
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-bold transition-colors">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
