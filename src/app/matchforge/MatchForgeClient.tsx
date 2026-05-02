"use client";

import { useState, useEffect } from "react";
import { Users, Search, Loader2, Sparkles, Filter, Grid, UserPlus } from "lucide-react";
import FilterSidebar from "@/components/matchforge/FilterSidebar";
import CreateListingModal from "@/components/matchforge/CreateListingModal";
import ProfileSetupModal from "@/components/matchforge/ProfileSetupModal";
import ListingCard from "@/components/matchforge/ListingCard";
import ProfileCard from "@/components/matchforge/ProfileCard";
import { getListings, getProfile, getMatches } from "@/actions/matchforge";
import { MatchListing, MatchProfile } from "@/types/matchforge";

interface MatchForgeClientProps {
  initialProfile: MatchProfile | null;
  initialListings: MatchListing[];
  initialMatches: (MatchProfile & { matchScore?: number })[];
}

export default function MatchForgeClient({ initialProfile, initialListings, initialMatches }: MatchForgeClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [view, setView] = useState<'feed' | 'peers'>('feed');
  const [listings, setListings] = useState<MatchListing[]>(initialListings);
  const [matches, setMatches] = useState<(MatchProfile & { matchScore?: number })[]>(initialMatches);
  const [profile, setProfile] = useState<MatchProfile | null>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    async function updateData() {
      setIsLoading(true);
      try {
        const [newListings, newMatches] = await Promise.all([
          getListings({ 
            type: selectedType, 
            skills: selectedSkills,
            roles: selectedRoles
          }),
          getMatches()
        ]);
        
        setListings(newListings);
        setMatches(newMatches);
      } catch (err: any) {
        console.error("MatchForge Update Error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    updateData();
  }, [selectedType, selectedSkills, selectedRoles, isMounted]);

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Syncing Matrix...</p>
      </div>
    );
  }

  const filteredListings = listings.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMatches = matches.filter(m => {
    const matchesSearch = (m.roles?.some(r => r.toLowerCase().includes(searchQuery.toLowerCase())) || false) ||
                         (m.bio?.toLowerCase()?.includes(searchQuery.toLowerCase()) || false);
    const matchesTerm = selectedTerm ? m.current_term === selectedTerm : true;
    const matchesRoles = selectedRoles.length > 0 ? (m.roles?.some(r => selectedRoles.includes(r)) || false) : true;
    
    return matchesSearch && matchesTerm && matchesRoles;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <ProfileSetupModal isOpen={!isLoading && (!profile || profile?.is_complete === false)} initialData={profile} />

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight">MatchForge</h1>
              <p className="text-on-surface-variant font-medium">Co-Founder & Teammate Matrix</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-surface-container-low p-1.5 rounded-2xl flex items-center gap-1">
            <button 
              onClick={() => setView('feed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'feed' ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <Grid className="w-3.5 h-3.5" />
              Listing Feed
            </button>
            <button 
              onClick={() => setView('peers')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'peers' ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Peer Discovery
            </button>
          </div>
          <CreateListingModal />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <FilterSidebar 
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
            selectedTerm={selectedTerm}
            setSelectedTerm={setSelectedTerm}
          />
        </aside>

        <main className="lg:col-span-9 space-y-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input 
              type="text"
              placeholder={`Search ${view === 'feed' ? 'listings' : 'peers'} by skills, bio, or title...`}
              className="w-full bg-surface-container-low p-5 pl-12 rounded-3xl border border-outline-variant/10 focus:border-indigo-500/30 focus:outline-none transition-all font-medium text-on-surface"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <p className="text-sm font-black uppercase tracking-widest text-on-surface-variant">Scanning the Matrix...</p>
            </div>
          ) : (
            <div className="space-y-10">
              {view === 'peers' && matches.length > 0 && searchQuery === "" && (
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-black font-headline text-on-surface">Recommended for You</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matches.slice(0, 4).map(match => (
                      <ProfileCard key={match.id} profile={match} />
                    ))}
                  </div>
                </section>
              )}

              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black font-headline text-on-surface">
                    {view === 'feed' ? 'All Active Requests' : 'Explore All Peers'}
                  </h2>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    {view === 'feed' ? filteredListings.length : filteredMatches.length} results
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {view === 'feed' ? (
                    filteredListings.length > 0 ? (
                      filteredListings.map(listing => (
                        <ListingCard key={listing.id} listing={listing} />
                      ))
                    ) : (
                      <EmptyState />
                    )
                  ) : (
                    filteredMatches.length > 0 ? (
                      filteredMatches.map(match => (
                        <ProfileCard key={match.id} profile={match} />
                      ))
                    ) : (
                      <EmptyState />
                    )
                  )}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-2 text-center py-20 bg-surface-container-lowest border border-dashed border-outline-variant/20 rounded-[3rem]">
      <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-8 h-8 text-on-surface-variant" />
      </div>
      <h3 className="text-xl font-black text-on-surface mb-2">No matches found</h3>
      <p className="text-on-surface-variant text-sm">Try adjusting your filters or search terms.</p>
    </div>
  );
}
