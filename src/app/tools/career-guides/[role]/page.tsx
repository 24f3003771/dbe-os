"use client";

import { useEffect, useState } from "react";
import RoadmapRenderer from "@/components/RoadmapRenderer";
import { ChevronLeft, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function RoleRoadmapPage() {
  const params = useParams();
  const role = params.role as string;

  const [nodes, setNodes] = useState<any[] | null>(null);
  const [edges, setEdges] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRoadmap() {
      try {
        setLoading(true);
        const res = await fetch(`/roadmaps/${role}/${role}.json`);
        if (!res.ok) throw new Error("Roadmap not found");
        const data = await res.json();
        setNodes(data.nodes);
        setEdges(data.edges || []);
      } catch (err: any) {
        setError(err.message || "Failed to load roadmap.");
      } finally {
        setLoading(false);
      }
    }
    if (role) loadRoadmap();
  }, [role]);

  const displayTitle = role
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
          <Link
            href="/tools/career-guides"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-700 font-bold text-sm transition-colors group flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="w-px h-6 bg-slate-200 flex-shrink-0" />
          <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight truncate">
            {displayTitle} <span className="text-slate-400 font-bold">Roadmap</span>
          </h1>
        </div>
      </div>

      {/* ── Loading / Error states ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-40 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p className="font-bold">Loading roadmap...</p>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-40 text-red-400">
          <p className="font-bold text-xl">{error}</p>
          <p className="text-sm mt-2 text-slate-400">Make sure this roadmap exists in /public/roadmaps/{role}/</p>
        </div>
      )}

      {/* ── Roadmap Content ── */}
      {!loading && !error && nodes && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 mb-20">
          <div className="w-full bg-slate-50 rounded-[1.5rem] shadow-2xl border border-slate-200 flex flex-col">
            {/* Mac OS Header */}
            <div className="h-10 bg-[#1c1c1e] border-b border-[#2d2d2f] rounded-t-[1.5rem] w-full flex items-center px-4 relative shrink-0 sticky top-[72px] z-20">
              <div className="flex gap-1.5 absolute left-4">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="w-full text-center text-[#86868b] text-[10px] font-mono tracking-widest uppercase truncate px-20">
                {role ? `${role.toUpperCase().replace(/-/g, '_')}.ROADMAP` : 'ROADMAP.VIEW'}
              </div>
            </div>
            
            {/* Roadmap Body */}
            <div className="p-4 md:p-6 pb-12">
              <RoadmapRenderer nodesData={nodes} edgesData={edges ?? []} title={role} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
