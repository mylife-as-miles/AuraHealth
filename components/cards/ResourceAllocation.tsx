import React, { useState, useMemo } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { Package, Users } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../lib/db';

type Period = 'Daily' | 'Weekly' | 'Monthly';

export default function ResourceAllocation() {
  const [period, setPeriod] = useState<Period>('Monthly');
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);

  const workflowCards = useLiveQuery(() => db.workflowCards.toArray()) || [];
  const diagnosticCases = useLiveQuery(() => db.diagnosticCases.toArray()) || [];

  const { data, resources } = useMemo(() => {
    // 1. Calculate Resources
    // Staff: unique doctors in workflow
    const uniqueDoctors = new Set(workflowCards.map(c => c.doctor).filter(Boolean));
    const staffCount = uniqueDoctors.size || 3; // minimal fallback

    // Equipment: based on active diagnostic cases
    const activeScans = diagnosticCases.filter(c => c.status === 'In Progress' || c.status === 'Pending').length;
    const equipmentCount = 70 + activeScans; // Base + usage

    // 2. Calculate Chart Data
    let chartData: { time: string; val: number }[] = [];

    if (period === 'Daily') {
      const hours: Record<string, number> = {};
      ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM'].forEach(h => hours[h] = 0);

      workflowCards.forEach(c => {
        const hour = parseInt(c.time);
        if (!isNaN(hour)) {
          const isPm = c.time.toLowerCase().includes('pm');
          const h24 = isPm && hour !== 12 ? hour + 12 : hour;

          if (h24 >= 6 && h24 < 8) hours['6AM']++;
          else if (h24 >= 8 && h24 < 10) hours['8AM']++;
          else if (h24 >= 10 && h24 < 12) hours['10AM']++;
          else if (h24 >= 12 && h24 < 14) hours['12PM']++;
          else if (h24 >= 14 && h24 < 16) hours['2PM']++;
          else if (h24 >= 16 && h24 < 18) hours['4PM']++;
          else if (h24 >= 18) hours['6PM']++;
        }
      });
      chartData = Object.entries(hours).map(([time, val]) => ({ time, val: val + 2 }));
    } else if (period === 'Weekly') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const counts = new Array(7).fill(0);

      diagnosticCases.forEach(c => {
        const d = new Date(c.timestamp);
        counts[d.getDay()]++;
      });

      chartData = [
        { time: 'Mon', val: counts[1] + 5 },
        { time: 'Tue', val: counts[2] + 4 },
        { time: 'Wed', val: counts[3] + 6 },
        { time: 'Thu', val: counts[4] + 5 },
        { time: 'Fri', val: counts[5] + 8 },
        { time: 'Sat', val: counts[6] + 2 },
        { time: 'Sun', val: counts[0] + 1 }
      ];
    } else {
      chartData = [
        { time: 'Week 1', val: diagnosticCases.length * 0.2 + 10 },
        { time: 'Week 2', val: diagnosticCases.length * 0.3 + 15 },
        { time: 'Week 3', val: diagnosticCases.length * 0.25 + 12 },
        { time: 'Week 4', val: diagnosticCases.length * 0.25 + 18 },
      ];
    }

    return {
      data: chartData,
      resources: {
        equipment: `${equipmentCount} Units`,
        staff: `${staffCount} Active`
      }
    };
  }, [workflowCards, diagnosticCases, period]);

  return (
    <div className="w-full md:w-60 bg-background-light dark:bg-gray-800/40 rounded-2xl p-5 flex flex-col justify-between border border-transparent dark:border-gray-700/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-500">Resource Allocation</span>
        <div className="relative">
          <button
            onClick={() => setShowPeriodMenu(!showPeriodMenu)}
            className="text-[10px] font-semibold bg-white dark:bg-gray-700 border dark:border-gray-600 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            {period}
          </button>
          {showPeriodMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-20 py-1 w-28 overflow-hidden">
              {(['Daily', 'Weekly', 'Monthly'] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => { setPeriod(p); setShowPeriodMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 text-[11px] font-medium transition-colors ${period === p
                    ? 'bg-secondary/10 text-secondary font-bold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center py-4 space-y-4">
        <div className="flex items-center gap-3 group cursor-pointer" title="View equipment breakdown">
          <div className="w-9 h-9 rounded-full bg-secondary/20 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Package size={18} />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Equipment</div>
            <div className="text-sm font-bold text-primary dark:text-white transition-all duration-300">{resources.equipment}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 group cursor-pointer" title="View staff breakdown">
          <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users size={18} />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Staff</div>
            <div className="text-sm font-bold text-primary dark:text-white transition-all duration-300">{resources.staff}</div>
          </div>
        </div>
      </div>

      <div className="h-24 relative -mx-2 w-full min-w-0">
        <ErrorBoundary>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  padding: '8px 12px'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#160527' }}
                labelStyle={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}
                cursor={{ stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Line
                type="monotone"
                dataKey="val"
                stroke="#54E097"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#54E097', stroke: '#fff', strokeWidth: 2 }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </ErrorBoundary>
      </div>
    </div>
  );
}