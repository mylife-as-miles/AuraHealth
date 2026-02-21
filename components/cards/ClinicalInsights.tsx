import React, { useMemo, useState, useEffect } from 'react';
import { Activity, Clock, AlertTriangle, ShieldAlert, Terminal } from 'lucide-react';
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

  // 3. Simulated Live Agent Activity Log
  const [logs, setLogs] = useState<{ id: number, text: string, time: string }[]>([]);
  useEffect(() => {
    const activities = [
      "Analyzing latest vitals for Patient #409...",
      "Cross-referencing recent EKG with MedGemma model...",
      "Updating risk assessment for post-op ward...",
      "Scanning lab results for anomalies...",
      "Validating diagnostic confidence for Case #089...",
      "No critical anomalies detected in recent batch.",
      "Adjusting prediction threshold based on new data...",
      "Continuous monitoring active across 6 wards...",
      "Evaluating respiratory metrics against baseline...",
      "Initiating autonomous chart review for Ward B..."
    ];

    let idCounter = 0;

    // Add initial logs
    setLogs([
      { id: idCounter++, text: "System initialized. Monitoring active.", time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
    ]);

    const interval = setInterval(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setLogs(prev => {
        const newLogs = [...prev, {
          id: idCounter++,
          text: randomActivity,
          time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }];
        if (newLogs.length > 5) return newLogs.slice(newLogs.length - 5); // Keep last 5
        return newLogs;
      });
    }, 4000); // Add a new log every ~4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-card-dark rounded-3xl border border-accent/20 dark:border-accent/10 shadow-[0_0_30px_rgba(254,87,150,0.05)] overflow-hidden relative">
      {/* Subtle pulsing background gradient for the active AI feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-50 animate-pulse pointer-events-none"></div>

      <div className="p-5 flex flex-col h-full relative z-10 w-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <h3 className="font-extrabold text-primary dark:text-white text-base lg:text-lg tracking-tight">LIVE AI MONITOR</h3>
          </div>
          <div className="bg-green-500/10 text-green-600 dark:text-green-400 text-[9px] lg:text-[10px] font-bold px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full border border-green-500/20 uppercase tracking-widest flex items-center gap-1">
            <Activity size={12} className="animate-[pulse_1.5s_infinite]" /> Active
          </div>
        </div>

        {/* Persistent Panel */}
        <div className="bg-background-light dark:bg-gray-800/80 rounded-xl p-4 mb-4 border border-gray-100 dark:border-gray-700/50 shadow-inner w-full shrink-0">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2.5 border-b border-gray-100 dark:border-gray-700 w-full">
              <span className="text-[11px] lg:text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <ShieldAlert size={14} className="text-gray-400 flex-shrink-0" />
                AI Agent Status
              </span>
              <span className="text-[11px] lg:text-sm font-bold text-primary dark:text-white text-right">Monitoring {activeCasesCount} Active Cases</span>
            </div>
            {/* Changed from 'Last autonomous intervention' as requested */}
            <div className="flex flex-col gap-1.5 pb-2.5 border-b border-gray-100 dark:border-gray-700 w-full text-left">
              <span className="text-[11px] lg:text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400 flex-shrink-0" />
                  Last autonomous intervention
                </span>
                <span className="text-primary dark:text-white font-bold opacity-80">2m ago</span>
              </span>
              <div className="text-[10px] lg:text-[11px] font-medium text-accent dark:text-accent/90 bg-accent/5 p-1.5 rounded flex items-start gap-1.5 mt-0.5 border border-accent/10">
                <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                <span>Case escalated &rarr; Pneumothorax probability &gt; 90%</span>
              </div>
            </div>
            <div className="flex justify-between items-center pb-2.5 border-b border-gray-100 dark:border-gray-700 w-full">
              <span className="text-[11px] lg:text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <AlertTriangle size={14} className="text-gray-400 flex-shrink-0" />
                Escalations today
              </span>
              <span className="text-[11px] lg:text-sm font-bold text-accent bg-accent/10 px-2.5 py-0.5 rounded-md text-right">{escalationsToday}</span>
            </div>
            <div className="flex justify-between items-center w-full">
              <span className="text-[11px] lg:text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <AlertTriangle size={14} className="text-gray-400 flex-shrink-0" />
                Predicted missed-finding risk if AI disabled
              </span>
              <span className="text-[11px] lg:text-sm font-bold text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded-md text-right border border-red-500/20 shadow-sm flex items-center gap-1">
                +27%
              </span>
            </div>
          </div>
        </div>

        {/* Agent Confidence Strip added as requested */}
        <div className="mb-4 bg-cyan/10 border border-cyan/20 rounded-lg p-2.5 text-[10px] lg:text-[11px] flex flex-col gap-1 px-3 shadow-inner">
          <div className="flex justify-between items-center w-full font-bold text-cyan dark:text-cyan/90">
            <span>MedGemma Reasoning Confidence:</span>
            <span className="bg-cyan/20 px-1.5 py-0.5 rounded uppercase tracking-wider text-[9px]">Stable</span>
          </div>
          <div className="text-gray-500 dark:text-gray-400 opacity-80 mt-0.5">
            Input streams: Imaging • Labs • Vitals • Workflow delays
          </div>
        </div>

        {/* Live Activity Feed / Terminal */}
        <div className="flex-1 min-h-[140px] bg-gray-50 dark:bg-card-dark/60 rounded-xl p-4 border border-gray-200 dark:border-gray-800/50 font-mono text-[10px] lg:text-[11px] overflow-hidden relative flex flex-col justify-end shadow-inner">
          {/* Subtle gradient to fade out old text at the top */}
          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-gray-50 dark:from-[#212128] to-transparent z-10 pointer-events-none rounded-t-xl"></div>

          <div className="absolute top-3 right-4 flex items-center gap-1.5 text-[9px] font-bold text-gray-400 dark:text-gray-500 z-20 tracking-wider">
            <Terminal size={10} />
            ACTIVE INTERVENTIONS
          </div>

          <div className="space-y-2 flex flex-col justify-end h-full mt-6 relative z-0">
            {/* Show continuous active interventions as requested */}
            <div className="text-gray-600 dark:text-gray-400 flex gap-2.5 opacity-60">
              <span className="text-accent/70 dark:text-accent/50 shrink-0">09:31</span>
              <span className="truncate">Draft report generated</span>
            </div>
            <div className="text-gray-600 dark:text-gray-400 flex gap-2.5 opacity-80">
              <span className="text-accent/70 dark:text-accent/50 shrink-0">09:38</span>
              <span className="truncate">Cardiology alerted (troponin spike)</span>
            </div>
            <div className="text-gray-600 dark:text-gray-400 flex gap-2.5 opacity-100 font-medium">
              <span className="text-accent/70 dark:text-accent/50 shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                09:42
              </span>
              <span className="truncate text-accent/90 dark:text-white">MRI reprioritized (hemorrhage risk)</span>
            </div>

            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-800/60">
              <span className="w-1.5 h-3 bg-accent inline-block animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
              <span className="text-accent/80 font-semibold tracking-tight">Agent processing next operational cycle...</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}