import React from 'react';
import { Package, Users } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { time: '08:00', val: 10 }, 
  { time: '10:00', val: 25 }, 
  { time: '12:00', val: 18 }, 
  { time: '14:00', val: 42 }, 
  { time: '16:00', val: 28 }, 
  { time: '18:00', val: 45 }, 
  { time: '20:00', val: 35 }
];

export default function ResourceAllocation() {
  return (
    <div className="w-full md:w-60 bg-background-light dark:bg-gray-800/40 rounded-2xl p-5 flex flex-col justify-between border border-transparent dark:border-gray-700/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-500">Resource Allocation</span>
        <span className="text-[10px] font-semibold bg-white dark:bg-gray-700 border dark:border-gray-600 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">
          Monthly
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center py-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
            <Package size={18} />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Equipment</div>
            <div className="text-sm font-bold text-primary dark:text-white">85 Units</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center">
            <Users size={18} />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Staff</div>
            <div className="text-sm font-bold text-primary dark:text-white">24 Active</div>
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
              />
            </LineChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
}