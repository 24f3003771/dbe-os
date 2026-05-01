"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
    Search, 
    Filter, 
    ChevronRight, 
    MapPin, 
    Building2, 
    Trophy, 
    Calendar, 
    Zap, 
    ArrowUpRight,
    ExternalLink,
    FileText,
    ShieldCheck,
    Globe,
    Timer,
    Check,
    Rocket,
    Users,
    Target,
    TrendingUp,
    Linkedin,
    Star,
    Sparkles,
    Loader2,
    Briefcase,
    Gem,
    Clock,
    Medal,
    Flame
} from "lucide-react";
import Link from "next/link";

// Curated Catalog of Top Corporate Competitions
const CORPORATE_COMPS = [
    { id: "hul-limelight", name: "HUL L.I.M.E.", organizer: "Hindustan Unilever", category: "Marketing", portal: "https://unstop.com/competitions/hul-lime-season-15-hindustan-unilever-limited-734561", status: "Seasonal", industry: "FMCG", tier: "T1" },
    { id: "itc-interrobang", name: "ITC Interrobang?!", organizer: "ITC Limited", category: "Supply Chain", portal: "https://www.itcportal.com/careers/", status: "Active", industry: "FMCG", tier: "T1" },
    { id: "google-hashcode", name: "Google HashCode", organizer: "Google", category: "Tech", portal: "https://codingcompetitions.withgoogle.com/hashcode", status: "Seasonal", industry: "Big Tech", tier: "T1" },
    { id: "tata-imagination", name: "Tata Imagination Challenge", organizer: "Tata Group", category: "Innovation", portal: "https://www.tata.com/imagination-challenge", status: "Active", industry: "Conglomerate", tier: "T1" },
    { id: "flipkart-grid", name: "Flipkart GRiD", organizer: "Flipkart", category: "Tech", portal: "https://unstop.com/competitions/flipkart-grid-60-software-development-track-flipkart-1090333", status: "Active", industry: "E-commerce", tier: "T1" },
    { id: "microsoft-imagine", name: "Imagine Cup", organizer: "Microsoft", category: "Tech", portal: "https://imaginecup.microsoft.com/", status: "Active", industry: "Big Tech", tier: "T1" },
    { id: "amazon-ml", name: "Amazon ML Challenge", organizer: "Amazon", category: "Tech", portal: "https://www.amazon.jobs/en/teams/amazon-ml-challenge", status: "Seasonal", industry: "Big Tech", tier: "T1" },
    { id: "ey-gds", name: "EY GDS Hackathon", organizer: "EY", category: "Tech", portal: "https://unstop.com/competitions/ey-gds-hackathon-2024-ey-1100000", status: "Active", industry: "Consulting", tier: "T1" },
    { id: "rbi-policy", name: "RBI Policy Challenge", organizer: "RBI", category: "Finance", portal: "https://www.rbi.org.in/", status: "Selective", industry: "Govt", tier: "T1" },
    { id: "bcg-strategy", name: "BCG Strategy Cup", organizer: "BCG", category: "Strategy", portal: "https://www.bcg.com/en-in/careers/students", status: "Seasonal", industry: "Consulting", tier: "T1" },
    { id: "reliance-tup", name: "Reliance TUP", organizer: "Reliance", category: "Strategy", portal: "https://unstop.com/competitions/reliance-tup-80-reliance-industries-limited-741253", status: "Active", industry: "Conglomerate", tier: "T1" },
    { id: "asian-paints-canvas", name: "Asian Paints Canvas", organizer: "Asian Paints", category: "Marketing", portal: "https://unstop.com/competitions/asian-paints-canvas-season-13-asian-paints-738921", status: "Active", industry: "Chemicals", tier: "T1" },
    { id: "tcs-codevita", name: "TCS CodeVita", organizer: "TCS", category: "Tech", portal: "https://www.tcscodevita.com/", status: "Active", industry: "IT Services", tier: "T1" },
    { id: "mahindra-rise", name: "Mahindra Rise Challenge", organizer: "Mahindra", category: "Strategy", portal: "https://www.mahindra.com/rise-challenge", status: "Active", industry: "Conglomerate", tier: "T1" },
];

const COMP_SECTORS = [
    { id: "All", name: "All Domains", icon: Globe, slug: "" },
    { id: "Marketing", name: "Marketing", icon: TrendingUp, slug: "marketing-growth" },
    { id: "Finance", name: "Finance", icon: Gem, slug: "finance" },
    { id: "Strategy", name: "Consulting", icon: Target, slug: "consulting-strategy" },
    { id: "Product", name: "Product", icon: Zap, slug: "product-management" },
    { id: "Tech", name: "Hackathons", icon: Rocket, slug: "hackathons" },
];

export default function CompetitionsHunterPage() {
    const [viewMode, setViewMode] = useState<"CHOOSE" | "PORTALS" | "LIVE">("CHOOSE");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSector, setSelectedSector] = useState("All");
    const [liveComps, setLiveComps] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [customKeyword, setCustomKeyword] = useState("");

    const OPPORTUNITY_NAV = [
        { name: "Hub", href: "/opportunities", icon: Globe },
        { name: "Internships", href: "/opportunities/internships", icon: Briefcase },
        { name: "Competitions", href: "/opportunities/competitions", icon: Trophy, active: true },
        { name: "Winners Bank", href: "/tools/winning-repository", icon: Star },
        { name: "Pitch Decks", href: "/tools/pitch-decks", icon: Sparkles },
    ];

    const handleLiveSearch = async (queryOverride?: string, sectorOverride?: string) => {
        setIsSearching(true);
        setViewMode("LIVE");
        
        const sector = sectorOverride || selectedSector;
        const slug = COMP_SECTORS.find(s => s.id === sector)?.slug || "";
        const query = queryOverride || customKeyword;

        try {
            const response = await fetch(`/api/unstop-competitions?opportunity=competitions&oppstatus=open&category=${slug}&q=${encodeURIComponent(query)}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setLiveComps(data);
            } else {
                setLiveComps([]);
            }
        } catch (error) {
            console.error("Unstop fetch failed:", error);
            setLiveComps([]);
        } finally {
            setIsSearching(false);
        }
    };

    const filteredPortals = useMemo(() => {
        return CORPORATE_COMPS.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 item.organizer.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSector = selectedSector === "All" || item.category === selectedSector;
            return matchesSearch && matchesSector;
        });
    }, [searchQuery, selectedSector]);

    return (
        <div className="min-h-screen bg-stone-50/50 text-slate-900 animate-in fade-in duration-1000 pb-40">
            {/* Global Opportunity Nav */}
            <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 md:px-6 py-2 md:py-3 flex justify-center overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1 md:gap-2 bg-slate-100/50 p-1 rounded-xl md:rounded-2xl border border-slate-200/50 min-w-max">
                    {OPPORTUNITY_NAV.map((nav) => (
                        <Link 
                            key={nav.name}
                            href={nav.href}
                            className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${nav.active ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                        >
                            <nav.icon className="w-3 h-3" />
                            <span className="whitespace-nowrap">{nav.name}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Soft Premium Hero */}
            <header className="relative py-16 md:py-28 px-6 lg:px-12 bg-slate-950 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-primary/5 opacity-40" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 md:gap-16">
                        <div className="space-y-4 md:space-y-8 max-w-3xl">
                            <div className="inline-flex items-center gap-2 bg-indigo-500/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-indigo-400 font-black text-[9px] md:text-[10px] tracking-widest uppercase border border-indigo-500/20 w-fit">
                                <Trophy className="w-3.5 h-3.5" /> Competition Engine
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black font-headline tracking-tighter text-white leading-[0.9] italic">
                                Competition <br/><span className="text-indigo-400">Hunter.</span>
                            </h1>
                            <p className="text-slate-400 text-lg md:text-2xl font-medium italic leading-relaxed">
                                Track every major B-School case challenge and national hackathon. Live from Unstop & Elite Corporate Portals.
                            </p>
                        </div>
                        
                        <div className="hidden xl:flex items-center gap-4">
                            <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/10 shadow-2xl space-y-6 w-96 transform hover:-translate-y-2 transition-transform duration-500">
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 leading-none">Live Opportunities</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                                        <Flame className="w-6 h-6 animate-pulse" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-xl italic leading-none">Trending Now</h4>
                                        <p className="text-slate-500 text-xs mt-1 font-medium italic">HUL LIME, Google HashCode, TAS.</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-white/5">
                                    <p className="text-slate-400 text-[11px] font-medium leading-relaxed italic">
                                        "Winners don't just participate. They prepare with structured roadmaps."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mode Selection Gatekeeper */}
            {viewMode === "CHOOSE" && (
                <section className="max-w-7xl mx-auto px-4 md:px-6 -mt-12 md:-mt-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        <button 
                            onClick={() => setViewMode("PORTALS")}
                            className="group relative bg-white border border-stone-100 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-left hover:border-indigo-500 transition-all shadow-2xl shadow-stone-200/50"
                        >
                            <div className="space-y-4 md:space-y-6">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-stone-50 rounded-2xl md:rounded-[1.8rem] flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Medal className="w-8 h-8 md:w-10 md:h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl md:text-4xl font-black font-headline tracking-tight leading-none italic">Elite Corporate <br/><span className="text-indigo-600">Challenges.</span></h3>
                                    <p className="text-stone-500 font-medium text-base md:text-lg leading-relaxed">Direct path to HUL LIME, TAS, BCG Strategy Cup and more.</p>
                                </div>
                                <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
                                    Verified Lists <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </button>

                        <button 
                            onClick={() => handleLiveSearch()}
                            className="group relative bg-indigo-950 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-left hover:ring-2 hover:ring-indigo-500/50 transition-all shadow-2xl"
                        >
                            <div className="space-y-4 md:space-y-6">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl md:rounded-[1.8rem] flex items-center justify-center text-white group-hover:bg-indigo-500 transition-all">
                                    <Rocket className="w-8 h-8 md:w-10 md:h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl md:text-4xl font-black font-headline tracking-tight leading-none italic text-white">Live Unstop <br/><span className="text-indigo-400">Hunter.</span></h3>
                                    <p className="text-indigo-200/70 font-medium text-base md:text-lg leading-relaxed">Extract live competitions, hackathons, and quizzes directly from Unstop APIs.</p>
                                </div>
                                <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white group-hover:text-indigo-400">
                                    Extract Events <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="absolute top-6 md:top-8 right-6 md:right-8">
                                <div className="px-2 md:px-3 py-1 bg-indigo-500 text-[7px] md:text-[8px] font-black uppercase tracking-widest text-white rounded-full animate-pulse">Sync Active</div>
                            </div>
                        </button>
                    </div>
                </section>
            )}

            {viewMode !== "CHOOSE" && (
                <section className="max-w-7xl mx-auto px-6 space-y-10">
                    {/* Switcher Bar */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10">
                        <div className="flex bg-slate-100 p-1.5 rounded-[2rem] w-fit border border-slate-200">
                            <button 
                                onClick={() => setViewMode("PORTALS")}
                                className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'PORTALS' ? 'bg-white shadow-lg shadow-slate-200 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Corporate Lists
                            </button>
                            <button 
                                onClick={() => handleLiveSearch()}
                                className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'LIVE' ? 'bg-indigo-900 shadow-xl text-white' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Live Unstop
                            </button>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
                            {COMP_SECTORS.map(sector => (
                                <button 
                                    key={sector.id}
                                    onClick={() => {
                                        setSelectedSector(sector.id);
                                        if (viewMode === 'LIVE') handleLiveSearch("", sector.id);
                                    }}
                                    className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black transition-all border ${selectedSector === sector.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                                >
                                    <sector.icon className="w-4 h-4" />
                                    {sector.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-white/80 backdrop-blur-md border border-slate-100 p-4 md:p-6 rounded-3xl md:rounded-[3.5rem] shadow-2xl shadow-slate-200/40 sticky top-20 md:top-24 z-50">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-slate-300" />
                            <input 
                                type="text"
                                placeholder={viewMode === 'PORTALS' ? "Find top challenges..." : "Describe event..."}
                                className="w-full bg-slate-50 border-none rounded-2xl md:rounded-[2rem] py-3 md:py-5 pl-14 md:pl-16 pr-6 md:pr-8 focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-slate-700 text-sm md:text-lg placeholder:text-slate-300"
                                value={viewMode === 'PORTALS' ? searchQuery : customKeyword}
                                onChange={(e) => viewMode === 'PORTALS' ? setSearchQuery(e.target.value) : setCustomKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (viewMode === 'LIVE' ? handleLiveSearch() : null)}
                            />
                        </div>
                        {viewMode === 'LIVE' && (
                            <button 
                                onClick={() => handleLiveSearch()}
                                disabled={isSearching}
                                className="w-full md:w-auto bg-slate-900 text-white px-8 md:px-12 py-3 md:py-5 rounded-2xl md:rounded-[2rem] font-black text-[10px] md:text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-3 disabled:opacity-50 justify-center shadow-xl shadow-slate-900/10"
                            >
                                {isSearching ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <Rocket className="w-4 h-4 md:w-5 md:h-5" />}
                                {isSearching ? "Searching..." : "Extract Events"}
                            </button>
                        )}
                    </div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 px-4">
                        {viewMode === 'LIVE' ? (
                            isSearching ? (
                                Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                            ) : liveComps.length > 0 ? (
                                liveComps.map((comp, idx) => <UnstopCompCard key={idx} comp={comp} />)
                            ) : (
                                <EmptyState onReset={() => setViewMode("CHOOSE")} />
                            )
                        ) : (
                            filteredPortals.map(comp => <CorporateCompCard key={comp.id} comp={comp} />)
                        )}
                    </div>
                </section>
            )}

            {/* Preparation Guide */}
            {viewMode === "CHOOSE" && (
                <section className="max-w-7xl mx-auto px-6 py-20 mt-10">
                    <div className="flex items-center gap-4 mb-12 px-4">
                        <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
                        <h2 className="text-3xl font-black font-headline italic tracking-tight">The Winning Roadmap</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
                        <RoadmapItem step="01" label="Team Formation" detail="Find diverse skills: Strategy, Design, and Data." icon={Users} color="bg-indigo-500" />
                        <RoadmapItem step="02" label="Secondary Research" detail="Deep dive into the problem statement and market data." icon={Search} color="bg-amber-500" />
                        <RoadmapItem step="03" label="Case Presentation" detail="High-yield PPTs and storytelling that wows judges." icon={ArrowUpRight} color="bg-emerald-500" />
                        <RoadmapItem step="04" label="Final Pitch" detail="Mock presentations and Q&A defense prep." icon={Target} color="bg-rose-500" />
                    </div>
                </section>
            )}
        </div>
    );
}

function RoadmapItem({ step, label, detail, icon: Icon, color }: any) {
    return (
        <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] space-y-3 md:space-y-4 hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
                <span className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase underline decoration-indigo-500/50 underline-offset-8 decoration-2">{step}</span>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
            </div>
            <div>
                <h4 className="text-base md:text-lg font-black font-headline text-slate-900 group-hover:text-indigo-600 transition-colors italic">{label}</h4>
                <p className="text-[10px] md:text-[11px] text-slate-500 font-medium leading-relaxed mt-1 md:mt-2 italic">{detail}</p>
            </div>
        </div>
    );
}

function CorporateCompCard({ comp }: any) {
    return (
        <a href={comp.portal} target="_blank" className="group block h-full">
            <div className="h-full bg-white border border-slate-100 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5 relative overflow-hidden">
                <div className="space-y-6 md:space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner border border-slate-100">
                            <Trophy className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <span className="px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100">
                            {comp.status}
                        </span>
                    </div>
                    <div>
                        <p className="text-[9px] md:text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-1">{comp.industry}</p>
                        <h3 className="text-xl md:text-2xl font-black font-headline text-slate-900 tracking-tighter italic leading-tight">{comp.name}</h3>
                        <p className="text-slate-500 text-[10px] md:text-[11px] font-bold mt-1">{comp.organizer}</p>
                    </div>
                </div>
                <div className="mt-8 md:mt-12 flex items-center justify-between border-t border-slate-50 pt-6 md:pt-8">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">View Details</span>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform shadow-sm group-hover:bg-indigo-50 group-hover:text-indigo-600">
                        <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                </div>
            </div>
        </a>
    );
}

function UnstopCompCard({ comp }: any) {
    return (
        <a href={comp.url} target="_blank" className="group block h-full">
            <div className="h-full bg-white border border-slate-100 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5 relative overflow-hidden">
                <div className="space-y-6 md:space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.4rem] flex items-center justify-center text-white group-hover:scale-105 transition-all shadow-lg border border-slate-100 overflow-hidden relative">
                            {comp.logo ? (
                                <img src={comp.logo} alt={comp.organizer} className="w-full h-full object-cover" onError={(e: any) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                            ) : null}
                            <div className={`w-full h-full items-center justify-center bg-gradient-to-br font-black text-xl md:text-2xl ${['from-indigo-500 to-blue-600', 'from-emerald-500 to-teal-600', 'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600', 'from-violet-500 to-purple-600'][comp.organizer?.length % 5]} ${comp.logo ? 'hidden' : 'flex'}`}>
                                {comp.organizer?.charAt(0)}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 md:gap-1.5">
                            <span className="px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] bg-emerald-50 text-emerald-600 border border-emerald-100">
                                Live
                            </span>
                            <span className="text-[9px] md:text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" /> {comp.daysLeft}d left
                            </span>
                        </div>
                    </div>
                    <div className="space-y-1 md:space-y-2">
                        <p className="text-[9px] md:text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">{comp.category}</p>
                        <h3 className="text-lg md:text-xl font-black font-headline text-slate-900 tracking-tight leading-tight italic group-hover:text-indigo-600 transition-colors line-clamp-2">{comp.title}</h3>
                        <p className="text-slate-500 text-[10px] md:text-[11px] font-bold">{comp.organizer}</p>
                    </div>
                </div>
                <div className="mt-8 md:mt-12 flex items-center justify-between border-t border-slate-50 pt-6 md:pt-8">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Apply Now</span>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform shadow-sm group-hover:bg-indigo-50 group-hover:text-indigo-600">
                        <ExternalLink className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                </div>
            </div>
        </a>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 animate-pulse space-y-8">
            <div className="flex justify-between">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl" />
                <div className="w-20 h-6 bg-slate-50 rounded-full" />
            </div>
            <div className="space-y-3">
                <div className="w-1/2 h-3 bg-slate-50 rounded-full" />
                <div className="w-full h-6 bg-slate-50 rounded-full" />
                <div className="w-2/3 h-6 bg-slate-50 rounded-full" />
            </div>
            <div className="pt-8 flex justify-between border-t border-slate-50">
                <div className="w-24 h-3 bg-slate-50 rounded-full" />
                <div className="w-12 h-12 bg-slate-50 rounded-full" />
            </div>
        </div>
    );
}

function EmptyState({ onReset }: any) {
    return (
        <div className="col-span-full py-20 text-center space-y-6 bg-white border border-slate-100 rounded-[3rem]">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Search className="w-12 h-12" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-black italic">No active events found.</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto text-sm leading-relaxed italic">
                    The Unstop extraction returned zero results for this category. Try a broader search or check back tomorrow.
                </p>
            </div>
            <button onClick={onReset} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">
                Reset Search Hub
            </button>
        </div>
    );
}
