"use client";

import { Filter, X } from "lucide-react";

const ROLES = ['Finance', 'Marketing', 'Operations', 'Product', 'Strategy', 'Design', 'Data', 'UI/UX'];
const TERMS = [1, 2, 3, 4, 5, 6, 7, 8];

interface FilterSidebarProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  selectedRoles: string[];
  setSelectedRoles: (roles: string[]) => void;
  selectedTerm: number | null;
  setSelectedTerm: (term: number | null) => void;
}

export default function FilterSidebar({ 
  selectedType, 
  setSelectedType, 
  selectedSkills, 
  setSelectedSkills,
  selectedRoles,
  setSelectedRoles,
  selectedTerm,
  setSelectedTerm
}: FilterSidebarProps) {
  
  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div className="space-y-8 bg-surface-container-lowest border border-outline-variant/15 rounded-[2.5rem] p-8 h-fit sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-2 mb-2">
        <Filter className="w-4 h-4 text-indigo-600" />
        <h2 className="text-sm font-black uppercase tracking-widest text-on-surface">Matrix Filters</h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-tighter text-on-surface-variant">Listing Category</h3>
        <div className="grid grid-cols-1 gap-2">
          {['All', 'Case Competition', 'Hackathon', 'Co-founder', 'Learning Partner'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedType(category)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                selectedType === category 
                ? 'bg-indigo-600 text-white' 
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-tighter text-on-surface-variant">Filter by Roles</h3>
        <div className="flex flex-wrap gap-2">
          {ROLES.map(role => (
            <button
              key={role}
              onClick={() => toggleRole(role)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${
                selectedRoles.includes(role)
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                : 'bg-surface-container border-transparent text-on-surface-variant hover:border-outline-variant'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-tighter text-on-surface-variant">Academic Term</h3>
        <div className="grid grid-cols-4 gap-2">
          {TERMS.map(term => (
            <button
              key={term}
              onClick={() => setSelectedTerm(selectedTerm === term ? null : term)}
              className={`py-2 rounded-lg text-[9px] font-bold transition-all border ${
                selectedTerm === term
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-surface-container border-transparent text-on-surface-variant'
              }`}
            >
              T{term}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black uppercase tracking-tighter text-on-surface-variant">Skill Focus</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMON_SKILLS.map(skill => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all border ${
                selectedSkills.includes(skill)
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-surface-container border-transparent text-on-surface-variant'
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
