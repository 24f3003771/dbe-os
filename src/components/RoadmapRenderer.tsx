"use client";

import React, { useMemo } from 'react';
import { ReactFlow, Controls, Background, NodeProps, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const TopicNode = ({ data }: NodeProps) => (
  <div 
    style={{ ...(data.style as React.CSSProperties || {}), border: '2px solid', borderRadius: '8px', padding: '10px', fontWeight: 'bold' }}
    className="bg-white hover:bg-stone-50 transition-colors cursor-pointer text-center flex items-center justify-center w-full h-full"
  >
    {data.label as React.ReactNode}
    <Handle type="source" position={Position.Bottom} className="opacity-0" />
    <Handle type="target" position={Position.Top} className="opacity-0" />
  </div>
);

const SubtopicNode = ({ data }: NodeProps) => (
  <div 
    style={{ ...(data.style as React.CSSProperties || {}), border: '1px dashed', borderRadius: '4px', padding: '6px', fontSize: '14px' }}
    className="bg-white hover:bg-stone-50 transition-colors cursor-pointer text-center flex items-center justify-center w-full h-full"
  >
    {data.label as React.ReactNode}
  </div>
);

const ParagraphNode = ({ data }: NodeProps) => (
  <div 
    style={{ ...(data.style as React.CSSProperties || {}), padding: '4px', fontSize: '14px', whiteSpace: 'pre-wrap' }}
    className="text-stone-600 flex items-center justify-center w-full h-full"
  >
    {data.label as React.ReactNode}
  </div>
);

const TitleNode = ({ data }: NodeProps) => (
  <div 
    style={{ ...(data.style as React.CSSProperties || {}), fontWeight: '900', fontSize: '32px', letterSpacing: '-0.05em' }}
    className="text-stone-900 flex items-center justify-center w-full h-full"
  >
    {data.label as React.ReactNode}
  </div>
);

const VerticalNode = ({ data }: NodeProps) => {
  const styleObj = (data.style || {}) as any;
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div style={{ width: '4px', height: '100%', backgroundColor: styleObj.stroke || '#CBD5E1' }}></div>
    </div>
  );
};

const ButtonNode = ({ data }: NodeProps) => (
  <div 
    style={{ ...(data.style as React.CSSProperties || {}), padding: '8px', borderRadius: '6px' }}
    className="bg-indigo-600 text-white font-bold cursor-pointer text-center hover:bg-indigo-700 transition-colors flex items-center justify-center w-full h-full"
  >
    {data.label as React.ReactNode}
  </div>
);

const LabelNode = ({ data }: NodeProps) => (
  <div 
    style={{ ...(data.style as React.CSSProperties || {}) }}
    className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center justify-center w-full h-full"
  >
    {data.label as React.ReactNode}
  </div>
);

const LegendNode = ({ data }: NodeProps) => (
  <div 
    style={{ ...(data.style as React.CSSProperties || {}), border: '1px solid', padding: '8px', borderRadius: '4px' }}
    className="bg-white text-xs flex items-center justify-center w-full h-full"
  >
    {data.label as React.ReactNode}
  </div>
);

const nodeTypes = {
  topic: TopicNode,
  subtopic: SubtopicNode,
  paragraph: ParagraphNode,
  title: TitleNode,
  vertical: VerticalNode,
  button: ButtonNode,
  label: LabelNode,
  legend: LegendNode,
};

export default function RoadmapRenderer({ nodesData }: { nodesData: any[] }) {
  // Ensure nodes have exactly what reactflow needs
  const nodes = useMemo(() => {
    return nodesData.map(n => ({
      ...n,
      draggable: false,
    }));
  }, [nodesData]);

  return (
    <div className="w-full h-full min-h-[80vh] bg-stone-50 rounded-[3rem] border border-stone-200 overflow-hidden shadow-inner">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
      >
        <Background color="#E7E5E4" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
