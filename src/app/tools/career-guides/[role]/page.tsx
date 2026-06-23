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
  
  // Progress tracking state
  const [isStarted, setIsStarted] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);

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
    
    async function fetchProgress() {
      try {
        const res = await fetch(`/api/roadmaps/progress?roadmapId=${role}`);
        if (res.ok) {
          const data = await res.json();
          setIsStarted(data.started);
          if (data.started) {
            setCompletedTopics(data.completedTopics || []);
          }
        }
      } catch (err) {
        console.error("Failed to fetch progress", err);
      }
    }
    
    if (role) {
      loadRoadmap();
      fetchProgress();
    }
  }, [role]);

  const startRoadmap = async () => {
    try {
      setProgressLoading(true);
      const res = await fetch('/api/roadmaps/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roadmapId: role })
      });
      if (res.ok) {
        setIsStarted(true);
        setCompletedTopics([]);
      }
    } catch (err) {
      console.error("Failed to start roadmap", err);
    } finally {
      setProgressLoading(false);
    }
  };

  const toggleTopicCompletion = async (topicLabel: string, completed: boolean) => {
    try {
      // Optimistic update
      setCompletedTopics(prev => 
        completed ? [...prev, topicLabel] : prev.filter(t => t !== topicLabel)
      );
      
      await fetch('/api/roadmaps/topics/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roadmapId: role, topicLabel, completed })
      });
    } catch (err) {
      console.error("Failed to toggle topic", err);
      // Revert on error
      setCompletedTopics(prev => 
        !completed ? [...prev, topicLabel] : prev.filter(t => t !== topicLabel)
      );
    }
  };

  const displayTitle = role
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="w-full h-screen p-2 md:p-4">
          <div className="w-full h-full bg-[#f8f9fa] rounded-3xl shadow-2xl border border-slate-200/60 flex flex-col overflow-hidden relative">
            {/* Mac OS Header */}
            <div className="h-12 bg-white/80 backdrop-blur-md border-b border-slate-200/60 w-full flex items-center px-4 relative shrink-0 z-20">
              <div className="flex gap-2 absolute left-4">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
              </div>
              
              {/* Back Button integrated into Mac Header */}
              <div className="absolute left-20">
                <Link
                  href="/tools/career-guides"
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-800 font-semibold text-xs transition-colors group"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="hidden sm:inline">Back</span>
                </Link>
              </div>

              <div className="w-full text-center text-slate-500 text-[11px] font-semibold tracking-wide truncate px-32">
                {displayTitle} Roadmap
              </div>
            </div>
            
            {/* Loading / Error states */}
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-[#f8f9fa]">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="font-bold text-sm">Loading roadmap...</p>
              </div>
            )}
            
            {error && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-red-400 bg-[#f8f9fa]">
                <p className="font-bold text-xl">{error}</p>
                <p className="text-sm mt-2 text-slate-400">Make sure this roadmap exists in /public/roadmaps/{role}/</p>
              </div>
            )}

            {/* Roadmap Body */}
            {!loading && !error && nodes && (
              <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f8f9fa] relative">
                
                {/* Start Roadmap Overlay */}
                {!isStarted && (
                  <div className="absolute inset-0 z-10 bg-slate-50/50 backdrop-blur-[2px] flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-200/60 max-w-md text-center">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
                        🚀
                      </div>
                      <h2 className="text-2xl font-black text-slate-800 mb-2">Ready to start?</h2>
                      <p className="text-slate-500 mb-6 text-sm">
                        Set this roadmap as your active target. You'll be able to track your progress, mark topics as complete, and build your skillset step-by-step.
                      </p>
                      <button 
                        onClick={startRoadmap}
                        disabled={progressLoading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                      >
                        {progressLoading ? "Starting..." : "Start this Roadmap"}
                      </button>
                    </div>
                  </div>
                )}

                <div className={`max-w-6xl mx-auto ${!isStarted ? 'opacity-30 pointer-events-none select-none blur-sm transition-all duration-500' : ''}`}>
                  <RoadmapRenderer 
                    nodesData={nodes} 
                    edgesData={edges ?? []} 
                    title={role} 
                    isStarted={isStarted}
                    completedTopics={completedTopics}
                    onToggleComplete={toggleTopicCompletion}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
  );
}
