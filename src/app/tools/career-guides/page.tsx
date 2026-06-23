"use client";

import { useState, useMemo } from "react";
import { careerGuides, CareerGuide } from "@/data/careerGuides";
import { 
  Search, 
  Filter, 
  ArrowRight, 
  ChevronRight, 
  BookOpen,
  Tag,
  ChevronLeft,
  Sparkles,
  Map,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HowToUseRoadmapModal from "@/components/HowToUseRoadmapModal";

export default function CareerGuidesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    category: "All",
  });
  const [showHowTo, setShowHowTo] = useState(false);

  // Extract unique values for filters
  const categories = ["All", ...Array.from(new Set(careerGuides.map(d => d.category)))].sort();

  const filteredGuides = useMemo(() => {
    return careerGuides.filter(guide => {
      const matchesSearch = 
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = activeFilters.category === "All" || guide.category === activeFilters.category;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeFilters]);

  return (
    <>
    <div className="w-full h-[calc(100vh-5rem)] p-2 md:p-4 bg-[#fdfaf6]">
      <div className="w-full h-full bg-[#fcfaf8] rounded-3xl shadow-2xl border border-stone-200/60 flex flex-col overflow-hidden relative">
        {/* Mac OS Header */}
        <div className="h-12 bg-white/80 backdrop-blur-md border-b border-stone-200/60 w-full flex items-center px-4 relative shrink-0 z-20">
          <div className="flex gap-2 absolute left-4">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-stone-200/80 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-stone-300/80">
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-7xl mx-auto">
      
      <Link href="/tools" className="inline-flex items-center gap-2 text-stone-400 hover:text-[#1A1A1A] font-bold text-sm transition-colors group mb-2 w-fit">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Opportunity Hub
      </Link>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Official Roadmaps
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[#1A1A1A]">Career Guides.</h1>
            <button 
              onClick={() => setShowHowTo(true)}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors shadow-sm"
              title="How to use roadmaps"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
          <p className="text-stone-500 font-medium text-lg">Interactive step-by-step developer roadmaps and guides.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
          <input
            type="text"
            placeholder="Search roadmaps or technologies..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-stone-100 rounded-[1.5rem] font-bold outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-4">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 flex flex-col shrink-0 sticky top-24 self-start max-h-[calc(100vh-6rem)] w-full max-w-[240px]">
          <div className="px-2 py-3 flex items-center justify-between shrink-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filters</span>
            <button className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-300 transition-colors text-[10px] font-black flex items-center justify-center cursor-default">
              i
            </button>
          </div>
          
          <div className="px-2 mb-4">
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Results</span>
                <span className="text-xs font-black text-slate-700">{filteredGuides.length} / {careerGuides.length}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500 rounded-full"
                  style={{ width: `${(filteredGuides.length / Math.max(careerGuides.length, 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 pb-4 flex flex-col gap-1 pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200/80 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300/80">
            {categories.map((cat, i) => {
              const isActive = activeFilters.category === cat;
              const dotColors = ['#94a3b8', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];
              const color = dotColors[i % dotColors.length];
              return (
                <button key={cat} onClick={() => setActiveFilters({ category: cat })}
                  className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-all text-xs font-bold rounded-xl group
                    ${isActive ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-slate-200/50'}`}>
                  <span className={`w-2 h-2 rounded-full transition-all ${isActive ? 'scale-125' : 'opacity-40 group-hover:opacity-100 group-hover:scale-110'}`}
                    style={{ backgroundColor: color }} />
                  <span className={`truncate transition-colors ${isActive ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-700'}`}>
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {filteredGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredGuides.map((guide) => (
                <GuideCard 
                  key={guide.id} 
                  guide={guide} 
                  onClick={() => router.push(`/tools/career-guides/${guide.roleId}`)} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-stone-300 bg-white rounded-[3rem] border-4 border-dashed border-stone-50">
              <BookOpen className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-xl font-black tracking-tight text-stone-400">No guides found</p>
              <button 
                onClick={() => {setSearchQuery(""); setActiveFilters({ category: "All" });}}
                className="mt-4 text-indigo-600 font-bold hover:underline"
              >
                Reset search
              </button>
            </div>
          )}
        </div>
      </div>
      
          </div>
        </div>
      </div>
    </div>
    <HowToUseRoadmapModal isOpen={showHowTo} onClose={() => setShowHowTo(false)} showDontShowAgain={false} />
    </>
  );
}



function GuideCard({ guide, onClick }: { guide: CareerGuide, onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group cursor-pointer bg-white border border-stone-100 rounded-[2.5rem] p-8 flex flex-col gap-6 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 hover:border-indigo-500 border-b-4 border-b-transparent relative h-full"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-100 transition-colors font-black text-indigo-500">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md mb-1.5 inline-block">
              {guide.category}
            </span>
            <h3 className="font-black text-xl leading-tight group-hover:text-indigo-600 transition-colors text-[#1A1A1A]">{guide.title}</h3>
          </div>
        </div>
      </div>

      <p className="text-stone-400 text-sm font-medium leading-relaxed">{guide.description}</p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {guide.tags.map(tag => (
          <span key={tag} className="px-2.5 py-1 bg-stone-50 text-stone-400 border border-stone-100 rounded-lg text-[9px] font-black uppercase tracking-widest leading-none">
            {tag}
          </span>
        ))}
      </div>

      <div className="pt-4 border-t border-stone-50 flex items-center justify-between mt-2">
        <div className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
          View Roadmap <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}
