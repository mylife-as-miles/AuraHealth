import React from 'react';

export default function PatientSatisfaction() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-bold text-primary dark:text-white text-sm">Triage Risk Stratification</h3>
          <p className="text-[10px] text-gray-500 mt-1 max-w-[150px] leading-tight">Automated intake analysis via MedGemma</p>
        </div>
        <div className="relative">
          <select className="appearance-none text-[10px] font-bold bg-background-light dark:bg-gray-800 border-none rounded-lg py-1.5 pl-3 pr-8 text-gray-600 dark:text-gray-300 focus:ring-0 cursor-pointer outline-none shadow-sm">
            <option>Active Shift</option>
            <option>Today</option>
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[8px]">▼</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-5 mb-4 px-1">

        {/* Row 1: High Acuity */}
        <div className="space-y-1.5">
          <div className="flex items-end justify-between">
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">High Acuity</span>
            <span className="text-[9px] text-gray-500 font-medium">15% of intake • 6 patients flagged</span>
          </div>
          <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex shadow-inner">
            <div style={{ width: `15%` }} className="h-full bg-accent transition-all duration-1000 ease-out"></div>
          </div>
        </div>

        {/* Row 2: Moderate Risk */}
        <div className="space-y-1.5">
          <div className="flex items-end justify-between">
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Moderate Risk</span>
            <span className="text-[9px] text-gray-500 font-medium">35% of intake • 14 patients queued</span>
          </div>
          <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex shadow-inner">
            <div style={{ width: `35%` }} className="h-full bg-amber-400 transition-all duration-1000 ease-out delay-100"></div>
          </div>
        </div>

        {/* Row 3: Routine / Low */}
        <div className="space-y-1.5">
          <div className="flex items-end justify-between">
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Routine / Low</span>
            <span className="text-[9px] text-gray-500 font-medium">50% of intake • 20 patients queued</span>
          </div>
          <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex shadow-inner">
            <div style={{ width: `50%` }} className="h-full bg-secondary transition-all duration-1000 ease-out delay-200"></div>
          </div>
        </div>

      </div>

      <div className="flex justify-between items-center text-[10px] font-semibold text-gray-500 mt-auto px-2 bg-gray-50 dark:bg-gray-800/50 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_5px_rgba(254,87,150,0.5)]"></span>
          <span>Requires MD Review</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_5px_rgba(84,224,151,0.5)]"></span>
          <span>Standard Queue</span>
        </div>
      </div>
    </div>
  );
}