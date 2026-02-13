import React, { useState } from 'react';
import { 
  Bell, 
  Activity, 
  ClipboardCheck, 
  RefreshCw, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Filter, 
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';

export default function Notifications() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pr-2">
      <div className="bg-white/60 dark:bg-card-dark/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-soft border border-white/20 dark:border-white/5 flex flex-col min-h-[600px]">
        
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="text-sm font-semibold text-gray-500 mr-2">Filter by:</span>
          
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === 'all' 
                ? 'bg-primary text-white shadow-md shadow-primary/20 hover:scale-105' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          
          <button 
            onClick={() => setFilter('unread')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
              filter === 'unread' 
                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Unread <span className="bg-accent/20 text-accent px-1.5 py-0.5 rounded-full text-[10px] leading-none">3</span>
          </button>
          
          <button 
            onClick={() => setFilter('critical')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
              filter === 'critical' 
                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-accent"></span> Critical
          </button>
          
          <button 
            onClick={() => setFilter('tasks')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
              filter === 'tasks' 
                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan"></span> Tasks
          </button>

          <button className="ml-auto text-gray-400 hover:text-primary dark:hover:text-white transition-colors">
            <Filter size={18} />
          </button>
        </div>

        <div className="space-y-8">
          
          {/* Section: Today */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Today</h4>
            <div className="space-y-4">
              
              {/* Critical Alert */}
              <div className="bg-white dark:bg-card-dark rounded-2xl p-5 border border-red-100 dark:border-red-900/30 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent"></div>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent">
                    <Activity size={24} />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-primary dark:text-white text-base">Critical finding in Patient #402 chest X-ray</h5>
                      <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full font-bold">10:42 AM</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      MedGemma AI has detected a potential pneumothorax with <span className="font-bold text-primary dark:text-white">94% confidence</span>. Immediate review required.
                    </p>
                    <div className="flex items-center gap-3">
                      <button className="bg-accent text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">
                        Review Case
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold px-2 py-1 transition-colors">
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task/Report Alert */}
              <div className="bg-white dark:bg-card-dark rounded-2xl p-5 border border-cyan-100 dark:border-cyan-900/30 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-cyan"></div>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="w-12 h-12 rounded-full bg-cyan/10 flex items-center justify-center flex-shrink-0 text-cyan-600 dark:text-cyan">
                    <ClipboardCheck size={24} />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-primary dark:text-white text-base">New diagnostic report ready for review</h5>
                      <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full font-bold">09:15 AM</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      Lab results for Patient #883 (Sarah Jenkins) have been processed. HAI-DEF analysis suggests adjusting medication dosage.
                    </p>
                    <div className="flex items-center gap-3">
                      <button className="bg-cyan/10 text-cyan-700 dark:text-cyan px-5 py-2 rounded-full text-xs font-bold hover:bg-cyan/20 transition-colors border border-cyan/20">
                        Open Report
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold px-2 py-1 transition-colors">
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section: Yesterday */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2 mt-8">Yesterday</h4>
            <div className="space-y-4">
              
              {/* System Update */}
              <div className="bg-white dark:bg-card-dark rounded-2xl p-5 border border-green-100 dark:border-green-900/30 shadow-sm relative overflow-hidden group hover:shadow-md transition-all opacity-90 hover:opacity-100">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary"></div>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 text-secondary">
                    <RefreshCw size={24} />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-primary dark:text-white text-base">System Maintenance Complete</h5>
                      <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full font-bold">Yesterday, 11:30 PM</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      MedGemma models updated to v2.1. Improved accuracy for radiology scans and faster processing times now active.
                    </p>
                    <div className="flex items-center gap-3">
                      <button className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        View Changelog
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation Request */}
              <div className="bg-white dark:bg-card-dark rounded-2xl p-5 border border-border-light dark:border-border-dark shadow-sm relative overflow-hidden group hover:shadow-md transition-all opacity-80 hover:opacity-100">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 text-gray-400">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-gray-600 dark:text-gray-400 text-base">Consultation Request: Dr. Ray</h5>
                      <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full font-bold">Yesterday, 02:15 PM</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                      Request for second opinion on neuro-oncology case #119. Attached MRI scans and patient history.
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-green-500 font-bold flex items-center gap-1">
                        <CheckCircle size={14} /> Completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        <div className="mt-12 text-center pb-4">
          <button className="text-sm text-gray-500 hover:text-primary dark:hover:text-white font-bold transition-colors flex items-center justify-center gap-2 mx-auto px-6 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
             Load earlier notifications
             <ChevronDown size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}