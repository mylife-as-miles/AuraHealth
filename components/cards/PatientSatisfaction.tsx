import React, { useState } from 'react';

type ViewMode = 'Monthly' | 'Weekly';

interface BarData {
  label: string;
  green: number;
  pink: number;
  totalResponses: number;
  score: number;
}

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../lib/db';
import { useMemo } from 'react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

  const patients = useLiveQuery(() => db.patients.toArray()) || [];

  const data = useMemo(() => {
    if (!patients.length) return [];

    const now = new Date();
    // Flatten all history events
    const events = patients.flatMap(p =>
      p.history.map(h => ({
        date: new Date(h.date),
        // Mock score based on event type to create variety
        score: h.type === 'Routine' ? 5 : h.type === 'Visit' ? 4 : 3
      }))
    );

    const aggregated: Record<string, { total: number; sum: number; high: number; low: number }> = {};
    const labels: string[] = [];

    if (viewMode === 'Monthly') {
      // Last 3 months
      for (let i = 0; i < 3; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = MONTHS[d.getMonth()];
        labels.unshift(label);
        aggregated[label] = { total: 0, sum: 0, high: 0, low: 0 };
      }

      events.forEach(e => {
        const diffMonths = (now.getFullYear() - e.date.getFullYear()) * 12 + (now.getMonth() - e.date.getMonth());
        if (diffMonths >= 0 && diffMonths < 3) {
          const label = MONTHS[e.date.getMonth()];
          if (aggregated[label]) {
            aggregated[label].total++;
            aggregated[label].sum += e.score;
            if (e.score >= 4) aggregated[label].high++;
            else aggregated[label].low++;
          }
        }
      });
    } else {
      // Weekly (last 4 weeks) - simplistic for demo
      for (let i = 3; i >= 0; i--) {
        labels.push(`W${4 - i}`);
        aggregated[`W${4 - i}`] = { total: 0, sum: 0, high: 0, low: 0 };
      }
      // Randomly distribute for demo if no real weekly data logic (history dates are mostly random)
      // Or hash the date to bucket
      events.forEach(e => {
        const weekBuck = (e.date.getDate() % 4) + 1;
        const label = `W${weekBuck}`;
        if (aggregated[label]) {
          aggregated[label].total++;
          aggregated[label].sum += e.score;
          if (e.score >= 4) aggregated[label].high++;
          else aggregated[label].low++;
        }
      });
    }

    return labels.map(label => {
      const agg = aggregated[label];
      const count = agg.total || 1; // avoid div 0
      return {
        label,
        green: Math.round((agg.high / count) * 100) || 50,
        pink: Math.round((agg.low / count) * 100) || 20, // Should use rest? The stacked bar logic in component implies parallel bars? 
        // Looking at original component: 
        // <div style={{ width: `${data.green}%` }} ...>
        // <div style={{ width: `${data.pink}%` }} ...>
        // These are sibling divs in a row? No, they are flex?
        // "flex relative group" -> Yes.
        // So green + pink should <= 100?
        // "green" is "High score", "pink" is "Low/Medium"? 
        // Let's assume green = % >= 4, pink = % < 4.
        // If green is 60%, pink could be 40%.
        // Original data: green: 40, pink: 30. Sum = 70. Remaining 30 is empty? 
        // "bg-gray-100" is container. so yes.

        totalResponses: agg.total,
        score: Number((agg.sum / count).toFixed(1)) || 0
      };
    });

  }, [patients, viewMode]);

  // Calculate overall trend
  const avgScore = data.reduce((sum, d) => sum + d.score, 0) / (data.length || 1);
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