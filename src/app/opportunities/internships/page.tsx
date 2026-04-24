"use client";

import React, { useState, useMemo } from "react";
import { 
    Search, 
    Filter, 
    ChevronRight, 
    MapPin, 
    Building2, 
    Briefcase, 
    Calendar, 
    Zap, 
    ArrowUpRight,
    ExternalLink,
    FileText,
    Trophy,
    ShieldCheck,
    Globe,
    Timer,
    Check,
    Rocket,
    Users,
    Target,
    TrendingUp,
    Linkedin,
    Loader2,
    ShieldCheck as Shield,
    Cpu,
    Coins,
    BarChart3,
    HeartPulse,
    Car,
    ShoppingBag,
    Gem
} from "lucide-react";
import Link from "next/link";

// Curated Catalog of Top Companies & Portals
const COMPANY_CATALOG = [
    // Consumer Tech & Delivery
    { id: "swiggy", name: "Swiggy", category: "Consumer Tech", portal: "https://www.swiggy.com/careers", status: "Active", industry: "Logistics" },
    { id: "zomato", name: "Zomato", category: "Consumer Tech", portal: "https://www.zomato.com/careers", status: "Active", industry: "Food Tech" },
    { id: "blinkit", name: "Blinkit", category: "Consumer Tech", portal: "https://blinkit.com/careers", status: "Recurring", industry: "Quick Commerce" },
    { id: "zepto", name: "Zepto", category: "Consumer Tech", portal: "https://www.zepto.com/careers", status: "Active", industry: "Quick Commerce" },
    { id: "uber", name: "Uber", category: "Consumer Tech", portal: "https://www.uber.com/careers", status: "Active", industry: "Mobility" },
    { id: "ola", name: "Ola", category: "Consumer Tech", portal: "https://www.olacabs.com/careers", status: "Active", industry: "Mobility" },
    { id: "rapido", name: "Rapido", category: "Consumer Tech", portal: "https://rapido.xyz/careers", status: "Growth", industry: "Mobility" },
    
    // Big Tech (MAANG+)
    { id: "google", name: "Google", category: "Big Tech", portal: "https://careers.google.com/students/", status: "Seasonal", industry: "Tech" },
    { id: "microsoft", name: "Microsoft", category: "Big Tech", portal: "https://careers.microsoft.com/students/", status: "Seasonal", industry: "Tech" },
    { id: "amazon", name: "Amazon", category: "Big Tech", portal: "https://www.amazon.jobs/en/student-programs", status: "Active", industry: "E-commerce" },
    { id: "apple", name: "Apple", category: "Big Tech", portal: "https://www.apple.com/careers/in/students.html", status: "Selective", industry: "Consumer Electronics" },
    { id: "meta", name: "Meta", category: "Big Tech", portal: "https://www.metacareers.com/students/", status: "Selective", industry: "Social Media" },
    
    // SaaS & Fintech
    { id: "salesforce", name: "Salesforce", category: "SaaS & Fintech", portal: "https://www.salesforce.com/company/careers/students/", status: "Active", industry: "CRM" },
    { id: "adobe", name: "Adobe", category: "SaaS & Fintech", portal: "https://www.adobe.com/careers/university.html", status: "Active", industry: "Creative Tech" },
    { id: "atlassian", name: "Atlassian", category: "SaaS & Fintech", portal: "https://www.atlassian.com/company/careers/students", status: "Active", industry: "DevOps" },
    { id: "razorpay", name: "Razorpay", category: "SaaS & Fintech", portal: "https://razorpay.com/jobs", status: "Growth", industry: "Fintech" },
    { id: "cred", name: "CRED", category: "SaaS & Fintech", portal: "https://careers.cred.club/", status: "Exclusive", industry: "Fintech" },
    { id: "phonepe", name: "PhonePe", category: "SaaS & Fintech", portal: "https://www.phonepe.com/careers/", status: "Active", industry: "Fintech" },
    { id: "stripe", name: "Stripe", category: "SaaS & Fintech", portal: "https://stripe.com/jobs/students", status: "Selective", industry: "Payments" },

    // Consulting & Strategy
    { id: "bcg", name: "BCG", category: "Consulting", portal: "https://careers.bcg.com/students", status: "Seasonal", industry: "Strategy" },
    { id: "mckinsey", name: "McKinsey", category: "Consulting", portal: "https://www.mckinsey.com/careers/students", status: "Seasonal", industry: "Strategy" },
    { id: "bain", name: "Bain & Co.", category: "Consulting", portal: "https://www.bain.com/careers/roles/internships/", status: "Seasonal", industry: "Strategy" },
    { id: "kearney", name: "Kearney", category: "Consulting", portal: "https://www.kearney.com/careers/students", status: "Active", industry: "Operations" },
    { id: "deloitte", name: "Deloitte", category: "Consulting", portal: "https://www2.deloitte.com/ui/en/pages/careers/articles/students.html", status: "Volume", industry: "Advisory" },
    { id: "ey", name: "EY", category: "Consulting", portal: "https://www.ey.com/en_gl/careers/students", status: "Volume", industry: "Advisory" },

    // FMCG & Retail
    { id: "hul", name: "HUL", category: "FMCG", portal: "https://www.hul.co.in/careers/", status: "Seasonal", industry: "Consumer Goods" },
    { id: "itc", name: "ITC", category: "FMCG", portal: "https://www.itcportal.com/careers/", status: "Seasonal", industry: "Consumer Goods" },
    { id: "pg", name: "P&G", category: "FMCG", portal: "https://www.pgcareers.com/", status: "Selective", industry: "Consumer Goods" },
    { id: "reckitt", name: "Reckitt", category: "FMCG", portal: "https://careers.reckitt.com/", status: "Active", industry: "Health & Hygiene" },
    { id: "nestle", name: "Nestle", category: "FMCG", portal: "https://www.nestle.in/jobs", status: "Active", industry: "Nutrition" },
    { id: "reliance", name: "Reliance", category: "Corporate", portal: "https://jsf.ril.com/", status: "Volume", industry: "Conglomerate", tier: "T1" },
    { id: "tata", name: "TAS", category: "Corporate", portal: "https://www.tata.com/careers/programs/tas", status: "Seasonal", industry: "Conglomerate", tier: "T1" },

    // Finance & Banks
    { id: "goldman", name: "Goldman Sachs", category: "Finance", portal: "https://www.goldmansachs.com/careers/students/", status: "Selective", industry: "IB", tier: "T1" },
    { id: "jpmorgan", name: "J.P. Morgan", category: "Finance", portal: "https://careers.jpmorgan.com/US/en/students/programs", status: "Active", industry: "IB", tier: "T1" },
    { id: "morganstanley", name: "Morgan Stanley", category: "Finance", portal: "https://www.morganstanley.com/people-opportunities/students-graduates", status: "Selective", industry: "IB", tier: "T1" },
    { id: "hsbc", name: "HSBC", category: "Finance", portal: "https://www.hsbc.com/careers/students-and-graduates", status: "Active", industry: "Banking", tier: "T2" },
    { id: "americanexpress", name: "Amex", category: "Finance", portal: "https://www.americanexpress.com/en-us/careers/students/", status: "Active", industry: "Payments", tier: "T1" },

    // E-commerce & Others
    { id: "flipkart", name: "Flipkart", category: "Consumer Tech", portal: "https://www.flipkartcareers.com/", status: "Active", industry: "E-commerce", tier: "T1" },
    { id: "myntra", name: "Myntra", category: "Consumer Tech", portal: "https://careers.myntra.com/", status: "Active", industry: "E-commerce", tier: "T1" },
    { id: "nykaa", name: "Nykaa", category: "Consumer Tech", portal: "https://www.nykaa.com/gateway-api/careers", status: "Active", industry: "Beauty Tech", tier: "T1" },
    { id: "airbus", name: "Airbus", category: "Core", portal: "https://www.airbus.com/en/careers/students", status: "Selective", industry: "Aerospace", tier: "T1" },
    { id: "tesla", name: "Tesla", category: "Core", portal: "https://www.tesla.com/careers/internships", status: "Exclusive", industry: "EV", tier: "T1" }
];

const SECTORS = [
    { id: "All", name: "All Sectors", icon: Globe },
    { id: "Tech", name: "Tech & AI", icon: Cpu },
    { id: "Finance", name: "Finance & IB", icon: Coins },
    { id: "Consulting", name: "Strategy & Cons", icon: BarChart3 },
    { id: "FMCG", name: "FMCG & Retail", icon: ShoppingBag },
    { id: "Healthcare", name: "Healthcare", icon: HeartPulse },
    { id: "Mobility", name: "Mobility & EV", icon: Car }
];

export default function InternshipHunterPage() {
    const [viewMode, setViewMode] = useState<"CHOOSE" | "PORTALS" | "LIVE">("CHOOSE");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSector, setSelectedSector] = useState("All");
    const [selectedTier, setSelectedTier] = useState("All");
    const [liveJobs, setLiveJobs] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleLiveSearch = async (queryOverride?: string) => {
        const query = queryOverride || searchQuery || "Internship";
        console.log("Starting live search for:", query);
        setIsSearching(true);
        setViewMode("LIVE");
        try {
            const response = await fetch(`/api/linkedin-jobs?keyword=${encodeURIComponent(query)}&location=India&limit=50`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setLiveJobs(data);
            } else {
                setLiveJobs([]);
            }
        } catch (error) {
            console.error("Search failed:", error);
            setLiveJobs([]);
        } finally {
            setIsSearching(false);
        }
    };

    const filteredPortals = useMemo(() => {
        return COMPANY_CATALOG.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 item.industry.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSector = selectedSector === "All" || item.category === selectedSector || (item.industry && item.industry.includes(selectedSector));
            const matchesTier = selectedTier === "All" || item.tier === selectedTier;
            return matchesSearch && matchesSector && matchesTier;
        });
    }, [searchQuery, selectedSector, selectedTier]);

    return (
        <div className="min-h-screen bg-stone-50/50 text-slate-900 animate-in fade-in duration-1000 pb-40">
            {/* Soft Premium Hero */}
            <header className="relative py-28 px-6 lg:px-12 bg-slate-950 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-primary/5 opacity-40" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-16">
                        <div className="space-y-8 max-w-3xl">
                            <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full text-emerald-400 font-black text-[10px] tracking-widest uppercase border border-emerald-500/20">
                                <Rocket className="w-3.5 h-3.5" /> Direct Access Engine
                            </div>
                            <h1 className="text-6xl lg:text-8xl font-black font-headline tracking-tighter text-white leading-[0.9] italic">
                                Internship <br/><span className="text-emerald-400">Hunter.</span>
                            </h1>
                            <p className="text-slate-400 text-xl md:text-2xl font-medium italic leading-relaxed">
                                Access the official career portals of 50+ elite global firms. Real-time extraction. Zero marketing fluff.
                            </p>
                        </div>
                        
                        <div className="hidden xl:flex items-center gap-4">
                            <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/10 shadow-2xl space-y-6 w-96 transform hover:-translate-y-2 transition-transform duration-500">
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 leading-none">Global Coverage</p>
                                <div className="flex -space-x-4">
                                    {['G', 'A', 'M', 'T', 'B'].map((letter, i) => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-950 bg-slate-800 flex items-center justify-center text-white font-black text-sm">
                                            {letter}
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-4 border-slate-950 bg-emerald-500 flex items-center justify-center text-white font-black text-xs">
                                        +50
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-white font-bold text-xl tracking-tight italic">MAANG to Unicorns.</h4>
                                    <p className="text-slate-500 text-xs font-medium leading-relaxed">Direct links to verified corporate hiring pipelines.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mode Selection Gatekeeper */}
            {viewMode === "CHOOSE" && (
                <section className="max-w-7xl mx-auto px-6 -mt-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <button 
                            onClick={() => setViewMode("PORTALS")}
                            className="group relative bg-white border border-stone-100 rounded-[3rem] p-12 text-left hover:border-primary transition-all shadow-2xl shadow-stone-200/50"
                        >
                            <div className="space-y-6">
                                <div className="w-20 h-20 bg-stone-50 rounded-[1.8rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <Building2 className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-black font-headline tracking-tight leading-none italic">Verified Corporate <br/><span className="text-primary">Portals.</span></h3>
                                    <p className="text-stone-500 font-medium text-lg leading-relaxed">Direct links to official career pages of Tier 1 firms, MAANG, and Elite Consulting.</p>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                                    Direct Redirect <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </button>

                        <button 
                            onClick={() => handleLiveSearch()}
                            className="group relative bg-[#1A1A1A] rounded-[3rem] p-12 text-left hover:ring-2 hover:ring-primary/50 transition-all shadow-2xl"
                        >
                            <div className="space-y-6">
                                <div className="w-20 h-20 bg-white/10 rounded-[1.8rem] flex items-center justify-center text-white group-hover:bg-primary transition-all">
                                    <Linkedin className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-black font-headline tracking-tight leading-none italic text-white">Live AI Job <br/><span className="text-primary">Hunter.</span></h3>
                                    <p className="text-stone-300 font-medium text-lg leading-relaxed">Real-time LinkedIn scraping for internships posted in the <span className="text-primary underline underline-offset-4 decoration-2">last 15 days</span>.</p>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white group-hover:text-primary">
                                    Extract Openings <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="absolute top-8 right-8">
                                <div className="px-3 py-1 bg-primary text-[8px] font-black uppercase tracking-widest text-white rounded-full animate-pulse">Live Now</div>
                            </div>
                        </button>
                    </div>
                </section>
            )}

            {viewMode !== "CHOOSE" && (
                <section className="max-w-7xl mx-auto px-6 space-y-10">
                    {/* Simplified Switcher Bar */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10">
                        <div className="flex bg-slate-100 p-1.5 rounded-[2rem] w-fit border border-slate-200">
                            <button 
                                onClick={() => setViewMode("PORTALS")}
                                className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'PORTALS' ? 'bg-white shadow-lg shadow-slate-200 text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Official Portals
                            </button>
                            <button 
                                onClick={() => handleLiveSearch()}
                                className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'LIVE' ? 'bg-slate-900 shadow-xl text-white' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Live AI Hunter
                            </button>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
                            {SECTORS.map(sector => (
                                <button 
                                    key={sector.id}
                                    onClick={() => setSelectedSector(sector.id)}
                                    className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black transition-all border ${selectedSector === sector.id ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                                >
                                    <sector.icon className="w-4 h-4" />
                                    {sector.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search & Tier Filter Bar */}
                    <div className="flex flex-col md:flex-row items-center gap-6 bg-white/80 backdrop-blur-md border border-slate-100 p-6 rounded-[3.5rem] shadow-2xl shadow-slate-200/40 sticky top-8 z-50">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
                            <input 
                                type="text"
                                placeholder={viewMode === 'PORTALS' ? "Find top firms (Google, BCG, HUL)..." : "Describe your ideal role (e.g. Marketing Intern Bangalore)..."}
                                className="w-full bg-slate-50 border-none rounded-[2rem] py-5 pl-16 pr-8 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold text-slate-700 text-lg placeholder:text-slate-300"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (viewMode === 'LIVE' ? handleLiveSearch() : null)}
                            />
                        </div>
                        {viewMode === 'PORTALS' && (
                            <div className="w-full md:w-auto">
                                <select 
                                    className="w-full bg-slate-50 border-none rounded-[2rem] px-10 py-5 font-black text-sm text-slate-600 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer appearance-none"
                                    value={selectedTier}
                                    onChange={(e) => setSelectedTier(e.target.value)}
                                >
                                    <option value="All">All Quality Tiers</option>
                                    <option value="T1">Tier 1 (Global Elite)</option>
                                    <option value="T2">Tier 2 (Growth Firms)</option>
                                </select>
                            </div>
                        )}
                        {viewMode === 'LIVE' && (
                            <button 
                                onClick={() => handleLiveSearch()}
                                disabled={isSearching}
                                className="w-full md:w-auto bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-3 disabled:opacity-50 justify-center shadow-xl shadow-slate-900/10"
                            >
                                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Linkedin className="w-5 h-5" />}
                                {isSearching ? "Extracting..." : "Live Fetch"}
                            </button>
                        )}
                    </div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 px-4">
                        {viewMode === 'LIVE' ? (
                            isSearching ? (
                                Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                            ) : liveJobs.length > 0 ? (
                                liveJobs.map((job, idx) => <LinkedInJobCard key={idx} job={job} />)
                            ) : (
                                <EmptyState onReset={() => setViewMode("CHOOSE")} />
                            )
                        ) : (
                            filteredPortals.map(company => <PortalCard key={company.id} company={company} />)
                        )}
                    </div>
                </section>
            )}

            {/* Preparation Roadmap Section (Moved below Mode Selector) */}
            {viewMode === "CHOOSE" && (
                <section className="max-w-7xl mx-auto px-6 py-20 mt-10">
                    <div className="flex items-center gap-4 mb-12 px-4">
                        <div className="w-1.5 h-8 bg-primary rounded-full" />
                        <h2 className="text-3xl font-black font-headline italic tracking-tight">The B-School Prep Roadmap</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
                        <RoadmapItem step="01" label="Profile Design" detail="High-yield resume, LinkedIn SEO, and Portfolio setup." icon={FileText} color="bg-indigo-500" />
                        <RoadmapItem step="02" label="Core Preparation" detail="Aptitude logic, Domain depth, and Case prep." icon={Zap} color="bg-amber-500" />
                        <RoadmapItem step="03" label="Hunter Phase" detail="Apply via official portals and Referral networking." icon={ExternalLink} color="bg-primary" />
                        <RoadmapItem step="04" label="Closing" detail="Mock behavioral rounds and Negotiation style." icon={Target} color="bg-rose-500" />
                    </div>
                </section>
            )}

            {/* General Preparation Guide (Minimal Footer) */}
            <section className="max-w-5xl mx-auto px-6 mt-32">
                <div className="bg-[#1A1A1A] text-white p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black font-headline tracking-tighter italic">General Prep Guide</h3>
                            <p className="text-stone-400 font-medium italic text-lg leading-relaxed max-w-2xl">
                                Success isn't just about applying. It's about being ready when the mail hits your inbox. Follow these rules:
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <h5 className="text-primary font-black uppercase tracking-widest text-[10px]">Technical Pillar</h5>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-sm font-bold text-stone-300">
                                        <Check className="w-4 h-4 text-primary shrink-0" /> Focus on Guesstimates and First Principles.
                                    </li>
                                    <li className="flex gap-3 text-sm font-bold text-stone-300">
                                        <Check className="w-4 h-4 text-primary shrink-0" /> Domain Specific Tools (SQL, Figma, R, Excel).
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h5 className="text-primary font-black uppercase tracking-widest text-[10px]">Behavioral Pillar</h5>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-sm font-bold text-stone-300">
                                        <Check className="w-4 h-4 text-primary shrink-0" /> STAR method for all your past experiences.
                                    </li>
                                    <li className="flex gap-3 text-sm font-bold text-stone-300">
                                        <Check className="w-4 h-4 text-primary shrink-0" /> Understanding the firm's cultural DNA.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function RoadmapItem({ step, label, detail, icon: Icon, color }: any) {
    return (
        <div className="bg-white border border-stone-100 p-8 rounded-[2rem] space-y-4 hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-stone-300 uppercase underline decoration-primary/50 underline-offset-8 decoration-2">{step}</span>
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div>
                <h4 className="text-lg font-black font-headline text-stone-900 group-hover:text-primary transition-colors">{label}</h4>
                <p className="text-[11px] text-stone-500 font-medium leading-relaxed mt-2 italic">{detail}</p>
            </div>
        </div>
    );
}

function PortalCard({ company }: any) {
    return (
        <a 
            href={company.portal} 
            target="_blank" 
            className="group block h-full"
        >
            <div className="h-full bg-white border border-stone-100 rounded-[2rem] p-8 flex flex-col justify-between hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden">
                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner border border-stone-100">
                            <Building2 className="w-7 h-7" />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                            company.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 
                            company.status === 'Selective' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-stone-50 text-stone-500 border-stone-100'
                        }`}>
                            {company.status}
                        </span>
                    </div>
                    
                    <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{company.industry}</p>
                        <h3 className="text-2xl font-black font-headline text-stone-900 tracking-tighter italic leading-none">{company.name}</h3>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Internship Portal</span>
                    <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform shadow-sm">
                        <ArrowUpRight className="w-5 h-5 text-primary" />
                    </div>
                </div>

                {/* Decorative bg light */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </a>
    );
}

function LinkedInJobCard({ job }: any) {
    return (
        <a 
            href={job.jobUrl} 
            target="_blank" 
            className="group block h-full"
        >
            <div className="h-full bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/5 relative overflow-hidden">
                <div className="space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner border border-slate-100 overflow-hidden relative">
                            {job.companyLogo ? (
                                <img 
                                    src={job.companyLogo} 
                                    alt={job.company} 
                                    className="w-full h-full object-cover" 
                                    onError={(e: any) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                />
                            ) : null}
                            <div className={`w-full h-full items-center justify-center bg-slate-50 text-slate-400 font-black text-xl ${job.companyLogo ? 'hidden' : 'flex'}`}>
                                {job.company?.charAt(0)}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                            <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-emerald-50 text-emerald-600 border border-emerald-100">
                                Live Listing
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">{job.postDate}</span>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">{job.location}</p>
                        <h3 className="text-2xl font-black font-headline text-slate-900 tracking-tight leading-tight italic group-hover:text-emerald-600 transition-colors">{job.title}</h3>
                        <p className="text-slate-500 text-sm font-bold">{job.company}</p>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-between border-t border-slate-50 pt-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">View on LinkedIn</span>
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform shadow-sm group-hover:bg-emerald-50 group-hover:text-emerald-600">
                        <ExternalLink className="w-6 h-6" />
                    </div>
                </div>

                {/* Decorative bg light */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </a>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-white border border-stone-100 rounded-[2rem] p-8 animate-pulse space-y-6">
            <div className="flex justify-between">
                <div className="w-14 h-14 bg-stone-100 rounded-2xl" />
                <div className="w-16 h-4 bg-stone-100 rounded-full" />
            </div>
            <div className="space-y-3">
                <div className="w-1/2 h-2 bg-stone-100 rounded-full" />
                <div className="w-full h-4 bg-stone-100 rounded-full" />
                <div className="w-2/3 h-4 bg-stone-100 rounded-full" />
            </div>
            <div className="pt-8 flex justify-between">
                <div className="w-20 h-2 bg-stone-100 rounded-full" />
                <div className="w-8 h-8 bg-stone-100 rounded-full" />
            </div>
        </div>
    );
}

function EmptyState({ onReset }: any) {
    return (
        <div className="col-span-full py-20 text-center space-y-4 bg-white border border-stone-100 rounded-[3rem]">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-300">
                <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black italic leading-none">No live listings found.</h3>
            <p className="text-stone-500 font-medium max-w-xs mx-auto text-sm leading-relaxed">
                LinkedIn extraction failed or returned zero results for the last 15 days. Try broadening your keywords.
            </p>
            <button 
                onClick={onReset}
                className="mt-4 text-xs font-black uppercase tracking-widest text-primary hover:underline"
            >
                Reset Search Engine
            </button>
        </div>
    );
}
