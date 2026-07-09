"use client";

import Link from "next/link";
import { BookOpen, Target, Briefcase, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
    return (
        <div className="min-h-[85vh] flex flex-col md:flex-row items-center justify-between gap-12 px-6 md:px-12 lg:px-24 py-12 font-body overflow-hidden relative">
            
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200/40 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-orange-300/30 rounded-full blur-[100px] pointer-events-none" />

            {/* Left Column: Text & Features */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex-1 flex flex-col justify-center max-w-2xl z-10"
            >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-stone-900 leading-[1.1] tracking-tight mb-6">
                    Everything you need to excel in your degree.
                </h1>
                
                <p className="text-xl md:text-2xl text-stone-500 font-medium mb-12 max-w-xl leading-relaxed">
                    A modern academic OS built exclusively for IIM Bangalore DBE students.
                </p>

                <div className="flex flex-col gap-5 mb-12">
                    <div className="flex items-center gap-4 text-stone-700">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5 text-orange-600" />
                        </div>
                        <span className="text-lg font-bold">Structured learning</span>
                    </div>
                    <div className="flex items-center gap-4 text-stone-700">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                            <Target className="w-5 h-5 text-rose-600" />
                        </div>
                        <span className="text-lg font-bold">Smart tools</span>
                    </div>
                    <div className="flex items-center gap-4 text-stone-700">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                            <Briefcase className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="text-lg font-bold">Career ready</span>
                    </div>
                    <div className="flex items-center gap-4 text-stone-700">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="text-lg font-bold">Community driven</span>
                    </div>
                </div>

                <Link 
                    href="/login" 
                    className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-400 to-rose-400 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-[0_8px_30px_rgba(251,146,60,0.3)] hover:shadow-[0_8px_40px_rgba(244,63,94,0.4)] transition-all hover:-translate-y-1 w-fit"
                >
                    Get Started 
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </motion.div>

            {/* Right Column: Dashboard Mockup */}
            <motion.div 
                initial={{ opacity: 0, x: 50, rotateY: -15, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="flex-1 w-full max-w-3xl perspective-[2000px] z-10 hidden md:block"
            >
                {/* 3D Device Frame */}
                <div className="relative w-full aspect-[4/3] bg-stone-900 rounded-[2.5rem] p-3 shadow-2xl shadow-stone-900/40 border-[8px] border-stone-800 flex overflow-hidden group">
                    
                    {/* Inner Screen Container */}
                    <div className="relative w-full h-full bg-[#FAF7F2] rounded-[1.5rem] overflow-hidden border border-stone-800 shadow-inner group-hover:scale-[1.01] transition-transform duration-700">
                        {/* We use an image if we have one, or a stylized mockup. Since we don't have the explicit image, let's build a mini mockup of the dashboard to look premium */}
                        
                        {/* Fake Navbar */}
                        <div className="h-12 w-full border-b border-stone-200/50 bg-white/50 backdrop-blur-md flex items-center px-4 justify-between">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-16 h-3 bg-stone-200 rounded-full" />
                                <div className="w-16 h-3 bg-stone-200 rounded-full" />
                            </div>
                        </div>

                        {/* Main Mockup Body */}
                        <div className="p-4 grid grid-cols-12 gap-3 h-[calc(100%-3rem)]">
                            {/* Hero Banner */}
                            <div className="col-span-8 bg-gradient-to-br from-[#FFF0EB] to-[#FFE5DC] rounded-xl p-4 flex flex-col justify-between h-[50%]">
                                <div>
                                    <div className="w-3/4 h-6 bg-stone-900/80 rounded-md mb-2" />
                                    <div className="w-1/2 h-4 bg-stone-500/50 rounded-md" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-16 h-12 bg-white/80 rounded-lg" />
                                    <div className="w-16 h-12 bg-white/80 rounded-lg" />
                                    <div className="w-16 h-12 bg-white/80 rounded-lg" />
                                </div>
                            </div>
                            
                            {/* Leaderboard */}
                            <div className="col-span-4 bg-white rounded-xl p-4 shadow-sm border border-stone-100 h-[50%]">
                                <div className="w-20 h-3 bg-stone-800 rounded-full mb-4" />
                                <div className="space-y-2">
                                    <div className="w-full h-6 bg-stone-100 rounded-md" />
                                    <div className="w-full h-6 bg-stone-100 rounded-md" />
                                    <div className="w-full h-6 bg-stone-100 rounded-md" />
                                </div>
                            </div>

                            {/* Bottom row */}
                            <div className="col-span-4 bg-[#FFF4F0] rounded-xl p-4 shadow-sm h-[45%] mt-2">
                                <div className="w-20 h-3 bg-rose-500 rounded-full mb-3" />
                                <div className="grid grid-cols-7 gap-1">
                                    {[...Array(28)].map((_, i) => (
                                        <div key={i} className="w-full aspect-square bg-white/60 rounded" />
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-4 bg-white rounded-xl p-4 shadow-sm border border-stone-100 h-[45%] mt-2 flex flex-col">
                                <div className="w-24 h-3 bg-stone-800 rounded-full mb-4" />
                                <div className="space-y-2 flex-1">
                                    <div className="w-full h-8 bg-stone-50 rounded-md border border-stone-100" />
                                    <div className="w-full h-8 bg-stone-50 rounded-md border border-stone-100" />
                                </div>
                            </div>
                            <div className="col-span-4 bg-white rounded-xl p-4 shadow-sm border border-stone-100 h-[45%] mt-2 flex items-center justify-center">
                                <div className="w-24 h-24 rounded-full border-4 border-rose-100 border-r-rose-500 relative flex items-center justify-center">
                                    <div className="w-12 h-3 bg-stone-800 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Glare effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 transform -rotate-12 pointer-events-none" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
