"use client";

import React, { useMemo, useState, useCallback } from 'react';
import { Balsamiq_Sans } from 'next/font/google';

const balsamiq = Balsamiq_Sans({ weight: ['400', '700'], subsets: ['latin'] });

// ─── Topic Notes ──────────────────────────────────────────────────────────────
const TOPIC_NOTES: Record<string, string> = {
  'html': 'Learn semantic HTML5 tags, forms, accessibility (ARIA), and proper document structure. Practice building static pages from scratch.',
  'css': 'Master the box model, flexbox, CSS grid, media queries, and CSS variables. Build responsive layouts without frameworks first.',
  'javascript': 'Learn ES6+ fundamentals: variables, functions, async/await, fetch API, DOM manipulation. Build 5+ small projects.',
  'react': 'Understand components, props, state, and hooks (useState, useEffect, useContext). Build a full CRUD app.',
  'node.js': 'Learn HTTP servers, Express.js, middleware, REST APIs, and connecting to databases. Deploy a simple API.',
  'income statement': 'Learn: Revenue → Gross Profit → EBITDA → Net Income. Practice reading real 10-K filings from public companies.',
  'balance sheet': 'Understand Assets = Liabilities + Equity. Learn current vs. non-current items. Read Apple or Microsoft balance sheets.',
  'cash flow': 'Focus on Operating, Investing, and Financing activities. Understand why net income ≠ cash flow.',
  'dcf': 'Project free cash flows for 5–10 years, calculate terminal value, discount back at WACC. Build one from scratch in Excel.',
  'lbo': 'Build a sources & uses table, model the debt schedule, and calculate IRR and cash-on-cash returns in Excel.',
  'market sizing': 'Practice TAM/SAM/SOM estimation. Use both top-down and bottom-up approaches. 5 minutes per case.',
  'case interview': 'Practice 50+ cases using McKinsey, BCG, and Bain frameworks. Record yourself and review.',
  'python': 'Start with basic syntax, then learn pandas, matplotlib, and write scripts to automate real tasks.',
  'sql': 'Practice SELECT, JOINs, GROUP BY, window functions, and CTEs. Solve 30+ problems on LeetCode.',
  'excel': 'Master VLOOKUP, INDEX-MATCH, SUMIFS, pivot tables, and Power Query. Build a financial model from scratch.',
  'financial modeling': 'Build a 3-statement model (Income Statement → Balance Sheet → Cash Flow) that auto-links.',
  'valuation': 'Learn 3 methods: Comparable Companies, Precedent Transactions, and DCF. Always triangulate.',
  'kubernetes': 'Start with pods and deployments, then services and ingress. Use Minikube locally first.',
  'docker': 'Write a Dockerfile, build an image, run a container, then learn Docker Compose for multi-service apps.',
  'typescript': 'Add TypeScript to an existing JS project. Focus on types, interfaces, and generics first.',
  'git': 'Learn the core workflow: init → add → commit → push. Master branching and conflict resolution.',
  'a/b testing': 'Define a clear hypothesis, pick one variable, calculate sample size for statistical significance.',
  'seo': 'Start with keyword research (Ahrefs/SEMrush), optimize title tags, build internal links, track rankings.',
};

function getTopicNote(label: string): string {
  const lower = label.toLowerCase();
  for (const [key, note] of Object.entries(TOPIC_NOTES)) {
    if (lower.includes(key)) return note;
  }
  return `Learn "${label}" through structured study. Find 1–2 high-quality resources, build something real with it, then apply it in a project.`;
}

// ─── Section parsing ──────────────────────────────────────────────────────────
interface Section { id: string; label: string; topics: { id: string; label: string; description?: string }[] }

function parseRoadmap(nodesData: any[]): Section[] {
  const SKIP = ['paragraph', 'button', 'legend', 'linksgroup', 'vertical', 'horizontal'];
  const filtered = nodesData.filter((n) => !SKIP.includes(n.type));

  const sectionNodes = filtered
    .filter((n) => n.type === 'title' || (n.type === 'topic' && n.data?.isSection))
    .sort((a, b) => (a.position?.y ?? 0) - (b.position?.y ?? 0));

  const topicNodes = filtered.filter((n) =>
    (n.type === 'topic' || n.type === 'subtopic' || n.type === 'todo') && !n.data?.isSection
  );

  return sectionNodes
    .map((sec, i) => {
      const secY = sec.position?.y ?? 0;
      const nextSecY = i + 1 < sectionNodes.length ? (sectionNodes[i + 1].position?.y ?? Infinity) : Infinity;
      const topics = topicNodes
        .filter((t) => { const ty = t.position?.y ?? 0; return ty > secY && ty < nextSecY; })
        .sort((a, b) => (a.position?.y ?? 0) !== (b.position?.y ?? 0) ? (a.position?.y ?? 0) - (b.position?.y ?? 0) : (a.position?.x ?? 0) - (b.position?.x ?? 0))
        .map((t) => ({ id: t.id, label: t.data?.label || t.label || '', description: t.data?.description }));
      return { id: sec.id, label: sec.data?.label || sec.label || '', topics };
    })
    .filter((s) => s.label);
}

// Section accent colors — cycles through 8 distinct hues
const SECTION_ACCENTS = [
  { bg: '#1e3a5f', border: '#2563eb', dot: '#3b82f6', tag: 'bg-blue-100 text-blue-700' },
  { bg: '#1e1e5f', border: '#7c3aed', dot: '#8b5cf6', tag: 'bg-violet-100 text-violet-700' },
  { bg: '#1e3a2f', border: '#059669', dot: '#10b981', tag: 'bg-emerald-100 text-emerald-700' },
  { bg: '#3f1e1e', border: '#dc2626', dot: '#ef4444', tag: 'bg-red-100 text-red-700' },
  { bg: '#1e3050', border: '#0284c7', dot: '#0ea5e9', tag: 'bg-sky-100 text-sky-700' },
  { bg: '#2d1e3f', border: '#9333ea', dot: '#a855f7', tag: 'bg-purple-100 text-purple-700' },
  { bg: '#3f2d1e', border: '#d97706', dot: '#f59e0b', tag: 'bg-amber-100 text-amber-700' },
  { bg: '#1e3f35', border: '#0d9488', dot: '#14b8a6', tag: 'bg-teal-100 text-teal-700' },
];

// ─── Info Modal (Macbook Pop) ────────────────────────────────────────────────────────
function InfoModal({ topic, onClose }: { topic: { label: string; description?: string } | null; onClose: () => void }) {
  if (!topic) return null;
  const note = topic.description || getTopicNote(topic.label);
  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 animate-in fade-in duration-200" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200" style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5) inset' }}>
          <div className="px-6 py-5 border-b border-slate-200/50 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Topic Notes</p>
              <h3 className="font-black text-slate-800 text-lg leading-tight">{topic.label}</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors flex-shrink-0" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-6 flex flex-col gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> How to Learn
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">{note}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Quick Tips
              </p>
              <ul className="flex flex-col gap-2">
                {['Find 1 dedicated resource and finish it completely', 'Build something real with this skill', 'Explain it to someone else to solidify understanding'].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-emerald-500 font-black mt-0.5 flex-shrink-0">→</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Find Resources
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'YouTube', url: `https://youtube.com/results?search_query=${encodeURIComponent(topic.label + ' tutorial')}`, color: '#ef4444' },
                  { label: 'Google', url: `https://google.com/search?q=${encodeURIComponent('how to learn ' + topic.label)}`, color: '#3b82f6' },
                ].map((r) => (
                  <a key={r.label} href={r.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200/50 hover:bg-slate-50 hover:border-slate-300 text-sm font-semibold text-slate-700 transition-colors group">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                      Search {r.label}
                    </div>
                    <span className="text-slate-300 group-hover:text-slate-400 transition-colors">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── How To Use Modal ─────────────────────────────────────────────────────────
function HowToModal({ onClose }: { onClose: () => void }) {
  const steps = [
    { icon: '🛣️', title: 'Follow the Path', desc: 'The roadmap flows top → bottom. Each stop on the left timeline is a major skill area.' },
    { icon: '🧭', title: 'Jump via Sidebar', desc: 'Click any section in the sidebar to jump directly to it.' },
    { icon: '📝', title: 'Click Topics for Notes', desc: 'Every topic chip is clickable and pops up a quick study guide.' },
    { icon: '📚', title: 'Go Deep, Not Wide', desc: 'One well-learned section beats five half-understood ones.' },
  ];
  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 animate-in fade-in duration-200" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className={`bg-white/90 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200 ${balsamiq.className}`} style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5) inset' }}>
          <div className="px-6 py-5 border-b border-slate-200/50 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Career Guides</p>
              <h2 className="text-lg font-black text-slate-800">How to Use This Roadmap</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors flex-shrink-0" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          <div className="p-6 flex flex-col gap-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{step.icon}</span>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{step.title}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Renderer ────────────────────────────────────────────────────────────
export default function RoadmapRenderer({ nodesData, edgesData = [], title }: { nodesData: any[]; edgesData?: any[]; title?: string }) {
  const [selectedTopic, setSelectedTopic] = useState<{ label: string; description?: string } | null>(null);
  const [showHowTo, setShowHowTo] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = useMemo(() => parseRoadmap(nodesData), [nodesData]);

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  }, []);

  if (!sections.length) return <div className="text-slate-400 text-center py-20 font-bold">No sections found.</div>;

  return (
    <div className={`flex gap-6 items-start ${balsamiq.className}`}>

      {/* ── Sticky Sidebar ── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 sticky top-0 self-start max-h-[calc(100vh-6rem)]">
        <div className="px-2 py-3 flex items-center justify-between shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sections</span>
          <button onClick={() => setShowHowTo(true)}
            className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-300 transition-colors text-[10px] font-black flex items-center justify-center"
            title="How to use this roadmap">i</button>
        </div>
        <div className="overflow-y-auto flex-1 pb-4">
          {sections.map((sec, i) => {
            const accent = SECTION_ACCENTS[i % SECTION_ACCENTS.length];
            const isActive = activeSection === sec.id;
            return (
              <button key={sec.id} onClick={() => scrollToSection(sec.id)}
                className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-all text-xs font-bold rounded-xl group
                  ${isActive ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-slate-200/50'}`}>
                <span className={`w-2 h-2 rounded-full transition-all ${isActive ? 'scale-125' : 'opacity-40 group-hover:opacity-100 group-hover:scale-110'}`}
                  style={{ backgroundColor: accent.dot }} />
                <span className={`truncate transition-colors ${isActive ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-700'}`}>
                  {sec.label}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Roadmap Timeline ── */}
      <main className="flex-1 min-w-0 relative">
        {/* Vertical spine */}
        <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-slate-200 hidden md:block" style={{ zIndex: 0 }} />

        <div className="flex flex-col gap-6">
          {sections.map((sec, sIdx) => {
            const accent = SECTION_ACCENTS[sIdx % SECTION_ACCENTS.length];
            return (
              <div key={sec.id} id={`section-${sec.id}`} className="relative flex gap-4 md:gap-6 items-start group/section">

                {/* ── Milestone dot on the spine ── */}
                <div className="hidden md:flex flex-col items-center flex-shrink-0 z-10 pt-4" style={{ width: 24 }}>
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 transition-transform group-hover/section:scale-125 duration-300 ring-4 ring-[#f8f9fa]"
                    style={{ backgroundColor: accent.dot }}
                  />
                </div>

                {/* ── Section card ── */}
                <div className="flex-1 min-w-0">
                  {/* Clean white section container */}
                  <div className="bg-white rounded-[1.5rem] border border-slate-200/60 shadow-sm p-5 md:p-6 transition-all duration-300 hover:shadow-md hover:border-slate-300/60">
                    
                    {/* Section header minimal */}
                    <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => scrollToSection(sec.id)}>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-black" style={{ color: accent.dot }}>{sIdx + 1}.</span>
                        <h2 className="font-black text-slate-800 text-lg tracking-tight">{sec.label}</h2>
                      </div>
                    </div>

                    {/* Topics area */}
                    {sec.topics.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                        {sec.topics.map((topic) => (
                          <button
                            key={topic.id}
                            onClick={() => setSelectedTopic({ label: topic.label, description: topic.description })}
                            className="text-left bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm rounded-xl px-3.5 py-3 text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-all duration-200 hover:-translate-y-0.5 leading-tight group/topic"
                          >
                            <span className="line-clamp-2">{topic.label}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-400 text-sm italic">
                        Overview section — sets the foundation for everything below
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Road End */}
          <div className="flex items-center gap-4 md:gap-6 mt-4">
            <div className="hidden md:flex items-center justify-center flex-shrink-0" style={{ width: 24 }}>
              <div className="w-4 h-4 rounded-full bg-slate-300 ring-4 ring-[#f8f9fa]" />
            </div>
            <div className="flex-1 py-4 text-slate-400 font-bold text-sm">
              You've reached the end! · {sections.reduce((a, s) => a + s.topics.length, 0)} topics total
            </div>
          </div>
        </div>
      </main>

      {/* Mobile how-to button */}
      <button onClick={() => setShowHowTo(true)}
        className="fixed bottom-6 right-6 md:hidden w-12 h-12 rounded-full bg-slate-800 text-white shadow-xl flex items-center justify-center text-lg font-black hover:bg-slate-700 z-30 animate-bounce"
        aria-label="How to use">i</button>

      {showHowTo && <HowToModal onClose={() => setShowHowTo(false)} />}
      {selectedTopic && <InfoModal topic={selectedTopic} onClose={() => setSelectedTopic(null)} />}
    </div>
  );
}
