"use client";

import { motion } from "framer-motion";
import { Linkedin, Phone, MapPin, Sparkles } from "lucide-react";
import { MatchProfile } from "@/types/matchforge";

export default function ProfileCard({ profile }: { profile: MatchProfile & { matchScore?: number } }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface-container-lowest border border-outline-variant/15 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all relative group overflow-hidden"
    >
      {/* Match Badge */}
      {profile.matchScore !== undefined && (
        <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 z-10">
          <Sparkles className="w-3 h-3" />
          {profile.matchScore}% Match
        </div>
      )}

      <div className="flex flex-col h-full">
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {profile.roles?.map((role, i) => (
                <span key={i} className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {role}
                </span>
              ))}
            </div>
            <h3 className="text-xl font-black font-headline text-on-surface pt-1">Anonymous Peer</h3>
            <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
              <span>Term {profile.current_term}</span>
              {profile.location && (
                <>
                  <span className="w-1 h-1 bg-outline-variant rounded-full" />
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {profile.location}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3 italic">
            "{profile.bio}"
          </p>
        </div>

        <div className="space-y-4 mt-auto pt-6 border-t border-outline-variant/5">
          <div className="flex flex-wrap gap-1.5">
            {profile.skills?.slice(0, 4).map((skill, i) => (
              <span key={i} className="text-[9px] font-bold uppercase tracking-wider bg-surface-container px-2 py-1 rounded-lg text-on-surface-variant">
                {skill}
              </span>
            ))}
            {(profile.skills?.length || 0) > 4 && (
              <span className="text-[9px] font-bold text-on-surface-variant px-1">+{(profile.skills?.length || 0) - 4} more</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <a 
              href={profile.linkedin_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#0077B5] text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </a>
            {profile.whatsapp_number && (
              <a 
                href={`https://wa.me/${profile.whatsapp_number.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-[#25D366] text-white rounded-2xl hover:opacity-90 transition-opacity"
              >
                <Phone className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Decorative background circle */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700" />
    </motion.div>
  );
}
