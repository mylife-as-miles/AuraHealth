import React, { useState, useEffect } from 'react';
import { MoreHorizontal, TrendingUp } from 'lucide-react';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../lib/db';
import { Patient } from '../../lib/types';

type Period = 'Today' | 'This Week' | 'This Month';

const useAnimatedNumber = (target: number, duration = 600) => {
  const [value, setValue] = useState(target);
  useEffect(() => {
    let start: number | null = null;
    const from = value;
    const diff = target - from;
    if (diff === 0) return;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.round(from + diff * progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return value;
};

const StatBox = ({ label, value, trend, trendColor }: { label: string, value: string, trend: string, trendColor: 'secondary' | 'cyan' }) => (
  <div className="flex-1 p-4 rounded-2xl bg-background-light dark:bg-gray-800/50 border border-transparent dark:border-border-dark">
    <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
    <div className="flex items-baseline gap-2">
      <h4 className="text-2xl font-bold text-primary dark:text-white tracking-tight">{value}</h4>
      <span className={`text-xs font-bold flex items-center px-1.5 py-0.5 rounded ${trendColor === 'secondary' ? 'text-secondary bg-secondary/10' : 'text-cyan bg-cyan/10'
        }`}>
        {trendColor === 'secondary' && <TrendingUp className="w-3 h-3 mr-0.5" />}
        {trend}
      </span>
    </div>
  </div>
);

const ProgressBar = ({ label, percentage, color }: { label: string, percentage: number, color: string }) => (
  <div>
    <div className="flex justify-between text-xs font-bold mb-2">
      <span className="text-gray-600 dark:text-gray-300">{label}</span>
      <span className="text-primary dark:text-white">{percentage}% Capacity</span>
    </div>
    <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      ></div>
    </div>
  </div>
);

export default function ClinicalInsights() {
  const [period, setPeriod] = useState<Period>('This Week');
  const [showMenu, setShowMenu] = useState(false);

  const patients = useLiveQuery(() => db.patients.toArray()) || [];

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = patients.length || 1;
    const active = patients.filter(p => p.active).length;
    const stable = patients.filter(p => p.risk === 'Low Risk').length;

    // Simple keyword matching for demo purposes
    const cardio = patients.filter(p => /heart|arythmia|cardio|hyper/i.test(p.condition)).length;
    const neuro = patients.filter(p => /neuro|brain|migraine|seizure|epilepsy/i.test(p.condition)).length;

    // Mock trends based on period for visual variety
    const trendMult = period === 'Today' ? 0.2 : period === 'This Week' ? 1 : 4;

    return {
      activeCases: active,
      activeTrend: active > 0 ? `+${Math.round(active * 0.1 * trendMult)}%` : '0%',
      recoveryRate: Math.round((stable / total) * 100),
      recoveryTrend: `+${(1.2 * trendMult).toFixed(1)}%`,
      cardiology: Math.round((cardio / total) * 100),
      neurology: Math.round((neuro / total) * 100)
    };
  }, [patients, period]);

  const animatedCases = useAnimatedNumber(stats.activeCases);
  const animatedRecovery = useAnimatedNumber(stats.recoveryRate);
  const animatedCardio = useAnimatedNumber(stats.cardiology);
  const animatedNeuro = useAnimatedNumber(stats.neurology);

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-primary dark:text-white text-lg">Clinical Insights</h3>
          <p className="text-xs text-gray-500 font-medium mt-1">MedGemma Model Analysis</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Period Selector */}
          <div className="flex bg-background-light dark:bg-gray-800 rounded-lg p-0.5">
            {(['Today', 'This Week', 'This Month'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all duration-200 ${period === p
                  ? 'bg-white dark:bg-gray-700 text-primary dark:text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <MoreHorizontal className="text-gray-400 w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-20 py-1 w-40">
                <button onClick={() => setShowMenu(false)} className="w-full text-left px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  View Full Report
                </button>
                <button onClick={() => setShowMenu(false)} className="w-full text-left px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Export Data
                </button>
                <button onClick={() => setShowMenu(false)} className="w-full text-left px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Configure Alerts
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <StatBox label="Active Cases" value={String(animatedCases)} trend={stats.activeTrend} trendColor="secondary" />
        <StatBox label="Recovery Rate" value={`${animatedRecovery}%`} trend={stats.recoveryTrend} trendColor="cyan" />
      </div>

      <div className="space-y-5">
        <ProgressBar label="Cardiology Ward" percentage={animatedCardio} color="#FE5796" />
        <ProgressBar label="Neurology Ward" percentage={animatedNeuro} color="#54E097" />
      </div>
    </div>
  );
}