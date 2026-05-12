"use client";

import { useFarmStore } from "@/hooks/useFarmStore";
import { motion, AnimatePresence } from "framer-motion";
import { Droplet, Sprout, Sun, Leaf, Flame, Trash2, BookOpen, ShoppingBag, Target, Calendar, Users, Zap, Rocket, ArrowRight, Trophy, ChevronRight, Wrench, Award, Megaphone, Bell } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Caveat } from "next/font/google";
import { getAllSubjects } from "@/data/db";
import TomatoSplash from "@/components/TomatoSplash";
import UniversalStats from "@/components/UniversalStats";
import { createClient } from "@/utils/supabase/client";

const caveat = Caveat({ subsets: ["latin"], weight: ["400", "700"] });

const BATCH_2_SCHEDULE = [
  { date: "2026-05-23", title: "Term 2 Exams (Day 1): Comm, Eco, Accounting" },
  { date: "2026-05-24", title: "Term 2 Exams (Day 2): IKS, Stats 2, FoBC II" },
];

const BATCH_1_SCHEDULE = [
  // Placeholder: Update when Batch 1 schedule is available
  { date: "2026-05-25", title: "Batch 1 Term Exams Placeholder" },
];

const ANNOUNCEMENTS_B2 = [
  { id: 1, title: "Exam Schedule Released", text: "Term 2 Final In-Centre exams are set for May 23rd & 24th. Start preparing!", date: "2 days ago" },
  { id: 2, title: "Projects Update", text: "Dates for Website Development & Rs. 250 Venture will be shared by the Support team soon.", date: "4 days ago" },
];

const ANNOUNCEMENTS_B1 = [
  { id: 1, title: "Batch 1 Updates", text: "Term schedules will be updated shortly. Keep an eye on this space.", date: "1 week ago" },
];

const IPadSidebar = () => {
  const [user, setUser] = useState<any>(null);
  const [batch, setBatch] = useState("Batch 2"); // Defaulting to Batch 2 to show the schedule
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        if (user.user_metadata?.batch) {
          setBatch(user.user_metadata.batch);
        }
      }
    };
    fetchUser();
  }, []);

  const schedule = batch === "Batch 1" ? BATCH_1_SCHEDULE : BATCH_2_SCHEDULE;
  const announcements = batch === "Batch 1" ? ANNOUNCEMENTS_B1 : ANNOUNCEMENTS_B2;

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  const today = new Date();
  const currentMonthStr = String(today.getMonth() + 1).padStart(2, '0');
  const currentYearStr = String(today.getFullYear());
  
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  // Helper to check if a day has a scheduled event
  const isScheduled = (day: number) => {
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${currentYearStr}-${currentMonthStr}-${dayStr}`;
    return schedule.some(s => s.date === dateStr);
  };

  return (
    <div className="sticky top-24 bg-[#FFFCF8] rounded-[2rem] border-[8px] border-[#E5E5EA] shadow-xl p-6 md:p-8 flex flex-col h-[75vh] min-h-[600px] overflow-y-auto overflow-x-hidden" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, rgba(0,0,0,0.06) 39px, rgba(0,0,0,0.06) 40px)', backgroundAttachment: 'local', backgroundPosition: '0 1rem' }}>
        
        {/* iPad Camera details */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-black/80 ring-2 ring-black/10"></div>
        <div className="absolute top-3.5 left-[calc(50%+1rem)] w-1 h-1 rounded-full bg-green-500 shadow-[0_0_4px_#22c55e]"></div>
        
        <div className={`mt-8 ${caveat.className} flex-1 flex flex-col`}>
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h2 className="text-4xl text-[#2c3e50] font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">{user?.user_metadata?.first_name ? `${user.user_metadata.first_name}'s` : 'My'} Month</h2>
                <span className="text-xl text-[#e74c3c] font-bold rotate-[-5deg] border-b-2 border-[#e74c3c] border-dashed">{today.toLocaleString('default', { month: 'long' })}</span>
            </div>
            
            {/* Calendar */}
            <div className="grid grid-cols-7 gap-x-1 gap-y-2 text-center mb-6 text-[#34495e] shrink-0">
                {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-2xl font-bold opacity-70">{d}</div>)}
                {calendarDays.map((d, i) => {
                    const hasEvent = d ? isScheduled(d) : false;
                    return (
                    <div key={i} className="relative aspect-square flex items-center justify-center text-2xl font-bold">
                        {d}
                        {d && d < today.getDate() && !hasEvent && (
                            <svg className="absolute inset-0 w-full h-full text-[#e74c3c]/80 pointer-events-none drop-shadow-sm" viewBox="0 0 100 100">
                                <path d="M20,20 Q50,40 80,80 M80,20 Q50,60 20,80" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
                            </svg>
                        )}
                        {d === today.getDate() && (
                            <div className="absolute inset-1 border-4 border-[#3498db] rounded-full opacity-60 mix-blend-multiply"></div>
                        )}
                        {hasEvent && (
                            <div className="absolute inset-1 bg-amber-200/40 border-2 border-amber-400 rounded-full mix-blend-multiply animate-pulse"></div>
                        )}
                    </div>
                )})}
            </div>

            <div className="flex items-center justify-between mb-4 mt-2 shrink-0">
                <h2 className="text-4xl text-[#2c3e50] font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)] flex items-center gap-2">
                    Official Notice <Megaphone className="w-6 h-6 text-[#e74c3c] mt-1" />
                </h2>
                <span className="text-lg text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-xl font-sans text-sm">{batch}</span>
            </div>
            
            {/* Announcements Slideshow */}
            <div className="flex-1 min-h-[240px] relative bg-white/40 rounded-3xl border-2 border-dashed border-[#3498db]/30 p-6 overflow-hidden flex flex-col justify-center mt-2">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-3"
                    >
                        <div className="inline-flex items-center gap-2 bg-[#e74c3c]/10 text-[#e74c3c] px-3 py-1 rounded-full text-xs font-sans font-bold uppercase tracking-widest">
                            <Bell className="w-3.5 h-3.5" /> {announcements[currentSlide].date}
                        </div>
                        <h3 className="text-3xl font-bold text-[#2c3e50] leading-tight">
                            {announcements[currentSlide].title}
                        </h3>
                        <p className="text-2xl text-[#34495e]/80 leading-relaxed font-medium">
                            {announcements[currentSlide].text}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Slideshow dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {announcements.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-6 bg-[#3498db]' : 'w-2 bg-[#3498db]/30'}`}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-6 text-center text-[#95a5a6] text-xl opacity-80 italic shrink-0">-- updates pulled from HQ --</div>
        </div>
    </div>
  )
}

export default function Dashboard() {
  // TODO: Fetch user session from Supabase
  const user = null as any;
  const { totalTomatoesEarned, tomatoesBalance, position, rank, fetchFarmData, isInitialized } = useFarmStore();
  const subjects = getAllSubjects();
  const notesPreview = subjects.slice(0, 3);

  useEffect(() => {
    if (!isInitialized) fetchFarmData();
  }, [isInitialized, fetchFarmData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto pb-20">
      
      {/* Left Main Content */}
      <div className="lg:col-span-8 space-y-8">
        {/* Header Status Section */}
        <UniversalStats />

            {/* Feature Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notes Section */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/15 shadow-sm flex flex-col group">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black font-headline text-on-surface tracking-tight uppercase flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" /> Notes
                        </h3>
                    </div>
                    <div className="flex-1 space-y-3 mb-6">
                        {notesPreview.map((note: any, idx: number) => (
                            <Link key={note.id} href={`/dbe_notes/${note.id}`} className="block bg-surface-container-low border border-outline-variant/10 p-4 rounded-2xl hover:bg-surface-container hover:border-primary/30 transition-all group/item shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                            {idx + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold font-headline text-on-surface group-hover/item:text-primary transition-colors truncate">{note.title}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover/item:text-primary transition-colors group-hover/item:translate-x-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Link href="/notes" className="block mt-auto">
                        <button className="w-full py-3.5 bg-primary/5 hover:bg-primary/10 rounded-xl text-xs font-black uppercase tracking-widest text-primary transition-all border border-primary/10">View All</button>
                    </Link>
                </div>

                {/* Quiz & Practice Section */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/15 shadow-sm flex flex-col group relative overflow-hidden">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black font-headline text-on-surface tracking-tight uppercase flex items-center gap-2">
                                <Rocket className="w-5 h-5 text-indigo-600" /> Quiz
                            </h3>
                        </div>
                        <div className="flex-1 space-y-3 mb-6">
                            <Link href="/quiz/practice" className="block bg-surface-container-low border border-outline-variant/10 p-4 rounded-2xl hover:bg-surface-container hover:border-indigo-300 transition-all group/item shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                            <Rocket className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold font-headline text-on-surface group-hover/item:text-indigo-600 transition-colors truncate">Practice</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover/item:text-indigo-600 transition-colors group-hover/item:translate-x-1" />
                                </div>
                            </Link>

                            <Link href="/quiz" className="block bg-surface-container-low border border-outline-variant/10 p-4 rounded-2xl hover:bg-surface-container hover:border-emerald-300 transition-all group/item shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                                            <Wrench className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold font-headline text-on-surface group-hover/item:text-emerald-600 transition-colors truncate">Concept Builder</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover/item:text-emerald-600 transition-colors group-hover/item:translate-x-1" />
                                </div>
                            </Link>

                            <Link href="/quiz/pyq" className="block bg-surface-container-low border border-outline-variant/10 p-4 rounded-2xl hover:bg-surface-container hover:border-amber-300 transition-all group/item shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs">
                                            <Trophy className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold font-headline text-on-surface group-hover/item:text-amber-600 transition-colors truncate">PYQ & Mock</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover/item:text-amber-600 transition-colors group-hover/item:translate-x-1" />
                                </div>
                            </Link>
                        </div>
                        <Link href="/quiz/subjects" className="block mt-auto">
                            <button className="w-full py-3.5 bg-indigo-50 hover:bg-indigo-100 rounded-xl text-xs font-black uppercase tracking-widest text-indigo-600 transition-all border border-indigo-100">View All Subject wise</button>
                        </Link>
                    </div>
                    {/* Decorative circle */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-50 rounded-full opacity-50 blur-3xl pointer-events-none" />
                </div>

            {/* DBE Tools Grid Section */}
            <section className="space-y-4 md:col-span-2 mt-4">
                {/* Row 1: 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/tools/resume-builder" className="bg-surface-container-lowest border border-outline-variant/10 rounded-[1.5rem] p-8 flex flex-col items-center justify-center text-center hover:bg-surface-container hover:border-primary/20 transition-all hover:scale-[1.01] shadow-sm group">
                        <span className="text-5xl mb-4 group-hover:-translate-y-1 transition-transform">📝</span>
                        <span className="font-black font-headline text-on-surface text-[15px] leading-tight">AI Resume Forge</span>
                    </Link>
                    <Link href="/tools/internships" className="bg-surface-container-lowest border border-outline-variant/10 rounded-[1.5rem] p-8 flex flex-col items-center justify-center text-center hover:bg-surface-container hover:border-primary/20 transition-all hover:scale-[1.01] shadow-sm group">
                        <span className="text-5xl mb-4 group-hover:-translate-y-1 transition-transform">🚀</span>
                        <span className="font-black font-headline text-on-surface text-[15px] leading-tight">Internship Hunter</span>
                    </Link>
                    <Link href="/matchforge" className="bg-surface-container-lowest border border-outline-variant/10 rounded-[1.5rem] p-8 flex flex-col items-center justify-center text-center hover:bg-surface-container hover:border-primary/20 transition-all hover:scale-[1.01] shadow-sm group">
                        <span className="text-5xl mb-4 group-hover:-translate-y-1 transition-transform">👥</span>
                        <span className="font-black font-headline text-on-surface text-[15px] leading-tight">MatchForge Network</span>
                    </Link>
                </div>
                
                {/* Row 2: 4 columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/tools/career-guides" className="bg-surface-container-lowest border border-outline-variant/10 rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-center hover:bg-surface-container hover:border-primary/20 transition-all hover:scale-[1.01] shadow-sm group">
                        <span className="text-4xl mb-3 group-hover:-translate-y-1 transition-transform">📘</span>
                        <span className="font-black font-headline text-on-surface text-sm leading-tight">Career Guides</span>
                    </Link>
                    <Link href="/tools/pitch-decks" className="bg-surface-container-lowest border border-outline-variant/10 rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-center hover:bg-surface-container hover:border-primary/20 transition-all hover:scale-[1.01] shadow-sm group">
                        <span className="text-4xl mb-3 group-hover:-translate-y-1 transition-transform">📊</span>
                        <span className="font-black font-headline text-on-surface text-sm leading-tight">Pro Pitch Decks</span>
                    </Link>
                    <Link href="/tools/cgpa-calculator" className="bg-surface-container-lowest border border-outline-variant/10 rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-center hover:bg-surface-container hover:border-primary/20 transition-all hover:scale-[1.01] shadow-sm group">
                        <span className="text-4xl mb-3 group-hover:-translate-y-1 transition-transform">🧮</span>
                        <span className="font-black font-headline text-on-surface text-sm leading-tight">CGPA Calculator</span>
                    </Link>
                    <Link href="/tools/competitions" className="bg-surface-container-lowest border border-outline-variant/10 rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-center hover:bg-surface-container hover:border-primary/20 transition-all hover:scale-[1.01] shadow-sm group">
                        <span className="text-4xl mb-3 group-hover:-translate-y-1 transition-transform">🏆</span>
                        <span className="font-black font-headline text-on-surface text-sm leading-tight">Competitions</span>
                    </Link>
                </div>
            </section>
        </section>

        {/* SEO Content Section for Google Ranking */}
        <section className="mt-16 border-t border-outline-variant/10 pt-12 pb-8">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">Indian Institute of Management Bangalore BBA Platform</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-on-surface-variant/70 text-sm font-medium leading-relaxed">
                <div>
                    <h3 className="text-on-surface font-bold mb-2">IIM Bangalore BBA DBE Resources</h3>
                    <p className="mb-2">
                        <strong>DBE OS</strong> is an educational platform and the ultimate <strong>IIM Bangalore BBA student platform</strong> co-founded by Ishaan Jha and Madhwendra. Recognized as the best preparation platform for BBA DBE students, we guide you through the <strong>Indian Institute of Management Bangalore BBA</strong> and the <strong>IIM Bangalore Digital Business Entrepreneurship</strong> program. 
                    </p>
                    <p>
                        Our <strong>IIMB DBE community</strong> provides access to comprehensive <strong>IIM Bangalore DBE notes</strong>, tools, and the <strong>best online BBA programs in India</strong> preparation resources. Discover <strong>how to get into IIM Bangalore BBA</strong> and prepare effectively.
                    </p>
                </div>
                <div>
                    <h3 className="text-on-surface font-bold mb-2">Admissions & Eligibility 2026</h3>
                    <p className="mb-2">
                        Stay updated on the <strong>IIM Bangalore BBA DBE admission process 2026</strong>. We cover everything from <strong>IIM Bangalore BBA eligibility criteria for 12th students</strong>, <strong>IIM Bangalore BBA entrance exam details</strong>, to the <strong>IIM Bangalore BBA application form last date</strong>.
                    </p>
                    <p>
                        Wondering about <strong>IIM Bangalore BBA fees</strong>, <strong>IIMB DBE course syllabus</strong>, or <strong>is IIM Bangalore BBA worth it</strong>? Check our guides and <strong>IIM Bangalore BBA online course review</strong> to make informed decisions.
                    </p>
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                    <h3 className="text-on-surface font-bold mb-2">Why Choose IIMB DBE?</h3>
                    <p className="mb-2">
                        Understand the <strong>benefits of IIM Bangalore online degree</strong> and see how it compares: <strong>IIM Bangalore DBE vs regular BBA</strong>, <strong>IIM Bangalore BBA vs Indian Institute of Management Indore IPM</strong>, and <strong>IIM Bangalore BBA vs DU BBA</strong>.
                    </p>
                    <p>
                        Join the <strong>IIM Bangalore DBE student network</strong> and explore <strong>IIM Bangalore courses for students after 12th</strong>. Your <strong>IIM Bangalore BBA preparation platform</strong> is here to guide you through <strong>what is digital business and entrepreneurship</strong>.
                    </p>
                </div>
            </div>
        </section>

        {/* Footer Link to Founders */}
        <footer className="mt-20 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-4 text-on-surface-variant/50">
            <p className="text-xs font-medium italic">Built with passion by the IIM Bangalore community.</p>
            <Link href="/about" className="group flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all border border-outline-variant/5">
                Meet the Founders <div className="flex -space-x-2 ml-1">
                    <Image src="https://github.com/Ishaan-jha-dev.png" width={20} height={20} className="w-5 h-5 rounded-full border border-surface shadow-sm" alt="Ishaan"/>
                    <Image src="/madhwendra_profile.png" width={20} height={20} className="w-5 h-5 rounded-full border border-surface shadow-sm" alt="Madhwendra"/>
                </div>
            </Link>
        </footer>
      </div>

      {/* Right iPad Sidebar */}
      <div className="lg:col-span-4">
         <IPadSidebar />
      </div>
    </div>
  );
}
