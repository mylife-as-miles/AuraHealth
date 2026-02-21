import React, { useMemo, useState, useEffect } from 'react';
import { Activity, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../lib/db';

export default function ClinicalInsights() {
  const patients = useLiveQuery(() => db.patients.toArray()) || [];
  const notifications = useLiveQuery(() => db.notifications.orderBy('timestamp').reverse().toArray()) || [];

  // 1. AI Agent Status: Monitoring X Active Cases
  const activeCasesCount = useMemo(() => patients.filter(p => p.active !== false).length, [patients]);

  // 2. Last autonomous intervention: 3 minutes ago
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  const interventions = useMemo(() => {
    return notifications.filter(n => ['task', 'critical', 'consult', 'system'].includes(n.type));
  }, [notifications]);

  const lastInterventionTime = useMemo(() => {
    if (interventions.length === 0) return 'No recent interventions';
    const last = interventions[0].timestamp;
    const diffMins = Math.floor((now - last) / 60000);
    if (diffMins === 0) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  }, [interventions, now]);

  const escalationsToday = useMemo(() => {
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    return notifications.filter(n =>
      ['critical', 'consult'].includes(n.type) && n.timestamp > oneDayAgo
    ).length;
  }, [notifications, now]);

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-card-dark rounded-3xl border border-accent/20 dark:border-accent/10 shadow-[0_0_30px_rgba(254,87,150,0.05)] overflow-hidden relative">
      {/* Subtle pulsing background gradient for the active AI feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-50 animate-pulse pointer-events-none"></div>

      <div className="p-5 lg:p-6 flex flex-col h-full relative z-10 w-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <h3 className="font-extrabold text-primary dark:text-white text-base lg:text-lg tracking-tight">LIVE AI MONITOR</h3>
          </div>
          <div className="bg-green-500/10 text-green-600 dark:text-green-400 text-[9px] lg:text-[10px] font-bold px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full border border-green-500/20 uppercase tracking-widest flex items-center gap-1">
            <Activity size={12} /> Active
          </div>
        </div>

        {/* Persistent Panel */}
        <div className="bg-background-light dark:bg-gray-800/80 rounded-2xl p-4 lg:p-5 mb-6 border border-gray-100 dark:border-gray-700/50 shadow-inner w-full">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700 w-full">
              <span className="text-[11px] lg:text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <ShieldAlert size={14} className="text-gray-400 flex-shrink-0" />
                AI Agent Status
              </span>
              <span className="text-[11px] lg:text-sm font-bold text-primary dark:text-white text-right">Monitoring {activeCasesCount} Active Cases</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700 w-full">
              <span className="text-[11px] lg:text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Clock size={14} className="text-gray-400 flex-shrink-0" />
                Last autonomous intervention
              </span>
              <span className="text-[11px] lg:text-sm font-bold text-primary dark:text-white text-right">{lastInterventionTime}</span>
            </div>
            <div className="flex justify-between items-center w-full">
              <span className="text-[11px] lg:text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <AlertTriangle size={14} className="text-gray-400 flex-shrink-0" />
                Escalations today
              </span>
              <span className="text-[11px] lg:text-sm font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md text-right">{escalationsToday}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}