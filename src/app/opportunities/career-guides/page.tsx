"use client";

import { useState, useMemo } from "react";
import { careerGuides, CareerGuide } from "@/data/careerGuides";
import { 
  Search, 
  Filter, 
  FileText, 
  ArrowRight, 
  ChevronRight, 
  X, 
  Download, 
  Maximize2,
  BookOpen,
  Calendar,
  Building2,
  Tag,
  ChevronLeft,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CareerGuidesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuide, setSelectedGuide] = useState<CareerGuide | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    year: "All",
    category: "All",
    company: "All"
  });

  // Extract unique values for filters
  const years = ["All", ...Array.from(new Set(careerGuides.map(d => d.year.toString())))].sort().reverse();
  const categories = ["All", ...Array.from(new Set(careerGuides.map(d => d.category)))].sort();
  const companies = ["All", ...Array.from(new Set(careerGuides.map(d => d.company)))].sort();

  const filteredGuides = useMemo(() => {
    return careerGuides.filter(guide => {
      const matchesSearch = 
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesYear = activeFilters.year === "All" || guide.year.toString() === activeFilters.year;
      const matchesCategory = activeFilters.category === "All" || guide.category === activeFilters.category;
      const matchesCompany = activeFilters.company === "All" || guide.company === activeFilters.company;

      return matchesSearch && matchesYear && matchesCategory && matchesCompany;
    });
  }, [searchQuery, activeFilters]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-8">
      <Link href="/opportunities" className="inline-flex items-center gap-2 text-stone-400 hover:text-[#1A1A1A] font-bold text-sm transition-colors group mb-2 w-fit">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Opportunity Hub
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Official Playbooks
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-[#1A1A1A]">Career Guides.</h1>
          <p className="text-stone-500 font-medium text-lg">Curated platform playbooks and industry trend reports for 2024-2025.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
          <input
            type="text"
            placeholder="Search playbooks or companies..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-stone-100 rounded-[1.5rem] font-bold outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6 bg-stone-50/50 p-6 rounded-[2rem] h-fit border border-stone-100 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 text-stone-400 font-black uppercase tracking-widest text-[10px]">
            <Filter className="w-3.5 h-3.5" />
            Fine-tune results
          </div>

          <div className="space-y-6">
            <FilterGroup 
              label="Release Year" 
              options={years} 
              active={activeFilters.year} 
              onSelect={(val) => setActiveFilters({ ...activeFilters, year: val })} 
            />
            <FilterGroup 
              label="Interest Area" 
              options={categories} 
              active={activeFilters.category} 
              onSelect={(val) => setActiveFilters({ ...activeFilters, category: val })} 
            />
            <FilterGroup 
              label="Platform" 
              options={companies} 
              active={activeFilters.company} 
              onSelect={(val) => setActiveFilters({ ...activeFilters, company: val })} 
            />
          </div>

          <button 
            onClick={() => setActiveFilters({ year: "All", category: "All", company: "All" })}
            className="w-full py-2 text-xs font-black text-stone-400 hover:text-indigo-600 transition-colors uppercase tracking-widest text-center"
          >
            Clear Filters
          </button>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {filteredGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredGuides.map((guide) => (
                <GuideCard 
                  key={guide.id} 
                  guide={guide} 
                  onClick={() => setSelectedGuide(guide)} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-stone-300 bg-white rounded-[3rem] border-4 border-dashed border-stone-50">
              <BookOpen className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-xl font-black font-headline tracking-tight text-stone-400">No guides found</p>
              <button 
                onClick={() => {setSearchQuery(""); setActiveFilters({ year: "All", category: "All", company: "All" });}}
                className="mt-4 text-indigo-600 font-bold hover:underline"
              >
                Reset search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PDF Modal Viewer */}
      <AnimatePresence>
        {selectedGuide && (
          <PDFViewerModal 
            guide={selectedGuide} 
            onClose={() => setSelectedGuide(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({ label, options, active, onSelect }: { label: string, options: string[], active: string, onSelect: (val: string) => void }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              active === option 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                : "bg-white hover:border-stone-300 text-stone-500 border border-stone-100 shadow-sm"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
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
      className="group cursor-pointer bg-white border border-stone-100 rounded-[2.5rem] p-8 flex flex-col gap-6 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 hover:border-indigo-500 border-b-4 border-b-transparent relative"
    >
      <div className="absolute top-6 right-6 p-2 bg-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
        <Maximize2 className="w-4 h-4 text-indigo-600" />
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center border border-stone-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors font-black text-stone-300 group-hover:text-indigo-400">
            {guide.company.charAt(0)}
          </div>
          <div>
            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md mb-1.5 inline-block">
              {guide.category}
            </span>
            <h3 className="font-black text-xl leading-tight group-hover:text-indigo-600 transition-colors text-[#1A1A1A]">{guide.title}</h3>
          </div>
        </div>
      </div>

      <p className="text-stone-400 text-sm font-medium leading-relaxed line-clamp-2">{guide.description}</p>

      <div className="grid grid-cols-2 gap-4 py-4 border-y border-stone-50">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
          <Building2 className="w-4 h-4 text-stone-300" />
          <span className="truncate">{guide.company}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
          <Calendar className="w-4 h-4 text-stone-300" />
          <span>{guide.year} Edition</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {guide.tags.map(tag => (
          <span key={tag} className="px-2.5 py-1 bg-stone-50 text-stone-400 border border-stone-100 rounded-lg text-[9px] font-black uppercase tracking-widest leading-none">
            {tag}
          </span>
        ))}
      </div>

      <div className="pt-2 flex items-center justify-between mt-auto">
        <div className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
          Read Playbook <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
        <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">
            {guide.pages} pages
        </span>
      </div>
    </motion.div>
  );
}

function PDFViewerModal({ guide, onClose }: { guide: CareerGuide, onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#1A1A1A]/80 backdrop-blur-xl"
    >
      <motion.button
        onClick={onClose}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md"
      >
        <X className="w-6 h-6" />
      </motion.button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        className="relative w-full h-full max-w-7xl bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* Sidebar Info */}
        <div className="w-full md:w-96 bg-stone-50 p-10 md:overflow-y-auto border-r border-stone-100 flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Official Guide</div>
              <div className="text-xl font-black font-headline tracking-tighter text-[#1A1A1A]">{guide.year} Edition</div>
            </div>
          </div>

          <h2 className="text-3xl font-black font-headline tracking-tight mb-4 leading-tight text-[#1A1A1A]">{guide.title}</h2>
          <p className="text-stone-500 font-medium mb-8 leading-relaxed">{guide.description}</p>

          <div className="space-y-6 flex-1">
            <InfoItem label="Publisher" value={guide.company} icon={Building2} />
            <InfoItem label="Category" value={guide.category} icon={Tag} />
            <InfoItem label="Content Length" value={`${guide.pages} Pages`} icon={FileText} />
            <InfoItem label="Format" value={guide.format} icon={BookOpen} />
          </div>

          <div className="mt-10 pt-10 border-t border-stone-100 flex flex-col gap-3">
             <a 
                href={guide.localPath} 
                download
                className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 group"
              >
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                Download Playbook
              </a>
            <a 
              href={guide.url} 
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-white text-stone-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-stone-50 transition-all border border-stone-100"
            >
              Original Resource
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* PDF Content Area */}
        <div className="flex-1 bg-stone-900 overflow-hidden relative flex items-center justify-center">
            <iframe 
                src={`${guide.localPath}#toolbar=0`}
                className="w-full h-full border-none"
                title={guide.title}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#1A1A1A]/60 backdrop-blur-md px-6 py-2.5 rounded-full text-white/50 text-[10px] uppercase tracking-widest font-black pointer-events-none">
                Interactive Playbook Browser
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function InfoItem({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 p-2 rounded-xl bg-white border border-stone-100 text-indigo-600 shadow-sm">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-0.5">{label}</div>
        <div className="font-bold text-stone-600">{value}</div>
      </div>
    </div>
  );
}
