import React, { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../lib/db';

export default function PatientSatisfaction() {
  const patients = useLiveQuery(() => db.patients.toArray()) || [];

  const { highAcuity, moderateRisk, routineLow, total } = useMemo(() => {
    const active = patients.filter(p => p.active !== false);
    const t = active.length || 1; // avoid division by zero

    const high = active.filter(p =>
      p.risk === 'High Risk'
    );
    const moderate = active.filter(p =>
      p.risk === 'Moderate'
    );
    const low = active.filter(p =>
      p.risk === 'Low Risk' || p.risk === 'Unknown' || !p.risk
    );

    return {
      highAcuity: { count: high.length, pct: Math.round((high.length / t) * 100) },
      moderateRisk: { count: moderate.length, pct: Math.round((moderate.length / t) * 100) },
      routineLow: { count: low.length, pct: Math.round((low.length / t) * 100) },
      total: active.length
    };
  }, [patients]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-bold text-primary dark:text-white text-sm">Triage Risk Stratification</h3>
          <p className="text-[10px] text-gray-500 mt-1 max-w-[150px] leading-tight">Automated intake analysis via MedGemma</p>
        </div>
        <div className="text-[10px] font-bold bg-background-light dark:bg-gray-800 rounded-lg py-1.5 px-3 text-gray-600 dark:text-gray-300 shadow-sm">
          {total} Active
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-5 mb-4 px-1">

        {/* Row 1: High Acuity */}
        <div className="space-y-1.5">
          <div className="flex items-end justify-between">
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">High Acuity</span>
            <span className="text-[9px] text-gray-500 font-medium">{highAcuity.pct}% of intake • {highAcuity.count} patient{highAcuity.count !== 1 ? 's' : ''} flagged</span>
          </div>
          <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex shadow-inner">
            <div style={{ width: `${highAcuity.pct}%` }} className="h-full bg-accent transition-all duration-1000 ease-out"></div>
          </div>
        </div>

        {/* Row 2: Moderate Risk */}
        <div className="space-y-1.5">
          <div className="flex items-end justify-between">
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Moderate Risk</span>
            <span className="text-[9px] text-gray-500 font-medium">{moderateRisk.pct}% of intake • {moderateRisk.count} patient{moderateRisk.count !== 1 ? 's' : ''} queued</span>
          </div>
          <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex shadow-inner">
            <div style={{ width: `${moderateRisk.pct}%` }} className="h-full bg-amber-400 transition-all duration-1000 ease-out delay-100"></div>
          </div>
        </div>

        {/* Row 3: Routine / Low */}
        <div className="space-y-1.5">
          <div className="flex items-end justify-between">
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Routine / Low</span>
            <span className="text-[9px] text-gray-500 font-medium">{routineLow.pct}% of intake • {routineLow.count} patient{routineLow.count !== 1 ? 's' : ''} queued</span>
          </div>
          <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex shadow-inner">
            <div style={{ width: `${routineLow.pct}%` }} className="h-full bg-secondary transition-all duration-1000 ease-out delay-200"></div>
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