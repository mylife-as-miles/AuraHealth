import React from 'react';
import { AlertCircle, Clock, Activity, ArrowRight, ActivitySquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AttentionHeatmap() {
    const navigate = useNavigate();

    return (
        <div className="h-full w-full flex flex-col bg-white dark:bg-card-dark rounded-3xl group cursor-pointer" onClick={() => navigate('/workflows')}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold text-primary dark:text-white text-base lg:text-lg flex items-center gap-2">
                    <ActivitySquare className="text-accent" size={20} />
                    Attention Heatmap
                </h3>
                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                    <ArrowRight size={16} />
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-4">
                {/* High Deterioration Risk */}
                <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl p-4 border border-red-100 dark:border-red-900/30 flex items-center justify-between relative overflow-hidden transition-all hover:shadow-md">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                            <AlertCircle className="text-red-500" size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">High deterioration risk</p>
                            <p className="text-xs text-red-500 font-medium">Immediate intervention required</p>
                        </div>
                    </div>
                    <div className="text-2xl font-black text-red-500 tabular-nums tracking-tighter">
                        2
                    </div>
                </div>

                {/* AI-Flagged Abnormalities */}
                <div className="bg-orange-50 dark:bg-orange-950/20 rounded-2xl p-4 border border-orange-100 dark:border-orange-900/30 flex items-center justify-between relative overflow-hidden transition-all hover:shadow-md">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center shrink-0">
                            <Activity className="text-orange-500" size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">AI-flagged abnormalities</p>
                            <p className="text-xs text-orange-500 font-medium">Pending physician review</p>
                        </div>
                    </div>
                    <div className="text-2xl font-black text-orange-500 tabular-nums tracking-tighter">
                        6
                    </div>
                </div>

                {/* Patients Awaiting Review */}
                <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-2xl p-4 border border-yellow-100 dark:border-yellow-900/30 flex items-center justify-between relative overflow-hidden transition-all hover:shadow-md">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center shrink-0">
                            <Clock className="text-yellow-600 dark:text-yellow-500" size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Awaiting review &gt; 10 min</p>
                            <p className="text-xs text-yellow-600 dark:text-yellow-500 font-medium">SLA threshold approaching</p>
                        </div>
                    </div>
                    <div className="text-2xl font-black text-yellow-600 dark:text-yellow-500 tabular-nums tracking-tighter">
                        4
                    </div>
                </div>
            </div>
        </div>
    );
}
