"use client";

import { motion } from "framer-motion";
import { Share2, Briefcase, Users, Zap, GraduationCap, Trophy } from "lucide-react";
import { MatchListing } from "@/actions/matchforge";

const typeIcons = {
  'Case Competition': Trophy,
  'Hackathon': Zap,
  'Co-founder': Users,
  'Learning Partner': GraduationCap
};

export default function ListingCard({ listing }: { listing: MatchListing }) {
  const Icon = typeIcons[listing.type] || Briefcase;

  const handleShare = () => {
    const text = `Check out this ${listing.type} opportunity: ${listing.title} on DBE-OS!`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: listing.title, text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-container-lowest border border-outline-variant/15 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-xl bg-surface-container text-on-surface-variant group-hover:bg-indigo-600 group-hover:text-white transition-colors`}>
          <Icon className="w-5 h-5" />
        </div>
        <button 
          onClick={handleShare}
          className="p-2 text-on-surface-variant hover:text-indigo-600 transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1 mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
          {listing.type}
        </span>
        <h3 className="text-lg font-black font-headline text-on-surface line-clamp-1">{listing.title}</h3>
      </div>

      <p className="text-sm text-on-surface-variant line-clamp-3 mb-6 leading-relaxed">
        {listing.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {listing.required_skills.map((skill, i) => (
          <span 
            key={i} 
            className="text-[9px] font-bold uppercase tracking-wider bg-surface-container px-2.5 py-1 rounded-lg text-on-surface-variant border border-outline-variant/5"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
