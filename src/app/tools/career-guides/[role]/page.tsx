"use client";

import { useEffect, useState } from "react";
import RoadmapRenderer from "@/components/RoadmapRenderer";
import { ChevronLeft, Loader2 } from "lucide-react";
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
        // We fetch the JSON from the public folder
        const res = await fetch(`/roadmaps/${role}/${role}.json`);
        if (!res.ok) {
          throw new Error("Roadmap not found");
        }
        const data = await res.json();
        setNodes(data.nodes);
        setEdges(data.edges || []);
      } catch (err: any) {
        setError(err.message || "Failed to load roadmap.");
      } finally {
        setLoading(false);
      }
    }
    
    if (role) {
      loadRoadmap();
    }
  }, [role]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 pb-20 p-4 md:p-8 h-screen max-h-screen">
      <div className="flex-shrink-0">
        <Link href="/tools/career-guides" className="inline-flex items-center gap-2 text-stone-400 hover:text-[#1A1A1A] font-bold text-sm transition-colors group mb-4 w-fit">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Career Guides
        </Link>
        <h1 className="text-3xl md:text-5xl font-black font-headline tracking-tighter text-[#1A1A1A] capitalize">
          {role.replace(/-/g, ' ')} Roadmap
        </h1>
      </div>

      <div className="flex-1 relative bg-white rounded-[3rem] shadow-sm border border-stone-100 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="font-bold">Loading roadmap...</p>
          </div>
        )}
        
        {error && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400">
            <p className="font-bold text-xl">{error}</p>
          </div>
        )}

        {!loading && !error && nodes && edges && (
          <RoadmapRenderer nodesData={nodes} edgesData={edges} title={role} />
        )}
      </div>
    </div>
  );
}
