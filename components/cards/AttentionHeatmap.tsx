import React from 'react';
import { AlertCircle, Clock, Activity, ArrowRight, ActivitySquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AttentionHeatmap() {
    const navigate = useNavigate();

    return (
        <div className="h-full w-full flex flex-col bg-white dark:bg-card-dark rounded-[32px] p-6 lg:p-8 cursor-pointer border border-accent/20 dark:border-accent/10 shadow-[0_0_30px_rgba(254,87,150,0.05)] transition-all hover:shadow-[0_0_40px_rgba(254,87,150,0.1)]" onClick={() => navigate('/workflows')}>
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-extrabold text-[#160527] dark:text-white text-lg lg:text-xl flex items-center gap-3 tracking-tight">
                    <ActivitySquare className="text-accent" strokeWidth={2.5} size={24} />
                    Attention Heatmap
                </h3>
                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                    <ArrowRight size={18} strokeWidth={2.5} />
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-end gap-6 pb-2">
                {/* High Deterioration Risk */}
                <div className="bg-[#FFF4F4] dark:bg-red-950/20 rounded-3xl p-5 border border-red-100 dark:border-red-900/30 flex items-center justify-between relative overflow-hidden">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1.5 bg-[#FF3B30] rounded-r-md"></div>
                    <div className="flex items-center gap-4 pl-3">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-red-900/40 flex items-center justify-center shrink-0 shadow-sm border border-red-50">
                            <AlertCircle className="text-[#FF3B30]" size={20} strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[#0F172A] dark:text-gray-100">High deterioration risk</p>
                            <p className="text-xs text-[#FF3B30] font-medium mt-0.5">Immediate intervention required</p>
                        </div>
                    </div>
                    <div className="text-[28px] font-black text-[#FF3B30] tabular-nums tracking-tighter pr-2">
                        2
                    </div>
                </div>

                {/* AI-Flagged Abnormalities */}
                <div className="bg-[#FFF8F0] dark:bg-orange-950/20 rounded-3xl p-5 border border-orange-100 dark:border-orange-900/30 flex items-center justify-between relative overflow-hidden">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1.5 bg-[#FF9500] rounded-r-md"></div>
                    <div className="flex items-center gap-4 pl-3">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-orange-900/40 flex items-center justify-center shrink-0 shadow-sm border border-orange-50">
                            <Activity className="text-[#FF9500]" size={20} strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[#0F172A] dark:text-gray-100">AI-flagged abnormalities</p>
                            <p className="text-xs text-[#FF9500] font-medium mt-0.5">Pending physician review</p>
                        </div>
                    </div>
                    <div className="text-[28px] font-black text-[#FF9500] tabular-nums tracking-tighter pr-2">
                        6
                    </div>
                </div>

                {/* Patients Awaiting Review */}
                <div className="bg-[#FFFFF0] dark:bg-yellow-950/20 rounded-3xl p-5 border border-yellow-100 dark:border-yellow-900/30 flex items-center justify-between relative overflow-hidden">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1.5 bg-[#FFCC00] rounded-r-md"></div>
                    <div className="flex items-center gap-4 pl-3">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-yellow-900/40 flex items-center justify-center shrink-0 shadow-sm border border-yellow-50">
                            <Clock className="text-[#D4AF37] dark:text-yellow-500" size={20} strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[#0F172A] dark:text-gray-100">Awaiting review &gt; 10 min</p>
                            <p className="text-xs text-[#D4AF37] dark:text-yellow-500 font-medium mt-0.5">SLA threshold approaching</p>
                        </div>
                    </div>
                    <div className="text-[28px] font-black text-[#D4AF37] dark:text-yellow-500 tabular-nums tracking-tighter pr-2">
                        4
                    </div>
                </div>
            </div>
        </div>
    );
}
