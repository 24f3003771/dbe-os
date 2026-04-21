"use client";

import { useState, useMemo } from "react";
import { pitchDecks, PitchDeck } from "@/data/pitchdecks";
import { 
  Search, 
  Filter, 
  FileText, 
  Star, 
  ChevronRight, 
  X, 
  Download, 
  Maximize2,
  Trophy,
  Calendar,
  Building2,
  Tag,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function PitchDecksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeck, setSelectedDeck] = useState<PitchDeck | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    year: "All",
    type: "All",
    company: "All",
    placing: "All"
  });

  // Extract unique values for filters
  const years = ["All", ...Array.from(new Set(pitchDecks.map(d => d.year.toString())))].sort().reverse();
  const types = ["All", ...Array.from(new Set(pitchDecks.map(d => d.type)))].sort();
  const companies = ["All", ...Array.from(new Set(pitchDecks.map(d => d.company)))].sort();
  const placings = ["All", ...Array.from(new Set(pitchDecks.map(d => d.placing)))].sort();

  const filteredDecks = useMemo(() => {
    return pitchDecks.filter(deck => {
      const matchesSearch = 
        deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesYear = activeFilters.year === "All" || deck.year.toString() === activeFilters.year;
      const matchesType = activeFilters.type === "All" || deck.type === activeFilters.type;
      const matchesCompany = activeFilters.company === "All" || deck.company === activeFilters.company;
      const matchesPlacing = activeFilters.placing === "All" || deck.placing === activeFilters.placing;

      return matchesSearch && matchesYear && matchesType && matchesCompany && matchesPlacing;
    });
  }, [searchQuery, activeFilters]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <Link href="/opportunities" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold text-sm transition-colors group mb-2 w-fit">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Opportunity Hub
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">Pitch Decks</h1>
          <p className="text-on-surface-variant mt-1 text-lg">Award-winning case competition entries and investment theses.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
          <input
            type="text"
            placeholder="Search decks, companies, or tags..."
            className="w-full pl-10 pr-4 py-3 bg-surface-container border border-outline-variant/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar - iPad style */}
        <aside className="lg:col-span-1 space-y-6 bg-surface-container-low p-6 rounded-3xl h-fit border border-outline-variant/10 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
            <Filter className="w-4 h-4" />
            Filters
          </div>

          <div className="space-y-4">
            <FilterGroup 
              label="Year" 
              options={years} 
              active={activeFilters.year} 
              onSelect={(val) => setActiveFilters({ ...activeFilters, year: val })} 
            />
            <FilterGroup 
              label="Competition Type" 
              options={types} 
              active={activeFilters.type} 
              onSelect={(val) => setActiveFilters({ ...activeFilters, type: val })} 
            />
            <FilterGroup 
              label="Company" 
              options={companies} 
              active={activeFilters.company} 
              onSelect={(val) => setActiveFilters({ ...activeFilters, company: val })} 
            />
            <FilterGroup 
              label="Placing" 
              options={placings} 
              active={activeFilters.placing} 
              onSelect={(val) => setActiveFilters({ ...activeFilters, placing: val })} 
            />
          </div>

          <button 
            onClick={() => setActiveFilters({ year: "All", type: "All", company: "All", placing: "All" })}
            className="w-full py-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors underline decoration-dotted underline-offset-4"
          >
            Clear all filters
          </button>
        </aside>

        {/* Main Content - Grid of Decks */}
        <div className="lg:col-span-3">
          {filteredDecks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDecks.map((deck) => (
                <DeckCard 
                  key={deck.id} 
                  deck={deck} 
                  onClick={() => setSelectedDeck(deck)} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant/60 bg-surface-container-lowest rounded-3xl border-2 border-dashed border-outline-variant/20">
              <FileText className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-xl font-medium">No decks found matching your criteria</p>
              <button 
                onClick={() => {setSearchQuery(""); setActiveFilters({ year: "All", type: "All", company: "All", placing: "All" });}}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Reset search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PDF Modal Viewer */}
      <AnimatePresence>
        {selectedDeck && (
          <PDFViewerModal 
            deck={selectedDeck} 
            onClose={() => setSelectedDeck(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({ label, options, active, onSelect }: { label: string, options: string[], active: string, onSelect: (val: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-on-surface-variant/70 uppercase tracking-widest">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              active === option 
                ? "bg-primary text-white shadow-md shadow-primary/20" 
                : "bg-surface hover:bg-surface-container-highest text-on-surface border border-outline-variant/10 shadow-sm"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function DeckCard({ deck, onClick }: { deck: PitchDeck, onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      onClick={onClick}
      className="group cursor-pointer bg-surface border border-outline-variant/10 rounded-[2rem] p-6 flex flex-col gap-4 shadow-sm hover:border-primary/20 transition-all duration-300 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-primary/10 p-2 rounded-full backdrop-blur-sm">
          <Maximize2 className="w-4 h-4 text-primary" />
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10">
            <Trophy className={`w-6 h-6 ${deck.placing === '1st' ? 'text-yellow-600' : 'text-primary'}`} />
          </div>
          <div>
            <span className="text-[10px] font-black text-primary uppercase tracking-tighter bg-primary/10 px-2 py-0.5 rounded-full mb-1 inline-block">
              {deck.placing} Place
            </span>
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{deck.title}</h3>
          </div>
        </div>
      </div>

      <p className="text-on-surface-variant text-sm line-clamp-2">{deck.description}</p>

      <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-auto">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <Building2 className="w-3.5 h-3.5 opacity-50" />
          <span className="truncate">{deck.company}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <Calendar className="w-3.5 h-3.5 opacity-50" />
          <span>{deck.year}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <Tag className="w-3.5 h-3.5 opacity-50" />
          <span className="truncate">{deck.type}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <FileText className="w-3.5 h-3.5 opacity-50" />
          <span>{deck.pages} slides</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-outline-variant/5">
        {deck.tags.map(tag => (
          <span key={tag} className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest">
            #{tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function PDFViewerModal({ deck, onClose }: { deck: PitchDeck, onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-md"
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
        className="relative w-full h-full max-w-6xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* Sidebar Info - iPad Style */}
        <div className="w-full md:w-80 bg-surface-container-highest p-8 md:overflow-y-auto border-r border-outline-variant/10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-black text-primary uppercase tracking-tighter">{deck.placing} Place</div>
              <div className="text-xs font-bold text-on-surface-variant/60">{deck.year} Winners</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold font-headline mb-4 leading-tight">{deck.title}</h2>
          <p className="text-on-surface-variant mb-6">{deck.description}</p>

          <div className="space-y-6">
            <InfoItem label="Competition" value={deck.competition} icon={Trophy} />
            <InfoItem label="Company" value={deck.company} icon={Building2} />
            <InfoItem label="Type" value={deck.type} icon={Tag} />
            <InfoItem label="Pages" value={`${deck.pages} Slides`} icon={FileText} />
            <InfoItem label="Rating" value={`${deck.rating} / 5.0`} icon={Star} />
          </div>

          <div className="mt-10 pt-10 border-t border-outline-variant/20 flex flex-col gap-3">
             {deck.localPath && (
               <a 
                href={deck.localPath} 
                download
                className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dim transition-all shadow-lg shadow-primary/20 group"
              >
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                Download PDF
              </a>
            )}
            <a 
              href={deck.url} 
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-surface text-on-surface font-bold rounded-2xl hover:bg-surface-container-highest transition-all border border-outline-variant/20"
            >
              Original Source
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* PDF Content Area */}
        <div className="flex-1 bg-neutral-900 overflow-hidden relative flex items-center justify-center">
          {deck.url ? (
            <>
              <iframe 
                src={deck.url.includes("drive.google.com") 
                  ? deck.url.replace("/view", "/preview")
                  : `https://docs.google.com/viewer?url=${encodeURIComponent(deck.url)}&embedded=true`
                }
                className="w-full h-full border-none"
                title={deck.title}
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-white/50 text-[10px] uppercase tracking-widest font-bold pointer-events-none">
                Cloud-Optimized Viewer
              </div>
            </>
          ) : deck.localPath ? (
            <>
              <iframe 
                src={`${deck.localPath}#toolbar=0`}
                className="w-full h-full border-none"
                title={deck.title}
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-white/50 text-[10px] uppercase tracking-widest font-bold pointer-events-none">
                Interactive PDF Viewer
              </div>
            </>
          ) : (
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Maximize2 className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">Resource Unavailable</h3>
              <p className="text-white/40 mb-8 max-w-xs mx-auto">This resource could not be loaded directly.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function InfoItem({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 p-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/10">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <div className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-0.5">{label}</div>
        <div className="font-bold text-sm text-on-surface">{value}</div>
      </div>
    </div>
  );
}
