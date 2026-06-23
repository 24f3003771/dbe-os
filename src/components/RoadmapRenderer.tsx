"use client";

import React, { useMemo, useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  NodeProps,
  Handle,
  Position,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Balsamiq_Sans } from 'next/font/google';

const balsamiq = Balsamiq_Sans({ weight: ['400', '700'], subsets: ['latin'] });

// ─── Topic Notes Database ─────────────────────────────────────────────────────
// A curated library of short "what to do" notes for common roadmap topics.
// The renderer does a loose match so partial labels also match.
const TOPIC_NOTES: Record<string, string> = {
  // Engineering
  'html': 'Learn semantic HTML5 tags, forms, accessibility (ARIA), and proper document structure. Practice building static pages from scratch.',
  'css': 'Master the box model, flexbox, CSS grid, media queries, and CSS variables. Build responsive layouts without frameworks first.',
  'javascript': 'Learn ES6+ fundamentals: variables, functions, async/await, fetch API, DOM manipulation. Build 5+ small projects.',
  'react': 'Understand components, props, state, hooks (useState, useEffect, useContext). Build a full CRUD app.',
  'node.js': 'Learn HTTP servers, Express.js, middleware, REST APIs, and connecting to databases. Deploy a simple API.',
  // Business
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
  'user interview': 'Prepare 5 open-ended questions. Ask "why" 5 times (5 Whys technique). Record interviews (with permission) and synthesize patterns.',
  'a/b testing': 'Define a clear hypothesis, pick one variable to change, calculate the sample size needed for statistical significance, run the test.',
  'seo': 'Start with keyword research (Ahrefs/SEMrush), optimize title tags & meta descriptions, build internal links, and track rankings weekly.',
  'networking': 'Set a goal of 3 coffee chats per week. Use LinkedIn to reach out with personalized messages. Give before you ask.',
  'financial modeling': 'Build a 3-statement model (Income Statement → Balance Sheet → Cash Flow) that automatically links and balances.',
  'valuation': 'Learn 3 core methods: Comparable Companies, Precedent Transactions, and DCF. Always triangulate between all three.',
  // Default
  'default': 'Deep dive into this topic using a combination of online courses (Coursera, YouTube), books, and hands-on practice projects. Track your progress weekly.'
};

function getTopicNote(label: string): string {
  const lower = label.toLowerCase();
  for (const [key, note] of Object.entries(TOPIC_NOTES)) {
    if (lower.includes(key.toLowerCase())) return note;
  }
  return `Learn the fundamentals of "${label}" through structured study. Find 1-2 high-quality resources (a book or course), build something with it, and apply it in a real context.`;
}

// ─── Node Components ──────────────────────────────────────────────────────────

// Section Header Node (our custom roadmaps use 'topic' type for sections)
const TopicNode = ({ data, id }: NodeProps) => {
  const isSectionHeader = (data as any).isSection;
  const borderColor = (data as any).borderColor || (isSectionHeader ? '#1e293b' : '#cbd5e1');
  const bgColor = isSectionHeader ? '#1e293b' : '#ffffff';
  const textColor = isSectionHeader ? '#f8fafc' : '#1e293b';

  return (
    <div
      style={{
        borderWidth: isSectionHeader ? '0px' : '1.5px',
        borderColor,
        borderStyle: 'solid',
        borderRadius: isSectionHeader ? '12px' : '8px',
        padding: isSectionHeader ? '12px 20px' : '8px 14px',
        fontWeight: isSectionHeader ? 800 : 600,
        fontSize: isSectionHeader ? '15px' : '13px',
        backgroundColor: bgColor,
        color: textColor,
        boxShadow: isSectionHeader
          ? '0 4px 20px -4px rgba(30,41,59,0.35)'
          : '0 1px 4px rgba(0,0,0,0.06)',
        letterSpacing: isSectionHeader ? '0.01em' : '0',
      }}
      className="flex items-center justify-center w-full h-full text-center cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
      title={`Click to learn more about: ${data.label}`}
    >
      {data.label as React.ReactNode}
      <Handle type="source" position={Position.Bottom} className="opacity-0 !w-0 !h-0" />
      <Handle type="target" position={Position.Top} className="opacity-0 !w-0 !h-0" />
      <Handle type="source" position={Position.Right} className="opacity-0 !w-0 !h-0" id="right" />
      <Handle type="target" position={Position.Left} className="opacity-0 !w-0 !h-0" id="left" />
    </div>
  );
};

const SubtopicNode = ({ data }: NodeProps) => (
  <div
    style={{
      borderWidth: '1.5px',
      borderColor: '#e2e8f0',
      borderStyle: 'solid',
      borderRadius: '8px',
      padding: '8px 14px',
      fontSize: '12px',
      fontWeight: 500,
      color: '#475569',
      backgroundColor: '#f8fafc',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}
    className="flex items-center justify-center w-full h-full text-center cursor-pointer transition-all hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700"
    title={`Click to learn more about: ${data.label}`}
  >
    {data.label as React.ReactNode}
  </div>
);

const TitleNode = ({ data }: NodeProps) => (
  <div
    style={{ fontWeight: 900, fontSize: '34px', letterSpacing: '-0.025em', color: '#0f172a' }}
    className="flex items-center justify-center w-full h-full text-center"
  >
    {data.label as React.ReactNode}
  </div>
);

const VerticalNode = ({ data }: NodeProps) => {
  const s = (data as any).style || {};
  const stroke = s.stroke || '#3b82f6';
  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none">
      <div style={{ width: s.strokeWidth || '3px', height: '100%', backgroundColor: stroke, opacity: 0.6 }} />
    </div>
  );
};

const HorizontalNode = ({ data }: NodeProps) => {
  const s = (data as any).style || {};
  const stroke = s.stroke || '#3b82f6';
  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none">
      <div style={{ height: s.strokeWidth || '3px', width: '100%', backgroundColor: stroke, opacity: 0.6 }} />
    </div>
  );
};

const LabelNode = ({ data }: NodeProps) => (
  <div
    style={{ color: (data as any).color || '#94a3b8', fontSize: (data as any).style?.fontSize || 13 }}
    className="font-semibold whitespace-nowrap text-center tracking-wide pointer-events-none"
  >
    {data.label as React.ReactNode}
  </div>
);

const nodeTypes = {
  horizontal: HorizontalNode,
  vertical: VerticalNode,
  title: TitleNode,
  topic: TopicNode,
  subtopic: SubtopicNode,
  todo: TopicNode,
  label: LabelNode,
};

// ─── Info Panel ──────────────────────────────────────────────────────────────
function InfoPanel({ topic, onClose }: { topic: { label: string, description?: string } | null, onClose: () => void }) {
  if (!topic) return null;
  const note = topic.description || getTopicNote(topic.label);

  return (
    <div
      className={`absolute top-0 right-0 h-full w-80 bg-white border-l border-slate-200 z-20 shadow-2xl flex flex-col transition-transform duration-300 ease-out`}
      style={{ transform: topic ? 'translateX(0)' : 'translateX(100%)' }}
    >
      {/* Panel Header */}
      <div className="bg-[#1e293b] px-5 py-4 flex items-start justify-between flex-shrink-0">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Topic Notes</p>
          <h3 className="font-black text-white text-base leading-tight">{topic.label}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors mt-0.5 ml-3 flex-shrink-0"
          aria-label="Close notes panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
        {/* What to Learn */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            </span>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">How to Learn</h4>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">{note}</p>
        </div>

        {/* Resources */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
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

        {/* Search Resources */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Find Resources</h4>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: 'YouTube', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic.label + ' tutorial')}`, color: '#ef4444' },
              { label: 'Google', url: `https://www.google.com/search?q=${encodeURIComponent('how to learn ' + topic.label)}`, color: '#3b82f6' },
              { label: 'Coursera', url: `https://www.coursera.org/search?query=${encodeURIComponent(topic.label)}`, color: '#0056d2' },
            ].map((r) => (
              <a
                key={r.label}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700"
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                Search on {r.label} →
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Close Hint */}
      <div className="p-4 border-t border-slate-100 text-center flex-shrink-0">
        <p className="text-[10px] text-slate-400 font-medium">Click any other topic to switch notes</p>
      </div>
    </div>
  );
}

// ─── Main Canvas ──────────────────────────────────────────────────────────────
function RoadmapCanvas({ nodes, edges, title, rawNodes }: { nodes: any[], edges: any[], title?: string, rawNodes: any[] }) {
  const { setCenter, fitView, zoomIn, zoomOut } = useReactFlow();
  const [selectedTopic, setSelectedTopic] = useState<{ label: string, description?: string } | null>(null);

  // Only show section-level nodes in navigator (title nodes + our section headers = nodes with dark styling or type=title)
  const navSections = useMemo(() => {
    return rawNodes.filter((n: any) =>
      n.type === 'title' ||
      (n.type === 'topic' && (n.data?.isSection || n.data?.style?.borderWidth === '3px'))
    ).slice(0, 40);
  }, [rawNodes]);

  const jumpToNode = useCallback((node: any) => {
    const width = node.measured?.width || node.width || 200;
    const height = node.measured?.height || node.height || 60;
    setCenter(node.position.x + width / 2, node.position.y + height / 2, { zoom: 1.1, duration: 700 });
  }, [setCenter]);

  // Handle node clicks for info panel
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.type === 'title' || node.type === 'vertical' || node.type === 'horizontal' || node.type === 'label') return;
    const label = (node.data as any).label as string;
    const description = (node.data as any).description;
    setSelectedTopic({ label, description });
  }, []);

  return (
    <div className={`w-full h-full min-h-[85vh] bg-slate-50 rounded-[1.5rem] overflow-hidden shadow-2xl border border-slate-200 flex flex-col md:flex-row ${balsamiq.className}`}>

      {/* ── Navigator Sidebar ── */}
      <div className="w-full md:w-56 bg-white border-b md:border-b-0 md:border-r border-slate-100 flex flex-col z-10 shrink-0">
        {/* Sidebar Header — matches dark Mac header */}
        <div className="h-10 border-b border-[#2d2d2f] flex items-center justify-between bg-[#1c1c1e] px-4 shrink-0">
          <h3 className="font-bold text-[10px] uppercase tracking-widest text-[#86868b]">Sections</h3>
          <div className="flex gap-1 text-[#86868b]">
            <button onClick={() => zoomIn({ duration: 300 })} className="p-1 hover:bg-[#2d2d2f] hover:text-white rounded transition-colors" title="Zoom In" aria-label="Zoom In">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </button>
            <button onClick={() => zoomOut({ duration: 300 })} className="p-1 hover:bg-[#2d2d2f] hover:text-white rounded transition-colors" title="Zoom Out" aria-label="Zoom Out">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </button>
            <button onClick={() => fitView({ duration: 500, maxZoom: 1 })} className="p-1 hover:bg-[#2d2d2f] hover:text-white rounded transition-colors" title="Fit View" aria-label="Fit to View">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
            </button>
          </div>
        </div>

        {/* Section List */}
        <div className="overflow-y-auto flex-1 flex flex-col py-2">
          {navSections.length === 0 ? (
            <p className="text-xs text-slate-400 text-center p-4">Use zoom controls above to navigate</p>
          ) : (
            navSections.map((n: any, i: number) => (
              <button
                key={n.id}
                onClick={() => jumpToNode(n)}
                className="text-left text-[12px] font-bold px-4 py-2.5 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 transition-colors truncate flex items-center gap-2.5 group"
              >
                <span className="w-5 h-5 rounded-md bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center flex-shrink-0 text-[10px] font-black text-slate-500 group-hover:text-indigo-600 transition-colors">
                  {i + 1}
                </span>
                <span className="truncate">{n.data?.label || n.label}</span>
              </button>
            ))
          )}
        </div>

        {/* Help hint */}
        <div className="px-4 py-3 border-t border-slate-100 flex-shrink-0">
          <p className="text-[10px] text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-500">Tip:</span> Click any topic box on the map to see notes
          </p>
        </div>
      </div>

      {/* ── Main Canvas Column ── */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        {/* Mac OS Header */}
        <div className="h-10 bg-[#1c1c1e] border-b border-[#2d2d2f] w-full flex items-center px-4 relative z-10 shrink-0">
          <div className="flex gap-1.5 absolute left-4">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="w-full text-center text-[#86868b] text-[10px] font-mono tracking-widest uppercase truncate px-20">
            {title ? `${title.toUpperCase().replace(/-/g, '_')}.NOTES` : 'ROADMAP.VIEW'}
          </div>
        </div>

        {/* React Flow Canvas + Info Panel (overlapping) */}
        <div className="flex-1 relative overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ maxZoom: 1 }}
            minZoom={0.08}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#e2e8f0" gap={24} size={1} />
          </ReactFlow>

          {/* Info Panel slides over canvas */}
          {selectedTopic && (
            <InfoPanel topic={selectedTopic} onClose={() => setSelectedTopic(null)} />
          )}

          {/* Click hint badge (fades away) */}
          {!selectedTopic && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-800/80 backdrop-blur-sm text-white text-[11px] font-semibold px-4 py-2 rounded-full pointer-events-none shadow-lg">
              👆 Click any topic to see notes & resources
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Root Renderer ────────────────────────────────────────────────────────────
export default function RoadmapRenderer({ nodesData, edgesData = [], title }: { nodesData: any[], edgesData?: any[], title?: string }) {
  const USELESS_TYPES = ['paragraph', 'button', 'legend', 'linksgroup'];

  const nodes = useMemo(() => {
    return nodesData
      .filter((n: any) => !USELESS_TYPES.includes(n.type))
      .map((n: any) => {
        const safeLabel = n.data?.label || n.label || '';
        const nodeStyle = { ...n.style, width: n.width, height: n.height };
        return {
          ...n,
          draggable: false,
          style: nodeStyle,
          position: n.position || { x: 0, y: 0 },
          type: nodeTypes[n.type as keyof typeof nodeTypes] ? n.type : 'default',
          data: { ...n.data, label: safeLabel },
        };
      });
  }, [nodesData]);

  const edges = useMemo(() => {
    return edgesData.map((e: any) => {
      const edgeStroke = e.style?.stroke || '#94a3b8';
      const { sourceHandle, targetHandle, ...restEdge } = e;
      return {
        ...restEdge,
        type: 'default',
        animated: false, // disabled animation to avoid visual confusion
        markerEnd: { type: MarkerType.ArrowClosed, color: edgeStroke },
        style: { ...e.style, stroke: edgeStroke, strokeWidth: e.style?.strokeWidth || 2 },
      };
    });
  }, [edgesData]);

  return (
    <ReactFlowProvider>
      <RoadmapCanvas nodes={nodes} edges={edges} title={title} rawNodes={nodesData} />
    </ReactFlowProvider>
  );
}
