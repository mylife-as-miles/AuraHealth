import React, { useMemo } from 'react';
import { ShieldAlert, Stethoscope, Zap, Activity, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../lib/db';

export default function ActiveInterventions() {
    const notifications = useLiveQuery(() => db.notifications.orderBy('timestamp').reverse().toArray()) || [];

    const interventions = useMemo(() => {
        return notifications.filter(n => ['task', 'critical', 'consult', 'system'].includes(n.type));
    }, [notifications]);

    const activeInterventionsList = useMemo(() => {
        return interventions.slice(0, 3);
    }, [interventions]);

    const getInterventionIcon = (type: string) => {
        switch (type) {
            case 'critical': return <ShieldAlert className="w-4 h-4 text-accent" />;
            case 'consult': return <Stethoscope className="w-4 h-4 text-purple-500" />;
            case 'task': return <Zap className="w-4 h-4 text-cyan" />;
            case 'system': return <Activity className="w-4 h-4 text-secondary" />;
            default: return <Activity className="w-4 h-4 text-secondary" />;
        }
    };

    const getInterventionColor = (type: string) => {
        switch (type) {
            case 'critical': return 'border-l-accent';
            case 'consult': return 'border-l-purple-500';
            case 'task': return 'border-l-cyan';
            case 'system': return 'border-l-secondary';
            default: return 'border-l-secondary';
        }
    };

    return (
        <div className="w-full bg-white dark:bg-card-dark rounded-3xl p-5 lg:p-6 flex flex-col justify-between border border-accent/20 dark:border-accent/10 shadow-[0_0_30px_rgba(254,87,150,0.05)]">
            <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                <h4 className="text-[11px] lg:text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Active Interventions</h4>
            </div>

            <div className="space-y-3 flex-1 w-full overflow-hidden">
                {activeInterventionsList.length > 0 ? (
                    activeInterventionsList.map(item => (
                        <div key={item.id} className={`bg-background-light dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 p-3 rounded-xl shadow-inner flex items-start gap-3 border-l-4 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors ${getInterventionColor(item.type)} w-full`}>
                            <div className={`p-1.5 rounded-lg bg-white dark:bg-gray-900 mt-0.5 flex-shrink-0 shadow-sm border border-gray-100 dark:border-gray-800`}>
                                {getInterventionIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h5 className="text-[11px] lg:text-xs font-bold text-primary dark:text-white truncate">{item.title}</h5>
                                <p className="text-[9px] lg:text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight line-clamp-2">{item.content}</p>
                            </div>
                            <ChevronRight size={14} className="text-gray-400 flex-shrink-0 mt-1 hidden sm:block" />
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 min-h-[140px] w-full">
                        <CheckCircle2 size={24} className="text-green-400 mb-2 opacity-50" />
                        <p className="text-[11px] lg:text-xs font-bold text-gray-500 dark:text-gray-400">All systems nominal</p>
                        <p className="text-[9px] lg:text-[10px] text-gray-400 mt-1">No active interventions required at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
