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

// ─── Info Drawer ──────────────────────────────────────────────────────────────
function InfoDrawer({ topic, onClose }: { topic: { label: string; description?: string } | null; onClose: () => void }) {
  if (!topic) return null;
  const note = topic.description || getTopicNote(topic.label);
  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[340px] max-w-[92vw] bg-white border-l border-slate-200 z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="bg-[#1e293b] px-5 py-4 flex items-start justify-between flex-shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Topic Notes</p>
            <h3 className="font-black text-white text-base leading-tight">{topic.label}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 mt-0.5 ml-3" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" /> How to Learn
            </p>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">{note}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Quick Tips
            </p>
            <ul className="flex flex-col gap-2">
              {['Find 1 dedicated resource and finish it completely', 'Build something real with this skill', 'Explain it to someone else to solidify understanding', 'Review and track weekly progress'].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-emerald-500 font-black mt-0.5 flex-shrink-0">→</span>{tip}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" /> Find Resources
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'YouTube', url: `https://youtube.com/results?search_query=${encodeURIComponent(topic.label + ' tutorial')}`, color: '#ef4444' },
                { label: 'Google', url: `https://google.com/search?q=${encodeURIComponent('how to learn ' + topic.label)}`, color: '#3b82f6' },
                { label: 'Coursera', url: `https://coursera.org/search?query=${encodeURIComponent(topic.label)}`, color: '#0056d2' },
              ].map((r) => (
                <a key={r.label} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-colors">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                  Search on {r.label} →
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">Click any other topic to switch notes</div>
      </div>
    </>
  );
}

// ─── How To Use Modal ─────────────────────────────────────────────────────────
function HowToModal({ onClose }: { onClose: () => void }) {
  const steps = [
    { icon: '🛣️', title: 'Follow the Path', desc: 'The roadmap flows top → bottom. Each stop on the left timeline is a major skill area. Work through them in order for the best learning outcome.' },
    { icon: '🧭', title: 'Jump via Sidebar', desc: 'The numbered list on the left sidebar shows all major sections. Click any number to jump directly to that section on the page.' },
    { icon: '📝', title: 'Click Topics for Notes', desc: 'Every topic chip is clickable. A panel slides in with a curated "How to Learn" guide, quick tips, and direct links to YouTube, Google & Coursera.' },
    { icon: '📚', title: 'Go Deep, Not Wide', desc: 'Aim to truly understand each section before moving on. One well-learned section beats five half-understood ones.' },
    { icon: '✅', title: 'Track Progress', desc: 'Screenshot or print the roadmap. Cross off completed topics. Revisit this guide every 3 months to catch new skills.' },
  ];
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto pointer-events-auto ${balsamiq.className}`}>
          <div className="bg-[#1e293b] rounded-t-3xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Career Guides</p>
                <h2 className="text-xl font-black text-white">How to Use This Roadmap</h2>
                <p className="text-slate-400 text-xs mt-1">Get the most out of your learning journey</p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white p-1 mt-1" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          </div>
          <div className="p-5 flex flex-col gap-3">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xl flex-shrink-0">{step.icon}</span>
                <div>
                  <h3 className="font-black text-slate-800 text-sm mb-0.5">{step.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 pb-6">
            <button onClick={onClose} className="w-full bg-[#1e293b] hover:bg-slate-700 text-white font-bold py-3.5 rounded-2xl transition-colors text-sm">
              Got it, start learning →
            </button>
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
      <aside className="hidden md:flex flex-col w-48 shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-[#1c1c1e] px-4 py-3 flex items-center justify-between shrink-0">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#86868b]">Sections</span>
          <button onClick={() => setShowHowTo(true)}
            className="w-5 h-5 rounded-full bg-white/10 border border-white/10 text-[#86868b] hover:text-white hover:bg-white/20 transition-colors text-[10px] font-black flex items-center justify-center"
            title="How to use this roadmap">i</button>
        </div>
        <div className="overflow-y-auto flex-1 py-1.5">
          {sections.map((sec, i) => {
            const accent = SECTION_ACCENTS[i % SECTION_ACCENTS.length];
            return (
              <button key={sec.id} onClick={() => scrollToSection(sec.id)}
                className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-all text-[11px] font-bold group
                  ${activeSection === sec.id ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                <span className="w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-black text-white flex-shrink-0 transition-all"
                  style={{ backgroundColor: activeSection === sec.id ? accent.dot : '#94a3b8' }}>
                  {i + 1}
                </span>
                <span className={`truncate transition-colors ${activeSection === sec.id ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-700'}`}>
                  {sec.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="px-3 py-2 border-t border-slate-100 text-[9px] text-slate-400 shrink-0">
          Click any topic for notes
        </div>
      </aside>

      {/* ── Roadmap Timeline ── */}
      <main className="flex-1 min-w-0 relative">
        {/* Vertical spine */}
        <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-teal-400 opacity-30 hidden md:block" style={{ zIndex: 0 }} />

        <div className="flex flex-col gap-0">
          {sections.map((sec, sIdx) => {
            const accent = SECTION_ACCENTS[sIdx % SECTION_ACCENTS.length];
            return (
              <div key={sec.id} id={`section-${sec.id}`} className="relative flex gap-4 md:gap-5 items-start group/section pb-1">

                {/* ── Milestone dot on the spine ── */}
                <div className="hidden md:flex flex-col items-center flex-shrink-0 z-10" style={{ width: 40 }}>
                  {/* Connector line above (except first) */}
                  {sIdx > 0 && (
                    <div className="w-0.5 flex-1" style={{ minHeight: 20, backgroundColor: accent.dot, opacity: 0.25 }} />
                  )}
                  {/* Milestone circle */}
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg flex-shrink-0 transition-transform group-hover/section:scale-110 duration-200"
                    style={{ backgroundColor: accent.dot, boxShadow: `0 0 0 4px ${accent.dot}22, 0 4px 16px ${accent.dot}44` }}
                  >
                    {sIdx + 1}
                  </div>
                  {/* Connector line below (except last) */}
                  {sIdx < sections.length - 1 && (
                    <div className="w-0.5 mt-1" style={{ height: 32, backgroundColor: accent.dot, opacity: 0.2 }} />
                  )}
                </div>

                {/* ── Section card ── */}
                <div className="flex-1 min-w-0 pb-6">
                  {/* Section header */}
                  <div
                    className="flex items-center justify-between px-5 py-3.5 rounded-t-2xl cursor-pointer select-none"
                    style={{ backgroundColor: accent.bg, borderLeft: `3px solid ${accent.dot}` }}
                    onClick={() => scrollToSection(sec.id)}
                  >
                    <h2 className="font-black text-white text-[15px] tracking-tight">{sec.label}</h2>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${accent.tag}`}>
                      {sec.topics.length} topics
                    </span>
                  </div>

                  {/* Topics area */}
                  {sec.topics.length > 0 ? (
                    <div
                      className="rounded-b-2xl border border-t-0 p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2"
                      style={{ borderColor: `${accent.dot}30`, backgroundColor: `${accent.dot}06` }}
                    >
                      {sec.topics.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => setSelectedTopic({ label: topic.label, description: topic.description })}
                          className="text-center bg-white hover:shadow-md border border-slate-200 rounded-xl px-3 py-2.5 text-[12px] font-semibold text-slate-700 transition-all duration-150 leading-tight group/topic relative"
                          style={{ borderLeftWidth: '2px', borderLeftColor: `${accent.dot}60` }}
                          title={`Click to learn about: ${topic.label}`}
                        >
                          {topic.label}
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full opacity-0 group-hover/topic:opacity-100 transition-opacity flex items-center justify-center text-white text-[7px] font-black"
                            style={{ backgroundColor: accent.dot }}>i</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-b-2xl border border-t-0 border-slate-100 px-5 py-3 text-slate-400 text-xs italic">
                      Overview section — sets the foundation for everything below
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Road End */}
          <div className="flex items-center gap-4 md:gap-5 mt-2">
            <div className="hidden md:flex items-center justify-center flex-shrink-0" style={{ width: 40 }}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <span className="text-lg">🏁</span>
              </div>
            </div>
            <div className="flex-1 py-4 text-slate-500 font-bold text-sm">
              You've reached the end of the roadmap! · {sections.length} sections · {sections.reduce((a, s) => a + s.topics.length, 0)} topics completed
            </div>
          </div>
        </div>
      </main>

      {/* Mobile how-to button */}
      <button onClick={() => setShowHowTo(true)}
        className="fixed bottom-6 right-6 md:hidden w-12 h-12 rounded-full bg-slate-800 text-white shadow-xl flex items-center justify-center text-lg font-black hover:bg-slate-700 z-30"
        aria-label="How to use">i</button>

      {showHowTo && <HowToModal onClose={() => setShowHowTo(false)} />}
      {selectedTopic && <InfoDrawer topic={selectedTopic} onClose={() => setSelectedTopic(null)} />}
    </div>
  );
}
