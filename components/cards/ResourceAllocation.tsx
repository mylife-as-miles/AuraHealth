import React from 'react';
import { Package, Users } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Defs, LinearGradient, Stop } from 'recharts';

const data = [
  { val: 10 }, { val: 20 }, { val: 15 }, { val: 35 }, { val: 25 }, { val: 45 }, { val: 30 }
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

      <div className="h-20 relative -mx-2">
         <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#160527" stopOpacity={0.1}/>
                  <stop offset="100%" stopColor="#160527" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Line 
                type="natural" 
                dataKey="val" 
                stroke="#160527" 
                strokeWidth={2} 
                dot={false}
                className="dark:stroke-gray-400"
              />
            </LineChart>
         </ResponsiveContainer>
         <div className="absolute top-[40%] right-[20%] w-2.5 h-2.5 bg-secondary rounded-full border-[3px] border-white dark:border-gray-800 shadow-md"></div>
      </div>
    </div>
  );
}