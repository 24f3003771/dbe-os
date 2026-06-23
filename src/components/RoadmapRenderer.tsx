"use client";

import React, { useMemo, useState, useCallback } from 'react';
import { Balsamiq_Sans } from 'next/font/google';

const balsamiq = Balsamiq_Sans({ weight: ['400', '700'], subsets: ['latin'] });

// ─── Topic Notes Database ─────────────────────────────────────────────────────
const TOPIC_NOTES: Record<string, string> = {
  'html': 'Learn semantic HTML5 tags, forms, accessibility (ARIA), and proper document structure. Practice building static pages from scratch.',
  'css': 'Master the box model, flexbox, CSS grid, media queries, and CSS variables. Build responsive layouts without frameworks first.',
  'javascript': 'Learn ES6+ fundamentals: variables, functions, async/await, fetch API, DOM manipulation. Build 5+ small projects.',
  'react': 'Understand components, props, state, hooks (useState, useEffect, useContext). Build a full CRUD app.',
  'node.js': 'Learn HTTP servers, Express.js, middleware, REST APIs, and connecting to databases. Deploy a simple API.',
  'income statement': 'Learn the structure: Revenue → Gross Profit → EBITDA → Net Income. Practice reading real 10-K filings from public companies.',
  'balance sheet': 'Understand Assets = Liabilities + Equity. Learn current vs. non-current items. Read Apple or Microsoft balance sheets.',
  'cash flow statement': 'Focus on Operating, Investing, and Financing activities. Understand why net income ≠ cash flow.',
  'dcf analysis': 'Project free cash flows for 5-10 years, calculate terminal value, discount back at WACC. Build one from scratch in Excel.',
  'lbo': 'Build a sources & uses table, model the debt schedule, and calculate IRR and cash-on-cash returns in Excel.',
  'market sizing': 'Practice TAM/SAM/SOM estimation. Use both top-down and bottom-up approaches. Time yourself: 5 minutes per case.',
  'case interview': 'Practice 50+ cases using McKinsey, BCG, and Bain frameworks. Record yourself and review. Join a case partner program.',
  'python': 'Start with basic syntax, then learn pandas for data manipulation, matplotlib for charts, and write scripts to automate real tasks.',
  'sql': 'Practice SELECT, JOINs, GROUP BY, window functions, and CTEs. Solve 30+ problems on LeetCode or StrataScratch.',
  'excel': 'Master VLOOKUP, INDEX-MATCH, SUMIFS, pivot tables, and Power Query. Build a financial model template from scratch.',
  'pitch deck': 'Study the top 10 VC pitch decks (Airbnb, Uber, Buffer). Cover Problem → Solution → Market → Business Model → Team → Ask.',
  'user interview': 'Prepare 5 open-ended questions. Ask "why" 5 times. Record interviews and synthesize patterns across 10+ interviews.',
  'a/b testing': 'Define a clear hypothesis, pick one variable to change, calculate sample size for statistical significance, then run the test.',
  'seo': 'Start with keyword research (Ahrefs/SEMrush), optimize title tags & meta descriptions, build internal links, and track rankings weekly.',
  'financial modeling': 'Build a 3-statement model (Income Statement → Balance Sheet → Cash Flow) that automatically links and balances.',
  'valuation': 'Learn 3 core methods: Comparable Companies, Precedent Transactions, and DCF. Always triangulate between all three.',
  'kubernetes': 'Start with pods and deployments, then learn services and ingress. Use Minikube locally before touching a real cluster.',
  'docker': 'Write a Dockerfile, build an image, run a container, then learn Docker Compose for multi-service apps.',
  'typescript': 'Add TypeScript to an existing JavaScript project. Focus on types, interfaces, and generics before diving into advanced utility types.',
  'git': 'Learn the core workflow: init → add → commit → push. Master branching and learn how to resolve merge conflicts.',
};

function getTopicNote(label: string): string {
  const lower = label.toLowerCase();
  for (const [key, note] of Object.entries(TOPIC_NOTES)) {
    if (lower.includes(key)) return note;
  }
  return `Learn "${label}" through structured study. Find 1–2 high-quality resources (a book or course), build something real with it, then apply it in a project context.`;
}

// ─── Parse nodes into clean sections ─────────────────────────────────────────
interface Section {
  id: string;
  label: string;
  topics: { id: string; label: string; description?: string }[];
}

function parseRoadmapIntoSections(nodesData: any[]): Section[] {
  const USELESS_TYPES = ['paragraph', 'button', 'legend', 'linksgroup', 'vertical', 'horizontal'];
  const filtered = nodesData.filter((n) => !USELESS_TYPES.includes(n.type));

  // Section nodes: type === 'title' or nodes with isSection: true
  const sections: Section[] = [];
  const sectionNodes = filtered.filter(
    (n) => n.type === 'title' || (n.type === 'topic' && n.data?.isSection)
  );

  // Sort sections by vertical position (y)
  sectionNodes.sort((a, b) => (a.position?.y ?? 0) - (b.position?.y ?? 0));

  // Topic nodes (not sections, not labels)
  const topicNodes = filtered.filter(
    (n) => (n.type === 'topic' || n.type === 'subtopic' || n.type === 'todo') && !n.data?.isSection
  );

  // Assign topics to the nearest section above them
  for (const sec of sectionNodes) {
    const secY = sec.position?.y ?? 0;

    // Topics that belong to this section: those whose y is greater than this section's y
    // but less than the next section's y
    const nextSecIdx = sectionNodes.indexOf(sec) + 1;
    const nextSecY = nextSecIdx < sectionNodes.length ? (sectionNodes[nextSecIdx].position?.y ?? Infinity) : Infinity;

    const myTopics = topicNodes
      .filter((t) => {
        const ty = t.position?.y ?? 0;
        return ty > secY && ty < nextSecY;
      })
      .sort((a, b) => {
        // Sort by x position so they appear left-to-right
        const ax = a.position?.x ?? 0;
        const bx = b.position?.x ?? 0;
        // Then by y for multi-row layouts
        const ay = a.position?.y ?? 0;
        const by = b.position?.y ?? 0;
        return ay !== by ? ay - by : ax - bx;
      })
      .map((t) => ({
        id: t.id,
        label: t.data?.label || t.label || '',
        description: t.data?.description,
      }));

    sections.push({
      id: sec.id,
      label: sec.data?.label || sec.label || '',
      topics: myTopics,
    });
  }

  return sections.filter((s) => s.label.length > 0);
}

// ─── Info Drawer ──────────────────────────────────────────────────────────────
function InfoDrawer({
  topic,
  onClose,
}: {
  topic: { label: string; description?: string } | null;
  onClose: () => void;
}) {
  if (!topic) return null;
  const note = topic.description || getTopicNote(topic.label);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[340px] max-w-[90vw] bg-white border-l border-slate-200 z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-[#1e293b] px-5 py-4 flex items-start justify-between flex-shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Topic Notes</p>
            <h3 className="font-black text-white text-base leading-tight">{topic.label}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors mt-0.5 ml-3 flex-shrink-0 p-1"
            aria-label="Close notes"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
              </span>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">How to Learn</h4>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">{note}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Quick Tips</h4>
            </div>
            <ul className="flex flex-col gap-2">
              {[
                'Find 1 dedicated resource (book/course) and finish it',
                'Build something real using this skill',
                'Explain the concept to someone else',
                'Review weekly and track your progress',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-emerald-500 font-black mt-0.5">↗</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </span>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Find Resources</h4>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: 'YouTube', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic.label + ' tutorial')}`, color: '#ef4444' },
                { label: 'Google', url: `https://www.google.com/search?q=${encodeURIComponent('how to learn ' + topic.label)}`, color: '#3b82f6' },
                { label: 'Coursera', url: `https://www.coursera.org/search?query=${encodeURIComponent(topic.label)}`, color: '#0056d2' },
              ].map((r) => (
                <a key={r.label} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                  Search on {r.label} →
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 text-center flex-shrink-0">
          <p className="text-[10px] text-slate-400 font-medium">Click any other topic to switch notes</p>
        </div>
      </div>
    </>
  );
}

// ─── How To Use Modal ─────────────────────────────────────────────────────────
function HowToUseModal({ onClose }: { onClose: () => void }) {
  const steps = [
    { icon: '🧭', title: 'Use the Section Navigator', desc: 'The numbered list on the left shows all major sections of this roadmap. Click any section to jump directly to it on the page.' },
    { icon: '📝', title: 'Click Topics for Notes', desc: 'Every topic box is clickable. When you click one, a panel slides in with a "How to Learn" guide, quick tips, and direct links to YouTube, Google, and Coursera.' },
    { icon: '📚', title: 'Follow the Order', desc: 'Sections flow top-to-bottom in the recommended learning order. Aim to complete one section before moving to the next.' },
    { icon: '🔗', title: 'Use the Resource Links', desc: 'Each topic has direct search links. Use YouTube for concept videos, Google for written guides, and Coursera for structured courses.' },
    { icon: '✅', title: 'Track Your Progress', desc: 'Print or screenshot the roadmap. Cross off completed topics. Aim for depth over breadth — one done topic beats 10 half-learned ones.' },
    { icon: '🔄', title: 'Revisit Regularly', desc: 'Career roadmaps evolve. Revisit this guide every 3 months to discover new skills or refresh forgotten fundamentals.' },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto ${balsamiq.className}`}>
          {/* Modal Header */}
          <div className="bg-[#1e293b] rounded-t-3xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Career Guides</p>
                <h2 className="text-2xl font-black text-white">How to Use This Roadmap</h2>
                <p className="text-slate-400 text-sm mt-1">Get the most out of your learning journey</p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 mt-1" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Steps */}
          <div className="p-6 flex flex-col gap-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-2xl flex-shrink-0 mt-0.5">{step.icon}</span>
                <div>
                  <h3 className="font-black text-slate-800 text-sm mb-1">{step.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className="w-full bg-[#1e293b] hover:bg-slate-700 text-white font-bold py-3.5 rounded-2xl transition-colors text-sm"
            >
              Got it, let's go! →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Renderer ────────────────────────────────────────────────────────────
export default function RoadmapRenderer({
  nodesData,
  edgesData = [],
  title,
}: {
  nodesData: any[];
  edgesData?: any[];
  title?: string;
}) {
  const [selectedTopic, setSelectedTopic] = useState<{ label: string; description?: string } | null>(null);
  const [showHowTo, setShowHowTo] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = useMemo(() => parseRoadmapIntoSections(nodesData), [nodesData]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  }, []);

  const handleTopicClick = useCallback((label: string, description?: string) => {
    setSelectedTopic({ label, description });
  }, []);

  if (sections.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <p className="font-bold">No sections found in this roadmap.</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col md:flex-row relative ${balsamiq.className}`}>

      {/* ── Sticky Sidebar Navigator ── */}
      <aside className="hidden md:flex flex-col w-52 shrink-0 sticky top-4 self-start max-h-[calc(100vh-6rem)] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
        {/* Sidebar Header */}
        <div className="bg-[#1c1c1e] px-4 py-3 flex items-center justify-between shrink-0">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">Sections</h3>
          <button
            onClick={() => setShowHowTo(true)}
            className="w-5 h-5 rounded-full bg-[#2d2d2f] border border-[#3d3d3f] flex items-center justify-center text-[#86868b] hover:text-white hover:bg-[#3d3d3f] transition-colors text-[10px] font-black"
            title="How to use this roadmap"
            aria-label="How to use"
          >
            i
          </button>
        </div>
        {/* Section List */}
        <div className="overflow-y-auto flex-1 py-2">
          {sections.map((sec, i) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors text-[11px] font-bold truncate group
                ${activeSection === sec.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              <span className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 text-[9px] font-black transition-colors
                ${activeSection === sec.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                {i + 1}
              </span>
              <span className="truncate">{sec.label}</span>
            </button>
          ))}
        </div>
        <div className="px-3 py-2.5 border-t border-slate-100 text-[10px] text-slate-400 shrink-0">
          Click topics for notes
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 md:pl-6 flex flex-col gap-0">
        {sections.map((sec, sIdx) => (
          <div
            key={sec.id}
            id={`section-${sec.id}`}
            className="relative"
          >
            {/* Vertical connector line between sections */}
            {sIdx > 0 && (
              <div className="flex justify-center mb-0">
                <div className="w-0.5 h-8 bg-gradient-to-b from-slate-200 to-slate-300" />
              </div>
            )}

            {/* Section Card */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Section Header */}
              <div className="bg-[#1e293b] px-5 py-4 flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-[11px] font-black text-white/60 flex-shrink-0">
                  {sIdx + 1}
                </span>
                <h2 className="font-black text-white text-base">{sec.label}</h2>
                <span className="ml-auto text-[10px] text-white/40 font-bold">{sec.topics.length} topics</span>
              </div>

              {/* Topics Grid */}
              {sec.topics.length > 0 ? (
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {sec.topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicClick(topic.label, topic.description)}
                      className="text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl px-3 py-2.5 text-[12px] font-semibold text-slate-700 hover:text-indigo-700 transition-all duration-150 hover:shadow-sm text-center leading-tight"
                      title={`Click to learn about: ${topic.label}`}
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-slate-400 text-sm text-center">No topics in this section</div>
              )}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="mt-8 text-center text-slate-400 text-xs font-medium pb-4">
          {sections.length} sections · {sections.reduce((a, s) => a + s.topics.length, 0)} topics total
        </div>
      </main>

      {/* ── How To Button (Mobile) ── */}
      <button
        onClick={() => setShowHowTo(true)}
        className="fixed bottom-6 right-6 md:hidden w-12 h-12 rounded-full bg-[#1e293b] text-white shadow-xl flex items-center justify-center text-lg font-black hover:bg-slate-700 transition-colors z-30"
        aria-label="How to use this roadmap"
        title="How to use this roadmap"
      >
        i
      </button>

      {/* ── How To Use Modal ── */}
      {showHowTo && <HowToUseModal onClose={() => setShowHowTo(false)} />}

      {/* ── Topic Notes Drawer ── */}
      {selectedTopic && <InfoDrawer topic={selectedTopic} onClose={() => setSelectedTopic(null)} />}
    </div>
  );
}
