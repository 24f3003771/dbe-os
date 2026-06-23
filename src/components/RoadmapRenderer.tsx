"use client";

import React, { useMemo } from 'react';
import { ReactFlow, Controls, Background, NodeProps, Handle, Position, MarkerType, ReactFlowProvider, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Balsamiq_Sans } from 'next/font/google';

const balsamiq = Balsamiq_Sans({ weight: ['400', '700'], subsets: ['latin'] });

// Helper to extract style safely
const getStyle = (data: any): React.CSSProperties => {
  const baseStyle = data.style ? { ...data.style } : {};
  // Fix naming for React CSS properties
  if (baseStyle.stroke) {
    // some nodes might not need this explicitly in React style if it's handled by CSS, but good for fallback
  }
  return baseStyle;
};

const TopicNode = ({ data }: NodeProps) => {
  const styleObj = getStyle(data);
  return (
    <div 
      style={{ 
        ...styleObj, 
        borderWidth: styleObj.borderWidth || '2px', 
        borderColor: styleObj.borderColor || '#2D2622', 
        borderStyle: 'solid',
        borderRadius: styleObj.borderRadius || '8px', 
        padding: '10px 16px', 
        fontWeight: 700,
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
      }}
      className="bg-white hover:bg-stone-50 hover:shadow-md transition-all cursor-pointer text-center flex items-center justify-center w-full h-full text-sm sm:text-base text-stone-800"
    >
      {data.label as React.ReactNode}
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="target" position={Position.Top} className="opacity-0" />
    </div>
  );
};

const SubtopicNode = ({ data }: NodeProps) => {
  const styleObj = getStyle(data);
  return (
    <div 
      style={{ 
        ...styleObj, 
        borderWidth: styleObj.borderWidth || '1px', 
        borderColor: styleObj.borderColor || '#A8A29E', 
        borderStyle: styleObj.strokeDasharray ? 'dashed' : 'solid', 
        borderRadius: styleObj.borderRadius || '6px', 
        padding: '8px 12px', 
        fontSize: '14px',
        color: styleObj.color || '#57534E'
      }}
      className="bg-white hover:bg-stone-50 transition-colors cursor-pointer text-center flex items-center justify-center w-full h-full shadow-sm"
    >
      {data.label as React.ReactNode}
    </div>
  );
};

const ParagraphNode = ({ data }: NodeProps) => (
  <div 
    style={{ ...getStyle(data), padding: '4px', fontSize: '13px', whiteSpace: 'pre-wrap', color: '#57534E' }}
    className="flex items-center justify-center w-full h-full text-center"
  >
    {data.label as React.ReactNode}
  </div>
);

const TitleNode = ({ data }: NodeProps) => (
  <div 
    style={{ ...getStyle(data), fontWeight: '900', fontSize: '32px', letterSpacing: '-0.02em', color: '#1C1917' }}
    className="flex items-center justify-center w-full h-full text-center drop-shadow-sm"
  >
    {data.label as React.ReactNode}
  </div>
);

const VerticalNode = ({ data }: NodeProps) => {
  const styleObj = getStyle(data) as any;
  const stroke = styleObj.stroke || '#94A3B8';
  const isDashed = !!styleObj.strokeDasharray;
  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none">
      <div 
        style={{ 
          width: styleObj.strokeWidth || '3px', 
          height: '100%', 
          backgroundColor: isDashed ? 'transparent' : stroke,
          borderLeft: isDashed ? `${styleObj.strokeWidth || '3px'} dashed ${stroke}` : 'none'
        }}
      ></div>
    </div>
  );
};

const HorizontalNode = ({ data }: NodeProps) => {
  const styleObj = getStyle(data) as any;
  const stroke = styleObj.stroke || '#94A3B8';
  const isDashed = !!styleObj.strokeDasharray;
  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none">
      <div 
        style={{ 
          height: styleObj.strokeWidth || '3px', 
          width: '100%', 
          backgroundColor: isDashed ? 'transparent' : stroke,
          borderTop: isDashed ? `${styleObj.strokeWidth || '3px'} dashed ${stroke}` : 'none'
        }}
      ></div>
    </div>
  );
};

const ButtonNode = ({ data }: NodeProps) => (
  <div 
    style={{ ...getStyle(data), padding: '10px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '15px' }}
    className="bg-indigo-600 text-white shadow-md cursor-pointer text-center hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center justify-center w-full h-full"
  >
    {data.label as React.ReactNode}
  </div>
);

const LabelNode = ({ data }: NodeProps) => (
  <div 
    style={{ ...getStyle(data) }}
    className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 flex items-center justify-center w-full h-full pointer-events-none"
  >
    {data.label as React.ReactNode}
  </div>
);

const LegendNode = ({ data }: NodeProps) => (
  <div 
    style={{ ...getStyle(data), borderWidth: '1px', borderColor: '#E7E5E4', padding: '12px', borderRadius: '6px' }}
    className="bg-white/80 backdrop-blur-sm shadow-sm text-xs flex flex-col justify-center w-full h-full border-stone-200"
  >
    {/* Try to parse label as html if needed, but for now just render text */}
    <div dangerouslySetInnerHTML={{ __html: (data.label as string) || '' }} />
  </div>
);

// We must also handle custom types that might exist like 'path' or other unknown nodes
// by simply defaulting them to avoid errors.

const nodeTypes = {
  topic: TopicNode,
  subtopic: SubtopicNode,
  paragraph: ParagraphNode,
  title: TitleNode,
  vertical: VerticalNode,
  horizontal: HorizontalNode,
  button: ButtonNode,
  label: LabelNode,
  legend: LegendNode,
  todo: TopicNode, // some roadmaps use todo
};

function RoadmapCanvas({ nodes, edges, title }: { nodes: any[], edges: any[], title?: string }) {
  const { setCenter, fitView, zoomIn, zoomOut } = useReactFlow();

  // Extract major topics for the sidebar navigator
  const topics = useMemo(() => {
    return nodes.filter((n: any) => n.type === 'topic' || n.type === 'title');
  }, [nodes]);

  const jumpToNode = (node: any) => {
    // Safely get node dimensions, defaulting to standard sizes if missing
    const width = node.measured?.width || node.width || 150;
    const height = node.measured?.height || node.height || 50;
    
    // Center the node in the view
    const x = node.position.x + width / 2;
    const y = node.position.y + height / 2;
    
    setCenter(x, y, { zoom: 1.2, duration: 800 });
  };

  return (
    <div className={`w-full h-full min-h-[85vh] bg-[#F8F9FA] rounded-[1.5rem] overflow-hidden shadow-2xl border border-stone-200 flex flex-col md:flex-row ${balsamiq.className}`}>
      
      {/* Quick Navigator Sidebar */}
      <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-stone-200 flex flex-col z-10 shrink-0">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <h3 className="font-bold text-xs uppercase tracking-widest text-stone-500">Navigator</h3>
            <div className="flex gap-1 text-stone-400">
                <button onClick={() => zoomIn({ duration: 300 })} className="p-1 hover:bg-stone-200 hover:text-stone-800 rounded transition-colors" title="Zoom In">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                </button>
                <button onClick={() => zoomOut({ duration: 300 })} className="p-1 hover:bg-stone-200 hover:text-stone-800 rounded transition-colors" title="Zoom Out">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                </button>
                <button onClick={() => fitView({ duration: 500 })} className="p-1 hover:bg-stone-200 hover:text-stone-800 rounded transition-colors" title="Fit View">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                </button>
            </div>
        </div>
        <div className="overflow-y-auto p-3 flex-1 flex flex-col gap-1 custom-scrollbar">
          {topics.map(t => (
             <button 
                key={t.id} 
                onClick={() => jumpToNode(t)}
                className="text-left text-[11px] font-bold px-3 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 text-stone-600 transition-colors truncate"
             >
                {t.data.label as React.ReactNode}
             </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Mac OS Header */}
        <div className="h-10 bg-[#1c1c1e] w-full flex items-center px-4 relative z-10 shrink-0">
           <div className="flex gap-1.5 absolute left-4">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
           </div>
           <div className="w-full text-center text-[#86868b] text-[10px] font-mono tracking-widest uppercase truncate px-20">
              {title ? `${title.toUpperCase().replace(/-/g, '_')}.NOTES` : 'ROADMAP.VIEW'}
           </div>
        </div>

        {/* The React Flow Canvas */}
        <div className="flex-1 relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ maxZoom: 1.2 }}
                minZoom={0.1}
                maxZoom={2}
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#E2E8F0" gap={20} size={1.5} />
            </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default function RoadmapRenderer({ nodesData, edgesData = [], title }: { nodesData: any[], edgesData?: any[], title?: string }) {
  // Ensure nodes have exactly what reactflow needs and strip away complex stuff that might break React
  const nodes = useMemo(() => {
    return nodesData.map((n: any) => {
      // Inject width and height into the wrapper style to enforce absolute sizing
      const nodeStyle = { 
        ...n.style, 
        width: n.width, 
        height: n.height 
      };

      // Create a shallow copy
      const node = { 
        ...n, 
        draggable: false,
        style: nodeStyle
      };
      
      // If the type is not registered, default to paragraph or label to not break
      if (!nodeTypes[node.type as keyof typeof nodeTypes]) {
        node.type = 'paragraph';
      }

      return node;
    });
  }, [nodesData]);

  // Ensure edges have the correct properties and add arrows to them
  const edges = useMemo(() => {
    return edgesData.map((e: any) => {
      // By default, roadmap edges should have arrows at the end if they are connecting nodes
      const edgeStroke = e.style?.stroke || '#94A3B8';
      
      return {
        ...e,
        type: e.type || 'default',
        animated: e.data?.edgeStyle === 'dashed' || !!e.style?.strokeDasharray,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeStroke,
        },
        style: {
          ...e.style,
          stroke: edgeStroke,
          strokeWidth: e.style?.strokeWidth || 2,
        }
      };
    });
  }, [edgesData]);

  return (
    <ReactFlowProvider>
      <RoadmapCanvas nodes={nodes} edges={edges} title={title} />
    </ReactFlowProvider>
  );
}
