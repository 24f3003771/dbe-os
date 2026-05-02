"use client";

import { Filter, X } from "lucide-react";

const CATEGORIES = ['All', 'Case Competition', 'Hackathon', 'Co-founder', 'Learning Partner'];
const COMMON_SKILLS = [
  'Financial Modeling', 'Market Research', 'Pitch Deck Design', 
  'Operations', 'Marketing Strategy', 'Product Management', 
  'Data Analytics', 'Public Speaking', 'UI/UX Design'
];

interface FilterSidebarProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
}

export default function FilterSidebar({ 
  selectedType, 
  setSelectedType, 
  selectedSkills, 
  setSelectedSkills 
}: FilterSidebarProps) {
  
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div className="space-y-8 bg-surface-container-lowest border border-outline-variant/15 rounded-[2.5rem] p-8 h-fit sticky top-8">
      <div className="flex items-center gap-2 mb-2">
        <Filter className="w-4 h-4 text-indigo-600" />
        <h2 className="text-sm font-black uppercase tracking-widest text-on-surface">Filters</h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-tighter text-on-surface-variant">Listing Type</h3>
        <div className="space-y-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedType(category)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                selectedType === category 
                ? 'bg-indigo-600 text-white font-bold' 
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black uppercase tracking-tighter text-on-surface-variant">Skills</h3>
          {selectedSkills.length > 0 && (
            <button 
              onClick={() => setSelectedSkills([])}
              className="text-[9px] font-bold text-indigo-600 hover:underline uppercase"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMON_SKILLS.map(skill => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                selectedSkills.includes(skill)
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-surface-container border-transparent text-on-surface-variant hover:border-outline-variant'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
