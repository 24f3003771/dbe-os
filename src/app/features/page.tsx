"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Target, BookOpen, Clock, Users, BrainCircuit, Rocket, CalendarClock } from "lucide-react";
import Link from "next/link";

const features = [
  {
    id: "focus-mode",
    title: "Focus Mode",
    description: "Immersive study environments designed to block distractions and help you achieve deep work. Includes Pomodoro timers and strict mode site blockers.",
    icon: Target,
    color: "bg-rose-100 text-rose-600",
  },
  {
    id: "notes",
    title: "Structured Notes",
    description: "Access a community-driven repository of high-quality notes tailored specifically for the IIM Bangalore BBA DBE curriculum.",
    icon: BookOpen,
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: "quiz",
    title: "Smart Quizzes",
    description: "Test your knowledge with our intelligent quiz engine. Identify your weak spots and get instant feedback on your understanding.",
    icon: BrainCircuit,
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: "tasks",
    title: "Deadlines & Tasks",
    description: "Never miss an assignment again. Our integrated calendar and task manager keeps track of all your academic commitments in one place.",
    icon: CalendarClock,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "community",
    title: "Peer Leaderboard",
    description: "Gamify your learning experience. Earn Tomatoes (Tomo) for studying, climb the leaderboard, and stay motivated with friendly competition.",
    icon: Users,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    id: "tools",
    title: "Career Tools",
    description: "Build your resume, prepare for interviews, and access exclusive internship opportunities designed to make you career-ready.",
    icon: Rocket,
    color: "bg-purple-100 text-purple-600",
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] font-body text-stone-900 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors text-xs font-black uppercase tracking-[0.2em] mb-12 cursor-pointer bg-transparent border-none p-0">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Everything you need. <br className="hidden md:block" />
            <span className="text-stone-400">All in one place.</span>
          </h1>
          <p className="text-stone-500 font-medium leading-relaxed text-lg">
            DBE OS isn't just a platform; it's a productivity ecosystem tailored for your success. Explore the powerful tools at your fingertips.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black tracking-tight mb-3 group-hover:text-stone-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-stone-500 font-medium text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20 text-center bg-stone-900 text-white rounded-[2.5rem] p-12 md:p-16 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
            
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 relative z-10">
                Ready to upgrade your workflow?
            </h2>
            <p className="text-stone-400 mb-8 max-w-xl mx-auto relative z-10">
                Join hundreds of DBE students already using the platform to excel in their degree.
            </p>
            <Link 
                href="/login"
                className="relative z-10 inline-flex items-center justify-center bg-white text-stone-900 px-8 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-transform"
            >
                Start using DBE OS
            </Link>
        </motion.div>
      </div>
    </div>
  );
}
