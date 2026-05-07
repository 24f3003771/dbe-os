"use client";

import React, { useState, useMemo } from 'react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import { Settings2, BarChart2, Info } from 'lucide-react';

// --- Statistical Functions ---

// Gamma function approximation (Lanczos)
function gamma(z: number): number {
    const g = 7;
    const p = [
        0.99999999999980993, 676.5203681218851, -1259.1392167224028,
        771.32342877765313, -176.61502916214059, 12.507343278686905,
        -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    z -= 1;
    let x = p[0];
    for (let i = 1; i < g + 2; i++) x += p[i] / (z + i);
    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

const PDF = {
    normal: (x: number, mu: number, sigma: number) => {
        return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    },
    t: (x: number, df: number) => {
        const coeff = gamma((df + 1) / 2) / (Math.sqrt(df * Math.PI) * gamma(df / 2));
        return coeff * Math.pow(1 + (x * x) / df, -(df + 1) / 2);
    },
    chiSquare: (x: number, df: number) => {
        if (x <= 0) return 0;
        return (1 / (Math.pow(2, df / 2) * gamma(df / 2))) * Math.pow(x, (df / 2) - 1) * Math.exp(-x / 2);
    },
    f: (x: number, d1: number, d2: number) => {
        if (x <= 0) return 0;
        const num = Math.pow(d1 * x, d1) * Math.pow(d2, d2);
        const den = Math.pow(d1 * x + d2, d1 + d2);
        const beta = (gamma(d1 / 2) * gamma(d2 / 2)) / gamma((d1 + d2) / 2);
        return Math.sqrt(num / den) / (x * beta);
    }
};

export interface DistributionProps {
    type: 'normal' | 't' | 'chi-square' | 'f';
    mu?: number;
    sigma?: number;
    df1?: number; // degrees of freedom
    df2?: number; // second df for F-dist
}

export default function DistributionVisualizer(props: DistributionProps) {
    const [params, setParams] = useState({
        mu: props.mu ?? 0,
        sigma: props.sigma ?? 1,
        df1: props.df1 ?? 5,
        df2: props.df2 ?? 5
    });

    const data = useMemo(() => {
        const points = [];
        let start = -5, end = 5, step = 0.1;

        if (props.type === 'chi-square' || props.type === 'f') {
            start = 0.01;
            end = 20;
            step = 0.2;
        } else if (props.type === 'normal') {
            start = params.mu - 4 * params.sigma;
            end = params.mu + 4 * params.sigma;
            step = (end - start) / 100;
        }

        for (let x = start; x <= end; x += step) {
            let y = 0;
            switch (props.type) {
                case 'normal': y = PDF.normal(x, params.mu, params.sigma); break;
                case 't': y = PDF.t(x, params.df1); break;
                case 'chi-square': y = PDF.chiSquare(x, params.df1); break;
                case 'f': y = PDF.f(x, params.df1, params.df2); break;
            }
            points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(4)) });
        }
        return points;
    }, [props.type, params]);

    return (
        <div className="bg-white border border-stone-100 rounded-[2rem] p-6 md:p-8 my-8 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] tracking-widest uppercase mb-1">
                        <BarChart2 className="w-3.5 h-3.5" /> Interactive Probability Density
                    </div>
                    <h3 className="text-2xl font-black font-headline text-[#1A1A1A] capitalize italic leading-none">
                        {props.type} Distribution
                    </h3>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-100 w-full md:w-auto">
                    {props.type === 'normal' && (
                        <>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase text-stone-400 block">Mean (μ)</label>
                                <input 
                                    type="range" min="-10" max="10" step="0.5" 
                                    value={params.mu} 
                                    onChange={e => setParams({...params, mu: parseFloat(e.target.value)})}
                                    className="accent-indigo-600"
                                />
                                <span className="text-[10px] font-bold text-stone-600 ml-2">{params.mu}</span>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase text-stone-400 block">Std Dev (σ)</label>
                                <input 
                                    type="range" min="0.1" max="5" step="0.1" 
                                    value={params.sigma} 
                                    onChange={e => setParams({...params, sigma: parseFloat(e.target.value)})}
                                    className="accent-indigo-600"
                                />
                                <span className="text-[10px] font-bold text-stone-600 ml-2">{params.sigma}</span>
                            </div>
                        </>
                    )}
                    {(props.type === 't' || props.type === 'chi-square' || props.type === 'f') && (
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-stone-400 block">DF (k)</label>
                            <input 
                                type="range" min="1" max="100" step="1" 
                                value={params.df1} 
                                onChange={e => setParams({...params, df1: parseInt(e.target.value)})}
                                className="accent-indigo-600"
                            />
                            <span className="text-[10px] font-bold text-stone-600 ml-2">{params.df1}</span>
                        </div>
                    )}
                    {props.type === 'f' && (
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-stone-400 block">DF2 (m)</label>
                            <input 
                                type="range" min="1" max="100" step="1" 
                                value={params.df2} 
                                onChange={e => setParams({...params, df2: parseInt(e.target.value)})}
                                className="accent-indigo-600"
                            />
                            <span className="text-[10px] font-bold text-stone-600 ml-2">{params.df2}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="x" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 10, fontWeight: 700, fill: '#A8A29E'}} 
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 10, fontWeight: 700, fill: '#A8A29E'}} 
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700, fontSize: '12px' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="y" 
                            stroke="#4F46E5" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorY)" 
                            animationDuration={300}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 flex items-start gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <Info className="w-4 h-4 text-stone-400 mt-0.5" />
                <p className="text-[11px] font-medium text-stone-500 leading-relaxed">
                    This visualizer renders the <strong>Probability Density Function (PDF)</strong> for the selected distribution. 
                    Adjust the parameters using the sliders above to see how the curve shifts and scales in real-time.
                </p>
            </div>
        </div>
    );
}
