"use client";

import React, { useMemo } from 'react';
import { ReactFlow, Controls, Background, NodeProps, Handle, Position } from '@xyflow/react';
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

export default function RoadmapRenderer({ nodesData }: { nodesData: any[] }) {
  // Ensure nodes have exactly what reactflow needs and strip away complex stuff that might break React
  const nodes = useMemo(() => {
    return nodesData.map((n: any) => {
      // Create a shallow copy
      const node = { ...n, draggable: false };
      
      // If the type is not registered, default to paragraph or label to not break
      if (!nodeTypes[node.type as keyof typeof nodeTypes]) {
        node.type = 'paragraph';
      }

      return node;
    });
  }, [nodesData]);

  return (
    <div className={`w-full h-full min-h-[85vh] bg-[#F8F9FA] rounded-[3rem] border border-stone-200 overflow-hidden shadow-inner ${balsamiq.className}`}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#E2E8F0" gap={20} size={1.5} />
        <Controls showInteractive={false} className="bg-white/90 backdrop-blur border border-stone-200 shadow-md rounded-xl p-1" />
      </ReactFlow>
    </div>
  );
}
