"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ExternalLink, Rocket, Sparkles, Code2 } from "lucide-react";
import Link from "next/link";

const Founders = [
  {
    name: "Ishaan Jha",
    role: "Co-founder & Lead Product Manager",
    description: "Driving the vision and technical architecture behind DBE OS. Focused on building high-performance educational tools for the modern scholar.",
    linkedin: "https://www.linkedin.com/in/ishaan-jha-2b6977340/",
    github: "https://github.com/Ishaan-jha-dev",
    email: "ishaan@dbeos.in",
    image: "https://github.com/Ishaan-jha-dev.png", // Using GitHub avatar as fallback for professional use
    skills: ["Product Vision", "Full Stack Dev", "System Architecture"]
  },
  {
    name: "Madhwendra Shukla",
    role: "Co-founder & Product Manager",
    description: "Expert in user psychology and product-led growth. Ensuring DBE OS remains the most intuitive and useful platform for the IIM Bangalore community.",
    linkedin: "https://www.linkedin.com/in/madhwendra-shukla-77a13920b/",
    github: "https://github.com/madhwendrashukla",
    email: "madhwendra@dbeos.in",
    image: "https://github.com/madhwendrashukla.png",
    skills: ["User Experience", "Product Growth", "Community Strategy"]
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20 space-y-4"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full text-primary font-black text-[10px] tracking-widest uppercase mb-4">
          <Rocket className="w-3.5 h-3.5" /> The Minds Behind The OS
        </div>
        <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-on-surface leading-tight">
          Architecting the <span className="text-primary italic">Future</span> <br/> of Academic Growth.
        </h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto font-medium text-lg">
          We built DBE OS to solve our own problems as IIM Bangalore scholars. Now, we're sharing that command center with you.
        </p>
      </motion.div>

      {/* Founders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {Founders.map((founder, index) => (
          <motion.div
            key={founder.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="group relative bg-surface-container rounded-[2.5rem] p-8 border border-outline-variant/10 hover:border-primary/30 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl"
          >
            <div className="relative z-10 flex flex-col h-full">
              {/* Profile Image & Role */}
              <div className="flex items-start justify-between mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl border-2 border-white ring-4 ring-primary/5">
                    <img 
                      src={founder.image} 
                      alt={founder.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-xl shadow-lg border-2 border-white">
                    <Code2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={founder.linkedin} target="_blank" className="p-3 bg-surface-container-highest rounded-2xl text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href={founder.github} target="_blank" className="p-3 bg-surface-container-highest rounded-2xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all">
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-4 mb-8">
                <h2 className="text-3xl font-black font-headline text-on-surface tracking-tight">{founder.name}</h2>
                <p className="text-primary font-bold text-sm tracking-wide uppercase">{founder.role}</p>
                <p className="text-on-surface-variant font-medium leading-relaxed italic">
                  "{founder.description}"
                </p>
              </div>

              {/* Skills/Tags */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {founder.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-surface-container-low border border-outline-variant/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Connect Link */}
              <div className="mt-8 pt-8 border-t border-outline-variant/10 flex items-center justify-between">
                <a href={`mailto:${founder.email}`} className="flex items-center gap-2 text-sm font-black text-on-surface hover:text-primary transition-colors group/link">
                  <Mail className="w-4 h-4 text-primary" /> Connect via Email
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-700"></div>
          </motion.div>
        ))}
      </div>

      {/* Philosophy Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-24 text-center space-y-6 max-w-3xl"
      >
        <Sparkles className="w-8 h-8 text-secondary mx-auto" />
        <h3 className="text-2xl font-black font-headline text-on-surface">Our Philosophy</h3>
        <p className="text-on-surface-variant font-medium leading-relaxed">
          DBE OS isn't just a website; it's a productivity philosophy. We believe that by automating the "busy work" of tracking deadlines and finding resources, students can spend more time what actually matters: <span className="text-primary font-bold">Innovation.</span>
        </p>
      </motion.div>
    </div>
  );
}
