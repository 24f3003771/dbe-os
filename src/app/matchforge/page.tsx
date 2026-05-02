"use client";

import { useState, useEffect } from "react";
import { Users, Search, Loader2 } from "lucide-react";
import FilterSidebar from "@/components/matchforge/FilterSidebar";
import CreateListingModal from "@/components/matchforge/CreateListingModal";
import ListingCard from "@/components/matchforge/ListingCard";
import { getListings, MatchListing } from "@/actions/matchforge";

export default function MatchForgePage() {
  const [listings, setListings] = useState<MatchListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadListings() {
      setIsLoading(true);
      const data = await getListings({ 
        type: selectedType, 
        skills: selectedSkills 
      });
      setListings(data);
      setIsLoading(false);
    }
    loadListings();
  }, [selectedType, selectedSkills]);

  const filteredListings = listings.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
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
        <CreateListingModal />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <FilterSidebar 
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
          />
        </aside>

        {/* Main Feed */}
        <main className="lg:col-span-9 space-y-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input 
              type="text"
              placeholder="Search listings by title or description..."
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
          ) : filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-surface-container-lowest border border-dashed border-outline-variant/20 rounded-[3rem]">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-on-surface-variant" />
              </div>
              <h3 className="text-xl font-black text-on-surface mb-2">No matches found</h3>
              <p className="text-on-surface-variant text-sm">Try adjusting your filters or be the first to post a request!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
