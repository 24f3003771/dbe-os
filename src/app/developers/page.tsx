"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ExternalLink, Code2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const Founders = [
  {
    name: "Ishaan Jha",
    role: "Co-founder & Lead Product Manager",
    description: "Driving the vision and technical architecture behind DBE OS. Focused on building high-performance educational tools for the modern scholar.",
    linkedin: "https://www.linkedin.com/in/ishaan-jha-2b6977340/",
    github: "https://github.com/Ishaan-jha-dev",
    email: "ishaan@dbeos.in",
    image: "https://github.com/Ishaan-jha-dev.png", 
    skills: ["Product Vision", "Full Stack Dev", "System Architecture"]
  },
  {
    name: "Madhwendra Shukla",
    role: "Co-founder & Product Manager",
    description: "Expert in user psychology and product-led growth. Ensuring DBE OS remains the most intuitive and useful platform for the IIM Bangalore community.",
    linkedin: "https://www.linkedin.com/in/madhwendra-shukla-77a13920b/",
    github: "https://github.com/madhwendrashukla",
    email: "madhwendra@dbeos.in",
    image: "/madhwendra_profile.png",
    skills: ["User Experience", "Product Growth", "Community Strategy"]
  }
];

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] font-body text-stone-900 py-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors text-xs font-black uppercase tracking-[0.2em] mb-16">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-stone-200 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-stone-600" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">The Developers.</h1>
          </div>
          <p className="text-stone-500 font-medium leading-relaxed max-w-2xl">
            We built DBE OS to solve our own problems as scholars. We believe in building minimalist, high-performance tools that get out of your way so you can focus on innovation.
          </p>
        </motion.div>

        <div className="space-y-12">
          {Founders.map((founder, index) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="group flex flex-col md:flex-row gap-8 items-start border-t border-stone-200 pt-12"
            >
              <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-stone-200 border border-stone-300">
                <img 
                  src={founder.image} 
                  alt={founder.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-xl font-black tracking-tight mb-1">{founder.name}</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">{founder.role}</p>
                </div>
                
                <p className="text-stone-600 font-medium text-sm leading-relaxed max-w-xl">
                  {founder.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {founder.skills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-stone-100 border border-stone-200 rounded-md text-[9px] font-black uppercase tracking-widest text-stone-500">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <a href={founder.linkedin} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-[#0077b5] transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href={founder.github} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-stone-900 transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                  <a href={`mailto:${founder.email}`} className="text-stone-400 hover:text-stone-900 transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
