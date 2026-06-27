"use client";

import React, { useState, useMemo } from "react";
import { 
    Search, 
    Filter, 
    ChevronRight, 
    ChevronLeft,
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
    Star,
    Sparkles,
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
    { id: "swiggy", name: "Swiggy", category: "Consumer Tech", portal: "https://www.swiggy.com/careers", status: "Active", industry: "Logistics" },
    { id: "zomato", name: "Zomato", category: "Consumer Tech", portal: "https://www.zomato.com/careers", status: "Active", industry: "Food Tech" },
    { id: "blinkit", name: "Blinkit", category: "Consumer Tech", portal: "https://blinkit.com/careers", status: "Recurring", industry: "Quick Commerce" },
    { id: "zepto", name: "Zepto", category: "Consumer Tech", portal: "https://www.zepto.com/careers", status: "Active", industry: "Quick Commerce" },
    { id: "uber", name: "Uber", category: "Consumer Tech", portal: "https://www.uber.com/careers", status: "Active", industry: "Mobility" },
    { id: "ola", name: "Ola", category: "Consumer Tech", portal: "https://www.olacabs.com/careers", status: "Active", industry: "Mobility" },
    { id: "rapido", name: "Rapido", category: "Consumer Tech", portal: "https://rapido.xyz/careers", status: "Growth", industry: "Mobility" },
    { id: "google", name: "Google", category: "Big Tech", portal: "https://careers.google.com/students/", status: "Seasonal", industry: "Tech" },
    { id: "microsoft", name: "Microsoft", category: "Big Tech", portal: "https://careers.microsoft.com/students/", status: "Seasonal", industry: "Tech" },
    { id: "amazon", name: "Amazon", category: "Big Tech", portal: "https://www.amazon.jobs/en/student-programs", status: "Active", industry: "E-commerce" },
    { id: "apple", name: "Apple", category: "Big Tech", portal: "https://www.apple.com/careers/in/students.html", status: "Selective", industry: "Consumer Electronics" },
    { id: "meta", name: "Meta", category: "Big Tech", portal: "https://www.metacareers.com/students/", status: "Selective", industry: "Social Media" },
    { id: "salesforce", name: "Salesforce", category: "SaaS & Fintech", portal: "https://www.salesforce.com/company/careers/students/", status: "Active", industry: "CRM" },
    { id: "adobe", name: "Adobe", category: "SaaS & Fintech", portal: "https://www.adobe.com/careers/university.html", status: "Active", industry: "Creative Tech" },
    { id: "atlassian", name: "Atlassian", category: "SaaS & Fintech", portal: "https://www.atlassian.com/company/careers/students", status: "Active", industry: "DevOps" },
    { id: "razorpay", name: "Razorpay", category: "SaaS & Fintech", portal: "https://razorpay.com/jobs", status: "Growth", industry: "Fintech" },
    { id: "cred", name: "CRED", category: "SaaS & Fintech", portal: "https://careers.cred.club/", status: "Exclusive", industry: "Fintech" },
    { id: "phonepe", name: "PhonePe", category: "SaaS & Fintech", portal: "https://www.phonepe.com/careers/", status: "Active", industry: "Fintech" },
    { id: "stripe", name: "Stripe", category: "SaaS & Fintech", portal: "https://stripe.com/jobs/students", status: "Selective", industry: "Payments" },
    { id: "bcg", name: "BCG", category: "Consulting", portal: "https://careers.bcg.com/students", status: "Seasonal", industry: "Strategy" },
    { id: "mckinsey", name: "McKinsey", category: "Consulting", portal: "https://www.mckinsey.com/careers/students", status: "Seasonal", industry: "Strategy" },
    { id: "bain", name: "Bain & Co.", category: "Consulting", portal: "https://www.bain.com/careers/roles/internships/", status: "Seasonal", industry: "Strategy" },
    { id: "kearney", name: "Kearney", category: "Consulting", portal: "https://www.kearney.com/careers/students", status: "Active", industry: "Operations" },
    { id: "deloitte", name: "Deloitte", category: "Consulting", portal: "https://www2.deloitte.com/ui/en/pages/careers/articles/students.html", status: "Volume", industry: "Advisory" },
    { id: "ey", name: "EY", category: "Consulting", portal: "https://www.ey.com/en_gl/careers/students", status: "Volume", industry: "Advisory" },
    { id: "hul", name: "HUL", category: "FMCG", portal: "https://www.hul.co.in/careers/", status: "Seasonal", industry: "Consumer Goods" },
    { id: "itc", name: "ITC", category: "FMCG", portal: "https://www.itcportal.com/careers/", status: "Seasonal", industry: "Consumer Goods" },
    { id: "pg", name: "P&G", category: "FMCG", portal: "https://www.pgcareers.com/", status: "Selective", industry: "Consumer Goods" },
    { id: "reckitt", name: "Reckitt", category: "FMCG", portal: "https://careers.reckitt.com/", status: "Active", industry: "Health & Hygiene" },
    { id: "nestle", name: "Nestle", category: "FMCG", portal: "https://www.nestle.in/jobs", status: "Active", industry: "Nutrition" },
    { id: "reliance", name: "Reliance", category: "Corporate", portal: "https://jsf.ril.com/", status: "Volume", industry: "Conglomerate", tier: "T1" },
    { id: "tata", name: "TAS", category: "Corporate", portal: "https://www.tata.com/careers/programs/tas", status: "Seasonal", industry: "Conglomerate", tier: "T1" },
    { id: "goldman", name: "Goldman Sachs", category: "Finance", portal: "https://www.goldmansachs.com/careers/students/", status: "Selective", industry: "IB", tier: "T1" },
    { id: "jpmorgan", name: "J.P. Morgan", category: "Finance", portal: "https://careers.jpmorgan.com/US/en/students/programs", status: "Active", industry: "IB", tier: "T1" },
    { id: "morganstanley", name: "Morgan Stanley", category: "Finance", portal: "https://www.morganstanley.com/people-opportunities/students-graduates", status: "Selective", industry: "IB", tier: "T1" },
    { id: "hsbc", name: "HSBC", category: "Finance", portal: "https://www.hsbc.com/careers/students-and-graduates", status: "Active", industry: "Banking", tier: "T2" },
    { id: "americanexpress", name: "Amex", category: "Finance", portal: "https://www.americanexpress.com/en-us/careers/students/", status: "Active", industry: "Payments", tier: "T1" },
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
    const [viewMode, setViewMode] = useState<"MENU" | "PORTALS" | "LIVE" | "CALENDAR">("MENU");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSector, setSelectedSector] = useState("All");
    const [selectedTier, setSelectedTier] = useState("All");
    const [liveJobs, setLiveJobs] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [customKeyword, setCustomKeyword] = useState("");
    const [placeholderText, setPlaceholderText] = useState("");

    const ROLES = [
        "Data Analyst...",
        "Product Manager...",
        "Marketing Intern...",
        "Software Engineer...",
        "Business Consultant...",
        "UI/UX Designer...",
        "Finance Analyst...",
        "Operations Lead..."
    ];

    React.useEffect(() => {
        if (viewMode !== 'LIVE') return;
        
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let timeout: NodeJS.Timeout;

        const type = () => {
            const currentRole = ROLES[roleIndex];
            
            if (isDeleting) {
                setPlaceholderText(currentRole.substring(0, charIndex - 1));
                charIndex--;
            } else {
                setPlaceholderText(currentRole.substring(0, charIndex + 1));
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % ROLES.length;
                typeSpeed = 500;
            }

            timeout = setTimeout(type, typeSpeed);
        };

        type();
        return () => clearTimeout(timeout);
    }, [viewMode]);

    const PRESETS = [
        { id: "All", label: "Fetch All", icon: Globe },
        { id: "Marketing", label: "Marketing", icon: TrendingUp },
        { id: "Product", label: "Product Management", icon: Target },
        { id: "Analytics", label: "Business Analytics", icon: BarChart3 },
        { id: "Software", label: "Software Engineering", icon: Cpu },
        { id: "Data", label: "Data Science", icon: BarChart3 },
        { id: "Design", label: "UI/UX Design", icon: Sparkles },
        { id: "Finance", label: "Finance & IB", icon: Coins },
        { id: "HR", label: "Human Resources", icon: Users },
        { id: "Operations", label: "Operations", icon: Target },
        { id: "Sales", label: "Sales & BD", icon: TrendingUp },
    ];

    const handleLiveSearch = async (queryOverride?: string) => {
        const query = queryOverride === "Fetch All" ? "Internship" : (queryOverride || customKeyword || "Internship");
        setIsSearching(true);
        setHasSearched(true);
        try {
            const response = await fetch(`/api/linkedin-jobs?keyword=${encodeURIComponent(query)}&location=India&limit=50`);
            const data = await response.json();
            if (Array.isArray(data)) {
                const parseDate = (d: string) => {
                    const s = d.toLowerCase();
                    const n = parseInt(s.match(/\d+/)?.[0] || "0");
                    if (s.includes("minute")) return n;
                    if (s.includes("hour")) return n * 60;
                    if (s.includes("day")) return n * 1440;
                    if (s.includes("week")) return n * 10080;
                    if (s.includes("month")) return n * 43200;
                    return 999999;
                };
                const sorted = [...data].sort((a, b) => parseDate(a.postDate) - parseDate(b.postDate));
                setLiveJobs(sorted);
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
        <div className="min-h-screen bg-[#fbfbfd] text-slate-900 animate-in fade-in duration-1000 pb-40" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
            <header className="py-6 md:py-8 px-4 md:px-6 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-1.5 text-blue-500 font-medium text-[11px] tracking-wide uppercase">
                            <Rocket className="w-3.5 h-3.5" /> Direct Access Engine
                        </div>
                        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
                            Internship Hunter
                        </h1>
                    </div>
                    {viewMode !== 'MENU' && (
                        <button 
                            onClick={() => setViewMode('MENU')}
                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back to Menu
                        </button>
                    )}
                </div>
            </header>

            <section className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                {viewMode === 'MENU' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        <FlipCard 
                            title="Live LinkedIn Fetch"
                            icon={Linkedin}
                            frontDesc="Real-time extraction of live internship postings from LinkedIn."
                            backTitle="How it Works"
                            backDesc="We use an API to fetch the most recent internships matching your criteria from LinkedIn in real-time, bypassing the noise. Start hunting instantly."
                            onEnter={() => setViewMode("LIVE")}
                            iconBg="bg-blue-50"
                            iconColor="text-blue-500"
                        />
                        <FlipCard 
                            title="Company Portals"
                            icon={Building2}
                            frontDesc="Direct links to the official career pages of 50+ Tier-1 companies."
                            backTitle="How to Use"
                            backDesc="Stop relying on 3rd party job boards. Apply directly to the official career portals of MAANG, MBB, and top FMCGs to maximize your chances."
                            onEnter={() => setViewMode("PORTALS")}
                            iconBg="bg-emerald-50"
                            iconColor="text-emerald-500"
                        />
                        <FlipCard 
                            title="Hiring Calendar"
                            icon={Calendar}
                            frontDesc="Track summer & winter internship cycles for top institutions."
                            backTitle="About Cycles"
                            backDesc="Know exactly when companies hire for summer (May-July) and winter (Dec-Jan) internships across IITs, IIMs, and off-campus drives."
                            onEnter={() => setViewMode("CALENDAR")}
                            iconBg="bg-orange-50"
                            iconColor="text-orange-500"
                        />
                    </div>
                )}

                {viewMode === 'PORTALS' && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Official Portals Directory</h2>
                            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
                                {SECTORS.map(sector => (
                                    <button 
                                        key={sector.id}
                                        onClick={() => setSelectedSector(sector.id)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedSector === sector.id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'}`}
                                    >
                                        <sector.icon className="w-3.5 h-3.5" />
                                        {sector.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-2 rounded-xl border border-slate-200/60 shadow-sm">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text"
                                    placeholder="Search by company name or industry..."
                                    className="w-full bg-transparent border-none py-2 pl-10 pr-4 focus:ring-0 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="w-px h-6 bg-slate-200 hidden md:block" />
                            <select 
                                className="w-full md:w-auto bg-transparent border-none px-4 py-2 text-sm font-medium text-slate-600 focus:ring-0 outline-none"
                                value={selectedTier}
                                onChange={(e) => setSelectedTier(e.target.value)}
                            >
                                <option value="All">All Tiers</option>
                                <option value="T1">Tier 1 (Global Elite)</option>
                                <option value="T2">Tier 2 (Growth Firms)</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filteredPortals.map(company => <PortalCard key={company.id} company={company} />)}
                        </div>
                    </div>
                )}

                {viewMode === 'LIVE' && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col items-center gap-2">
                            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">LinkedIn Live Fetch</h2>
                            <p className="text-sm text-slate-500">Select a preset or search custom roles.</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            {PRESETS.map((preset) => (
                                <button 
                                    key={preset.id}
                                    onClick={() => {
                                        setCustomKeyword(preset.label);
                                        handleLiveSearch(preset.label);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-medium text-sm transition-all shadow-sm"
                                >
                                    <preset.icon className="w-3.5 h-3.5" />
                                    {preset.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-2 rounded-xl border border-slate-200/60 shadow-sm max-w-2xl mx-auto">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text"
                                    placeholder={`Search for ${placeholderText}`}
                                    className="w-full bg-transparent border-none py-2 pl-10 pr-4 focus:ring-0 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none"
                                    value={customKeyword}
                                    onChange={(e) => setCustomKeyword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleLiveSearch()}
                                />
                            </div>
                            <button 
                                onClick={() => handleLiveSearch()}
                                disabled={isSearching}
                                className="w-full md:w-auto bg-slate-900 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Linkedin className="w-4 h-4" />}
                                Fetch
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {isSearching ? (
                                Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                            ) : liveJobs.length > 0 ? (
                                liveJobs.map((job, idx) => <LinkedInJobCard key={idx} job={job} />)
                            ) : hasSearched ? (
                                <EmptyState onReset={() => { setHasSearched(false); setLiveJobs([]); }} />
                            ) : null}
                        </div>
                    </div>
                )}

                {viewMode === 'CALENDAR' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 text-center py-24">
                        <div className="w-20 h-20 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-6 shadow-sm">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Hiring Calendar</h2>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed text-sm">
                            A comprehensive timeline of Summer, Winter, and Autumn hiring drives across top-tier institutions and off-campus platforms.
                        </p>
                        <div className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-md inline-block text-xs font-medium mt-4">
                            Coming Soon
                        </div>
                    </div>
                )}

            </section>
        </div>
    );
}

function FlipCard({ title, icon: Icon, frontDesc, backTitle, backDesc, onEnter, iconBg, iconColor }: any) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div 
            className="group relative h-[22rem] w-full cursor-pointer"
            style={{ perspective: '1000px' }}
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
            onClick={() => {
                if (window.innerWidth < 768) {
                    if (!isFlipped) {
                        setIsFlipped(true);
                    } else {
                        onEnter();
                    }
                } else {
                    onEnter();
                }
            }}
        >
            <div 
                className="w-full h-full relative transition-all duration-700 shadow-sm rounded-2xl"
                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)' }}
            >
                {/* Front Side */}
                <div 
                    className="absolute inset-0 w-full h-full bg-white border border-slate-200/60 rounded-2xl p-8 flex flex-col justify-between overflow-hidden group-hover:shadow-md transition-shadow"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="space-y-5 relative z-10">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-slate-900 tracking-tight">{title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{frontDesc}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between w-full relative z-10 pt-4">
                        <span className="text-slate-400 text-xs font-medium">Hover to flip</span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600 transition-colors">
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Back Side */}
                <div 
                    className={`absolute inset-0 w-full h-full bg-slate-900 text-white rounded-2xl p-8 flex flex-col justify-between overflow-hidden shadow-xl`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-2 border-b border-slate-700 pb-4">
                            <Check className="w-4 h-4 text-slate-400" />
                            <h3 className="text-sm font-semibold tracking-wide text-slate-200">{backTitle}</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {backDesc}
                        </p>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onEnter(); }}
                        className="w-full bg-white text-slate-900 py-3 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                        Enter <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
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
            <div className="h-full bg-white border border-slate-200/60 rounded-xl p-5 flex flex-col justify-between hover:border-slate-300 transition-all hover:shadow-sm relative overflow-hidden">
                <div className="space-y-3">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                            company.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                            company.status === 'Selective' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                            'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                            {company.status}
                        </span>
                    </div>
                    
                    <div>
                        <p className="text-[11px] font-medium text-slate-500 mb-0.5">{company.industry}</p>
                        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{company.name}</h3>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-medium text-slate-500">Visit Portal</span>
                    <div className="text-slate-400 group-hover:text-slate-900 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <ArrowUpRight className="w-4 h-4" />
                    </div>
                </div>
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
            <div className="h-full bg-white border border-slate-200/60 rounded-xl p-5 flex flex-col justify-between hover:border-slate-300 transition-all hover:shadow-sm relative overflow-hidden">
                <div className="space-y-3">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 bg-slate-50 border border-slate-100 overflow-hidden relative">
                            {job.companyLogo ? (
                                <img 
                                    src={job.companyLogo} 
                                    alt={job.company} 
                                    className="w-full h-full object-cover" 
                                    onError={(e: any) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                />
                            ) : null}
                            <div className={`w-full h-full items-center justify-center font-semibold text-sm bg-slate-100 text-slate-700 ${job.companyLogo ? 'hidden' : 'flex'}`}>
                                {job.company?.charAt(0)}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                Live
                            </span>
                            <span className="text-[11px] text-slate-500">{job.postDate}</span>
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <p className="text-[11px] font-medium text-slate-500">{job.location}</p>
                        <h3 className="text-base font-semibold text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{job.title}</h3>
                        <p className="text-slate-600 text-[13px] font-medium">{job.company}</p>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-[11px] font-medium text-slate-500">View on LinkedIn</span>
                    <div className="text-slate-400 group-hover:text-blue-600 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <ExternalLink className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </a>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 animate-pulse space-y-4">
            <div className="flex justify-between">
                <div className="w-10 h-10 bg-slate-100 rounded-lg" />
                <div className="w-12 h-4 bg-slate-100 rounded-md" />
            </div>
            <div className="space-y-2">
                <div className="w-1/3 h-3 bg-slate-100 rounded-md" />
                <div className="w-full h-5 bg-slate-100 rounded-md" />
                <div className="w-2/3 h-5 bg-slate-100 rounded-md" />
            </div>
            <div className="pt-5 border-t border-slate-100 flex justify-between mt-5">
                <div className="w-16 h-3 bg-slate-100 rounded-md" />
                <div className="w-4 h-4 bg-slate-100 rounded-md" />
            </div>
        </div>
    );
}

function EmptyState({ onReset }: any) {
    return (
        <div className="col-span-full py-16 text-center space-y-4 bg-white border border-slate-200/60 rounded-xl">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No listings found.</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
                Try broadening your search terms or using a different preset.
            </p>
            <button 
                onClick={onReset}
                className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
                Reset Search
            </button>
        </div>
    );
}
