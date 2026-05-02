import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import MatchForgeClient from "./MatchForgeClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "MatchForge | DBE OS",
  description: "Connect with co-founders and teammates in the IIM Bangalore DBE community.",
};

export default function MatchForgePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Syncing Matrix Data...</p>
      </div>
    }>
      <MatchForgeClient />
    </Suspense>
  );
}
