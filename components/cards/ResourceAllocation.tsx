import React, { useState } from 'react';
import { Package, Users } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

type Period = 'Daily' | 'Weekly' | 'Monthly';

const CHART_DATA: Record<Period, { time: string; val: number }[]> = {
  Daily: [
    { time: '6AM', val: 5 }, { time: '8AM', val: 15 }, { time: '10AM', val: 30 },
    { time: '12PM', val: 22 }, { time: '2PM', val: 38 }, { time: '4PM', val: 28 },
    { time: '6PM', val: 12 },
  ],
  Weekly: [
    { time: 'Mon', val: 18 }, { time: 'Tue', val: 32 }, { time: 'Wed', val: 24 },
    { time: 'Thu', val: 40 }, { time: 'Fri', val: 35 }, { time: 'Sat', val: 15 },
    { time: 'Sun', val: 10 },
  ],
  Monthly: [
    { time: '08:00', val: 10 }, { time: '10:00', val: 25 }, { time: '12:00', val: 18 },
    { time: '14:00', val: 42 }, { time: '16:00', val: 28 }, { time: '18:00', val: 45 },
    { time: '20:00', val: 35 },
  ],
};

const RESOURCE_DATA: Record<Period, { equipment: string; staff: string }> = {
  Daily: { equipment: '72 Units', staff: '18 Active' },
  Weekly: { equipment: '79 Units', staff: '21 Active' },
  Monthly: { equipment: '85 Units', staff: '24 Active' },
};

export default function ResourceAllocation() {
  const [period, setPeriod] = useState<Period>('Monthly');
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const data = CHART_DATA[period];
  const resources = RESOURCE_DATA[period];

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
      </div>
    </div>
  );
}