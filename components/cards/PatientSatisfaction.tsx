import React, { useState } from 'react';

type ViewMode = 'Monthly' | 'Weekly';

interface BarData {
  label: string;
  green: number;
  pink: number;
  totalResponses: number;
  score: number;
}

const MONTHLY_DATA: BarData[] = [
  { label: 'Jan', green: 40, pink: 30, totalResponses: 312, score: 4.2 },
  { label: 'Dec', green: 55, pink: 25, totalResponses: 487, score: 4.5 },
  { label: 'Nov', green: 30, pink: 20, totalResponses: 256, score: 3.8 },
];

const WEEKLY_DATA: BarData[] = [
  { label: 'W1', green: 48, pink: 22, totalResponses: 89, score: 4.4 },
  { label: 'W2', green: 52, pink: 18, totalResponses: 104, score: 4.6 },
  { label: 'W3', green: 35, pink: 28, totalResponses: 76, score: 3.9 },
  { label: 'W4', green: 60, pink: 15, totalResponses: 118, score: 4.7 },
];

const StackedBar = ({ data, isActive, onClick }: { data: BarData, isActive: boolean, onClick: () => void }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-3 cursor-pointer" onClick={onClick}>
      <span className="text-[11px] font-bold w-6 text-gray-400">{data.label}</span>
      <div className={`flex-1 h-3.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex relative group transition-transform ${isActive ? 'scale-105' : ''}`}>
        <div style={{ width: `${data.green}%` }} className="h-full bg-secondary transition-all duration-500"></div>
        <div style={{ width: `${data.pink}%` }} className="h-full bg-accent transition-all duration-500"></div>

        <div className="absolute -top-12 right-0 bg-primary text-white text-[10px] p-2.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 w-24">
          <div className="flex justify-between w-full font-bold">
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1"></span>{data.green}%</span>
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-accent mr-1"></span>{data.pink}%</span>
          </div>
          <div className="absolute bottom-[-4px] right-4 w-2 h-2 bg-primary rotate-45"></div>
        </div>
      </div>
    </div>
    {/* Expandable detail row */}
    {isActive && (
      <div className="ml-9 flex items-center gap-4 text-[10px] text-gray-500 dark:text-gray-400 animate-in fade-in slide-in-from-top-1 duration-200 pb-1">
        <span>Score: <strong className="text-primary dark:text-white">{data.score}/5.0</strong></span>
        <span>•</span>
        <span>{data.totalResponses} responses</span>
      </div>
    )}
  </div>
);

export default function PatientSatisfaction() {
  const [viewMode, setViewMode] = useState<ViewMode>('Monthly');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(1);
  const data = viewMode === 'Monthly' ? MONTHLY_DATA : WEEKLY_DATA;

  // Calculate overall trend
  const avgScore = data.reduce((sum, d) => sum + d.score, 0) / data.length;
  const prevAvg = viewMode === 'Monthly' ? 4.0 : 4.2;
  const trendPercent = (((avgScore - prevAvg) / prevAvg) * 100).toFixed(1);
  const isPositive = avgScore >= prevAvg;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-primary dark:text-white text-sm">Patient Satisfaction</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isPositive ? 'text-secondary bg-secondary/10' : 'text-accent bg-accent/10'}`}>
              {isPositive ? '↑' : '↓'} {trendPercent}%
            </span>
            <span className="text-[10px] text-gray-400">vs previous</span>
          </div>
        </div>
        <div className="relative">
          <select
            value={viewMode}
            onChange={(e) => { setViewMode(e.target.value as ViewMode); setExpandedIndex(null); }}
            className="appearance-none text-[10px] font-bold bg-background-light dark:bg-gray-800 border-none rounded-lg py-1.5 pl-3 pr-8 text-gray-600 dark:text-gray-300 focus:ring-0 cursor-pointer outline-none"
          >
            <option>Monthly</option>
            <option>Weekly</option>
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4 mb-4">
        {data.map((item, i) => (
          <StackedBar
            key={`${viewMode}-${i}`}
            data={item}
            isActive={expandedIndex === i}
            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
          />
        ))}
      </div>

      <div className="flex justify-between items-center text-[10px] font-semibold text-gray-400 mt-auto px-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent"></span>
          <span>Improving</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          <span>Overall Sat.</span>
        </div>
      </div>
    </div>
  );
}