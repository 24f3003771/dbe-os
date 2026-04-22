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
    Check,
    Rocket,
    Users,
    Target,
    ChevronDown,
    ExternalLink,
    FileText,
    TrendingUp
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
    { id: "reliance", name: "Reliance", category: "Corporate", portal: "https://jsf.ril.com/", status: "Volume", industry: "Conglomerate" },
    { id: "tata", name: "TAS", category: "Corporate", portal: "https://www.tata.com/careers/programs/tas", status: "Seasonal", industry: "Conglomerate" },

    // Finance & Banks
    { id: "goldman", name: "Goldman Sachs", category: "Finance", portal: "https://www.goldmansachs.com/careers/students/", status: "Selective", industry: "IB" },
    { id: "jpmorgan", name: "J.P. Morgan", category: "Finance", portal: "https://careers.jpmorgan.com/US/en/students/programs", status: "Active", industry: "IB" },
    { id: "morganstanley", name: "Morgan Stanley", category: "Finance", portal: "https://www.morganstanley.com/people-opportunities/students-graduates", status: "Selective", industry: "IB" },
    { id: "hsbc", name: "HSBC", category: "Finance", portal: "https://www.hsbc.com/careers/students-and-graduates", status: "Active", industry: "Banking" },
    { id: "americanexpress", name: "Amex", category: "Finance", portal: "https://www.americanexpress.com/en-us/careers/students/", status: "Active", industry: "Payments" },

    // E-commerce & Others
    { id: "flipkart", name: "Flipkart", category: "Consumer Tech", portal: "https://www.flipkartcareers.com/", status: "Active", industry: "E-commerce" },
    { id: "myntra", name: "Myntra", category: "Consumer Tech", portal: "https://careers.myntra.com/", status: "Active", industry: "E-commerce" },
    { id: "nykaa", name: "Nykaa", category: "Consumer Tech", portal: "https://www.nykaa.com/gateway-api/careers", status: "Active", industry: "Beauty Tech" },
    { id: "airbus", name: "Airbus", category: "Core", portal: "https://www.airbus.com/en/careers/students", status: "Selective", industry: "Aerospace" },
    { id: "telsa", name: "Tesla", category: "Core", portal: "https://www.tesla.com/careers/internships", status: "Exclusive", industry: "EV" }
];

const CATEGORIES = ["All Portals", "Consumer Tech", "Big Tech", "SaaS & Fintech", "Consulting", "FMCG", "Finance"];

export default function InternshipHunterPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Portals");

    const filteredPortals = useMemo(() => {
        return COMPANY_CATALOG.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 item.industry.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All Portals" || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    return (
        <div className="min-h-screen bg-surface-container-lowest text-on-surface animate-in fade-in duration-1000 pb-40">
            {/* Dark Premium Hero */}
            <header className="relative py-20 px-6 lg:px-12 bg-[#0A0A0A] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-1.5 rounded-full text-primary font-black text-[10px] tracking-widest uppercase border border-primary/20">
                                <Rocket className="w-3.5 h-3.5" /> Direct Access Engine
                            </div>
                            <h1 className="text-6xl lg:text-8xl font-black font-headline tracking-tighter text-white leading-none italic">
                                Internship <span className="text-primary">Hunter.</span>
                            </h1>
                            <p className="text-stone-400 text-xl md:text-2xl font-medium max-w-2xl italic leading-relaxed">
                                "Stop scrolling, start applying. Access the official career portals of 50+ elite global firms in one click."
                            </p>
                        </div>
                        
                        <div className="hidden lg:flex items-center gap-4">
                            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl space-y-4 w-80">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">Global Coverage</p>
                                <div className="flex -space-x-3">
                                    {[1,2,3,4,5].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-stone-800" />)}
                                </div>
                                <h4 className="text-white font-bold text-lg">MAANG to Unicorns.</h4>
                                <p className="text-stone-500 text-xs font-medium italic">Verified career links only. 0% marketing fluff.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Decorative float */}
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
            </header>

            {/* Preparation Roadmap Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
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

            {/* Application Engine */}
            <section className="max-w-7xl mx-auto px-6 space-y-10">
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row items-center gap-4 bg-white border border-stone-100 p-4 rounded-[2.5rem] shadow-xl shadow-stone-200/50 sticky top-4 z-50">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
                        <input 
                            type="text"
                            placeholder="Find Blinkit, Swiggy, Google..."
                            className="w-full bg-stone-50/50 border-none rounded-[1.8rem] py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-stone-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <select 
                            className="bg-stone-50/50 border-none rounded-[1.8rem] px-8 py-4 font-black text-sm text-stone-600 focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Portals Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 px-4">
                    {filteredPortals.map(company => (
                        <PortalCard key={company.id} company={company} />
                    ))}
                </div>
            </section>

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
