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
    Trophy,
    ShieldCheck,
    Globe,
    Timer,
    Check
} from "lucide-react";
import Link from "next/link";

// Mock Data for Internship Hunter
const MOCK_INTERNSHIPS = [
    {
        id: "1",
        title: "Product Management Intern",
        company: {
            name: "Google",
            tier: 1,
            logo: "G",
            industry: "Technology",
            headquarters: "Mountain View, CA"
        },
        location: "Hyderabad / Bangalore",
        remoteType: "HYBRID",
        domain: "Product Management",
        stipend: "₹1,00,000 / month",
        deadline: "2026-05-15",
        postedDate: "2 hours ago",
        tags: ["Summer 2026", "MBA Preferred", "Strategy"],
        applicationUrl: "https://google.com/careers"
    },
    {
        id: "2",
        title: "Software Engineering Intern (Backend)",
        company: {
            name: "Razorpay",
            tier: 2,
            logo: "R",
            industry: "Fintech",
            headquarters: "Bangalore, India"
        },
        location: "Remote",
        remoteType: "REMOTE",
        domain: "Technology",
        stipend: "₹60,000 / month",
        deadline: "2026-04-30",
        postedDate: "1 day ago",
        tags: ["Node.js", "Go", "Distributed Systems"],
        applicationUrl: "https://razorpay.com/jobs"
    },
    {
        id: "3",
        title: "Digital Marketing Strategy Intern",
        company: {
            name: "Swiggy",
            tier: 2,
            logo: "S",
            industry: "Consumer Tech",
            headquarters: "Bangalore, India"
        },
        location: "Bangalore",
        remoteType: "ON_SITE",
        domain: "Marketing",
        stipend: "₹45,000 / month",
        deadline: "2026-05-02",
        postedDate: "3 days ago",
        tags: ["SEO", "Growth", "Content"],
        applicationUrl: "https://swiggy.com/careers"
    },
    {
        id: "4",
        title: "VC Investment Analyst Intern",
        company: {
            name: "Antler India",
            tier: 3,
            logo: "A",
            industry: "Venture Capital",
            headquarters: "Bangalore, India"
        },
        location: "Mumbai",
        remoteType: "HYBRID",
        domain: "Finance",
        stipend: "₹30,000 / month",
        deadline: "2026-05-20",
        postedDate: "5 hours ago",
        tags: ["Startups", "Market Research", "Analysis"],
        applicationUrl: "https://antler.co/careers"
    },
    {
        id: "5",
        title: "UX Research Intern",
        company: {
            name: "Microsoft",
            tier: 1,
            logo: "M",
            industry: "Technology",
            headquarters: "Redmond, WA"
        },
        location: "Noida",
        remoteType: "HYBRID",
        domain: "Design",
        stipend: "₹1,20,000 / month",
        deadline: "2026-04-28",
        postedDate: "2 days ago",
        tags: ["Core UX", "Figma", "Research"],
        applicationUrl: "https://microsoft.com/careers"
    }
];

const DOMAINS = ["All Domains", "Technology", "Marketing", "Business", "Design", "Finance", "Product Management"];
const TIERS = ["All Tiers", "Tier 1 (Elite)", "Tier 2 (Established)", "Tier 3 (Growth)", "Tier 4 (Early)"];

export default function InternshipHunterPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("All Domains");
    const [selectedTier, setSelectedTier] = useState("All Tiers");

    const filteredInternships = useMemo(() => {
        return MOCK_INTERNSHIPS.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 job.company.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDomain = selectedDomain === "All Domains" || job.domain === selectedDomain;
            const matchesTier = selectedTier === "All Tiers" || 
                               (selectedTier === "Tier 1 (Elite)" && job.company.tier === 1) ||
                               (selectedTier === "Tier 2 (Established)" && job.company.tier === 2) ||
                               (selectedTier === "Tier 3 (Growth)" && job.company.tier === 3) ||
                               (selectedTier === "Tier 4 (Early)" && job.company.tier === 4);
            
            return matchesSearch && matchesDomain && matchesTier;
        });
    }, [searchQuery, selectedDomain, selectedTier]);

    return (
        <div className="min-h-screen bg-surface-container-lowest text-on-surface p-6 lg:p-12 animate-in fade-in duration-700">
            {/* Header section */}
            <header className="max-w-[1400px] mx-auto mb-12">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <Zap className="w-8 h-8 text-primary animate-pulse" />
                            </div>
                            <span className="text-xs font-black tracking-[0.3em] uppercase text-on-surface-variant opacity-60">Engine V1.0</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black font-headline tracking-tighter leading-tight italic">
                            Internship <span className="text-primary italic">Hunter.</span>
                        </h1>
                        <p className="text-xl text-on-surface-variant max-w-2xl font-medium leading-relaxed italic">
                            The ultimate aggregation engine for B-school scholars. Track elite programs, recurring cycles, and high-stipend opportunities.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-surface-container rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Elite Catch</p>
                                <p className="text-2xl font-black font-headline tabular-nums leading-none">95%</p>
                            </div>
                            <div className="w-px h-8 bg-outline-variant/20" />
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Active Leads</p>
                                <p className="text-2xl font-black font-headline tabular-nums leading-none">1,248</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters Bar */}
                <div className="sticky top-6 z-40 bg-surface-container/80 backdrop-blur-xl border border-outline-variant/10 p-4 rounded-[2.5rem] shadow-2xl shadow-black/5 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant opacity-50" />
                        <input 
                            type="text"
                            placeholder="Search by role, company, or keyword..."
                            className="w-full bg-surface-container-highest/30 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/40 transition-all font-bold placeholder:text-on-surface-variant/40"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto h-full items-stretch">
                        <select 
                            className="bg-surface-container-highest/30 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer appearance-none"
                            value={selectedDomain}
                            onChange={(e) => setSelectedDomain(e.target.value)}
                        >
                            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>

                        <select 
                            className="bg-surface-container-highest/30 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer appearance-none"
                            value={selectedTier}
                            onChange={(e) => setSelectedTier(e.target.value)}
                        >
                            {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>

                        <button className="p-4 bg-primary text-on-primary rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Results Grid */}
            <main className="max-w-[1400px] mx-auto pb-32">
                <div className="flex items-center justify-between mb-8 px-4">
                    <div className="flex items-center gap-3">
                        <Timer className="w-5 h-5 text-primary" />
                        <p className="text-sm font-black uppercase tracking-widest text-on-surface-variant">Live Opportunities ({filteredInternships.length})</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Aggregation Online</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {filteredInternships.length > 0 ? (
                        filteredInternships.map(job => (
                            <InternshipCard key={job.id} job={job} />
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center bg-surface-container rounded-[3rem] border border-dashed border-outline-variant/30">
                            <Search className="w-16 h-16 text-on-surface-variant/20 mx-auto mb-6" />
                            <h3 className="text-2xl font-black font-headline mb-2">No leads detected.</h3>
                            <p className="text-on-surface-variant italic">Try broadening your search or domain filter.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function InternshipCard({ job }: { job: any }) {
    const isElite = job.company.tier === 1;
    const tierLabel = isElite ? "Tier 1 elite" : job.company.tier === 2 ? "Tier 2 established" : "Tier 3 Growth";
    const tierColor = isElite ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : job.company.tier === 2 ? "bg-primary/10 text-primary border-primary/20" : "bg-on-surface-variant/10 text-on-surface-variant border-on-surface-variant/20";

    return (
        <div className="group bg-surface-container hover:bg-surface border border-outline-variant/10 rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 relative overflow-hidden h-[420px]">
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-64 h-64 translate-x-12 -translate-y-12 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000 ${isElite ? 'bg-amber-400' : 'bg-primary'}`} />

            <div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center text-3xl font-black border border-outline-variant/20 shadow-inner group-hover:bg-primary group-hover:text-on-primary transition-colors duration-500">
                        {job.company.logo}
                    </div>
                    <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm ${tierColor}`}>
                        {tierLabel}
                    </div>
                </div>

                <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-2 text-on-surface-variant opacity-60">
                        <Building2 className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">{job.company.name} • {job.company.industry}</span>
                    </div>
                    <h3 className="text-2xl font-black font-headline tracking-tighter leading-tight group-hover:text-primary transition-colors italic">
                        {job.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                        {job.tags.map((tag: string) => (
                            <span key={tag} className="px-3 py-1 bg-surface-container-highest/50 text-[10px] font-bold rounded-lg border border-outline-variant/5">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                <div className="grid grid-cols-2 gap-4 pb-8 mb-4 border-b border-outline-variant/10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Location</p>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-primary" />
                            <span className="text-sm font-bold">{job.location}</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Stipend</p>
                        <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-amber-500" />
                            <span className="text-sm font-black">{job.stipend}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{job.postedDate}</span>
                    </div>
                    <a 
                        href={job.applicationUrl}
                        target="_blank"
                        className="p-4 bg-surface-container-highest hover:bg-primary hover:text-on-primary rounded-full transition-all duration-300 shadow-md group-hover:scale-110"
                    >
                        <ArrowUpRight className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>
    );
}
