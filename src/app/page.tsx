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
  { date: "2026-05-25", title: "Batch 1 Term Exams Placeholder" },
];

const CalendarWidget = () => {
  const [user, setUser] = useState<any>(null);
  const [batch, setBatch] = useState("Batch 2");

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

  const today = new Date();
  const currentMonthStr = String(today.getMonth() + 1).padStart(2, '0');
  const currentYearStr = String(today.getFullYear());
  
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const isScheduled = (day: number) => {
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${currentYearStr}-${currentMonthStr}-${dayStr}`;
    return schedule.some(s => s.date === dateStr);
  };

  return (
    <div className="bg-white h-full rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col relative">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-800"></div>
            <div className="w-1 h-1 rounded-full bg-green-500"></div>
        </div>
        
        <div className={`mt-4 ${caveat.className} flex-1 flex flex-col`}>
            <div className="flex justify-between items-end mb-6 shrink-0 border-b border-gray-100 pb-2">
                <h2 className="text-4xl text-[#2D2622] font-bold tracking-tight">{user?.user_metadata?.first_name ? `${user.user_metadata.first_name}'s` : 'My'} Month</h2>
                <span className="text-2xl text-red-400 font-bold -rotate-6 underline decoration-dashed underline-offset-4">{today.toLocaleString('default', { month: 'long' })}</span>
            </div>
            
            <div className="grid grid-cols-7 gap-x-1 gap-y-3 text-center mb-6 text-[#5C4D45] shrink-0">
                {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-2xl font-bold opacity-60 border-b border-gray-100 pb-1">{d}</div>)}
                {calendarDays.map((d, i) => {
                    const hasEvent = d ? isScheduled(d) : false;
                    return (
                    <div key={i} className="relative aspect-[4/3] flex items-center justify-center text-2xl font-bold border-b border-gray-50">
                        {d}
                        {d && d < today.getDate() && !hasEvent && (
                            <svg className="absolute inset-0 w-full h-full text-red-400/70 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M20,20 L80,80 M80,20 L20,80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                            </svg>
                        )}
                        {d === today.getDate() && (
                            <div className="absolute inset-1 border-[3px] border-blue-400 rounded-full opacity-80"></div>
                        )}
                        {hasEvent && (
                            <div className="absolute inset-2 bg-amber-100 border-2 border-amber-300 rounded-full mix-blend-multiply"></div>
                        )}
                    </div>
                )})}
            </div>
        </div>
    </div>
  );
};

const NoticeWidget = () => {
  const [batch, setBatch] = useState("Batch 2");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [announcements, setAnnouncements] = useState<any[]>([
    { id: 'loading', title: "Loading notices...", text: "Fetching the latest updates...", date: "Just now" }
  ]);

  useEffect(() => {
    const fetchNotices = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      let currentBatch = "Batch 2";
      if (user && user.user_metadata?.batch) {
        currentBatch = user.user_metadata.batch;
        setBatch(currentBatch);
      }

      const { data: notices } = await supabase
        .from("announcements")
        .select("*")
        .eq("batch", currentBatch)
        .order("created_at", { ascending: false });

      if (notices && notices.length > 0) {
        const formattedNotices = notices.map(n => {
            const date = new Date(n.created_at);
            const now = new Date();
            const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
            let dateStr = "Today";
            if (diffDays === 1) dateStr = "Yesterday";
            else if (diffDays > 1) dateStr = `${diffDays} days ago`;
            
            return {
                ...n,
                text: n.message,
                date: dateStr
            };
        });
        setAnnouncements(formattedNotices);
      } else {
        setAnnouncements([{
            id: 0,
            title: "No active notices",
            text: `You're all caught up for ${currentBatch}. Check back later.`,
            date: "Just now"
        }]);
      }
    };
    fetchNotices();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col h-full relative overflow-hidden">
        <div className="flex justify-between items-center mb-6 z-10">
            <h3 className="text-lg font-black font-headline text-[#2D2622] tracking-tight">
                Official Notice
            </h3>
            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">{batch}</span>
        </div>
        
        <div className="flex-1 relative bg-[#FFF8F8] rounded-2xl border border-[#FFE8E8] p-6 overflow-hidden flex flex-col justify-center min-h-[160px] z-10">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                >
                    <div className="inline-flex items-center gap-1.5 text-red-500 bg-white shadow-sm border border-red-100 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                        <Bell className="w-3 h-3" /> {announcements[currentSlide].date}
                    </div>
                    <h3 className="text-[15px] font-black text-[#2D2622] leading-tight pr-8">
                        {announcements[currentSlide].title}
                    </h3>
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
                {announcements.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-4 bg-red-400' : 'w-1.5 bg-red-200'}`}
                    />
                ))}
            </div>
            
            {/* Decorative icon */}
            <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none">
                <Megaphone className="w-28 h-28 text-red-600 -rotate-12" />
            </div>
        </div>
    </div>
  );
};

export default function Dashboard() {
  const { fetchFarmData, isInitialized } = useFarmStore();
  const subjects = getAllSubjects();
  const notesPreview = subjects.slice(0, 3);

  useEffect(() => {
    if (!isInitialized) fetchFarmData();
  }, [isInitialized, fetchFarmData]);

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto pb-20 px-4 xl:px-0">
      
      {/* Top Row: UniversalStats & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
            <UniversalStats />
        </div>
        <div className="lg:col-span-4">
            <CalendarWidget />
        </div>
      </div>

      {/* Bottom Row: Notes, Quiz, Official Notice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Notes Section */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col group h-full">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black font-headline text-[#4A3B32] uppercase flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#4A3B32]" /> NOTES
                    </h3>
                    <Link href="/notes" className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1 uppercase tracking-widest">
                        View all <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="flex-1 space-y-3">
                    {notesPreview.map((note: any, idx: number) => (
                        <Link key={note.id} href={`/dbe_notes/${note.id}`} className="block bg-[#FAF2ED] p-3 px-4 rounded-2xl hover:bg-[#F2E5DD] transition-all group/item border border-[#F5E6DD]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-[#EADDD3] text-[#4A3B32] flex items-center justify-center font-bold text-xs">
                                        {idx + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-[#2D2622] group-hover/item:text-[#4A3B32] transition-colors truncate">{note.title}</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-3 h-3 text-[#A89890] group-hover/item:text-[#4A3B32] transition-colors group-hover/item:translate-x-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quiz Section */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col group relative overflow-hidden h-full">
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black font-headline text-[#4A3B32] uppercase flex items-center gap-2">
                            <Rocket className="w-4 h-4 text-[#4A3B32]" /> QUIZ
                        </h3>
                        <Link href="/quiz" className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 uppercase tracking-widest">
                            View all subjects <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="flex-1 space-y-3">
                        <Link href="/quiz" className="block bg-[#F0EEF8] p-3 px-4 rounded-2xl hover:bg-[#E5E0F2] transition-all group/item border border-[#E6E2F5]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-[#DCD8F0] text-indigo-600 flex items-center justify-center font-bold text-xs">
                                        <Rocket className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-[#2D2622] group-hover/item:text-indigo-700 transition-colors truncate">Practice</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-3 h-3 text-[#A89890] group-hover/item:text-indigo-700 transition-colors group-hover/item:translate-x-1" />
                            </div>
                        </Link>

                        <Link href="/quiz" className="block bg-[#E6F8F0] p-3 px-4 rounded-2xl hover:bg-[#D4EFE4] transition-all group/item border border-[#DAF2E7]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-[#C7EADB] text-emerald-600 flex items-center justify-center font-bold text-xs">
                                        <Wrench className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-[#2D2622] group-hover/item:text-emerald-700 transition-colors truncate">Concept Builder</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-3 h-3 text-[#A89890] group-hover/item:text-emerald-700 transition-colors group-hover/item:translate-x-1" />
                            </div>
                        </Link>

                        <Link href="/quiz" className="block bg-[#FFF4E5] p-3 px-4 rounded-2xl hover:bg-[#FFE8CC] transition-all group/item border border-[#FFEEDB]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-[#FFDFB3] text-amber-600 flex items-center justify-center font-bold text-xs">
                                        <Trophy className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-[#2D2622] group-hover/item:text-amber-700 transition-colors truncate">PYQ & Mock</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-3 h-3 text-[#A89890] group-hover/item:text-amber-700 transition-colors group-hover/item:translate-x-1" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Official Notice Section */}
            <NoticeWidget />
      </div>

      {/* DBE Tools Grid Section */}
      <section className="space-y-4 mt-8">
          <div className="grid grid-cols-1">
              <Link href="/tools/cgpa-calculator" className="bg-surface-container-lowest border-2 border-primary/20 rounded-[1.5rem] p-5 flex items-center gap-4 hover:bg-surface-container hover:border-primary/40 transition-all hover:scale-[1.005] shadow-sm group">
                  <span className="text-4xl group-hover:-translate-y-1 transition-transform">🧮</span>
                  <div>
                      <span className="font-black font-headline text-on-surface text-[15px] leading-tight block">CGPA Calculator</span>
                      <span className="text-xs text-primary font-bold">Always Available ✓</span>
                  </div>
              </Link>
          </div>

          <div className="relative">
              <div className="transition-all space-y-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Link href="/tools/career-guides" className="bg-surface-container-lowest border border-outline-variant/10 rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-center hover:bg-surface-container hover:border-primary/20 transition-all hover:scale-[1.01] shadow-sm group">
                          <span className="text-4xl mb-3 group-hover:-translate-y-1 transition-transform">📘</span>
                          <span className="font-black font-headline text-on-surface text-sm leading-tight">Career Guides</span>
                      </Link>
                      <Link href="/tools/pitch-decks" className="bg-surface-container-lowest border border-outline-variant/10 rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-center hover:bg-surface-container hover:border-primary/20 transition-all hover:scale-[1.01] shadow-sm group">
                          <span className="text-4xl mb-3 group-hover:-translate-y-1 transition-transform">📊</span>
                          <span className="font-black font-headline text-on-surface text-sm leading-tight">Pro Pitch Decks</span>
                      </Link>
                      <Link href="/tools/competitions" className="bg-surface-container-lowest border border-outline-variant/10 rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-center hover:bg-surface-container hover:border-primary/20 transition-all hover:scale-[1.01] shadow-sm group">
                          <span className="text-4xl mb-3 group-hover:-translate-y-1 transition-transform">🏆</span>
                          <span className="font-black font-headline text-on-surface text-sm leading-tight">Competitions</span>
                      </Link>
                  </div>
              </div>
          </div>
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
  );
}

