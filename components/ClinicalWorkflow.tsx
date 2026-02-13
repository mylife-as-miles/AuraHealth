import React from 'react';
import { 
  MoreHorizontal, 
  Plus, 
  MoreVertical, 
  Clock, 
  ImageOff, 
  RefreshCw, 
  Video, 
  Sparkles, 
  X, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  Edit3,
  Stethoscope,
  ClipboardList,
  ChevronRight
} from 'lucide-react';

export default function ClinicalWorkflow() {
  return (
    <div className="flex h-full overflow-hidden flex-col">
      {/* Main Board Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col h-full overflow-hidden pr-0 lg:pr-4">
          
          {/* Kanban Columns */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
            <div className="flex h-full gap-4 md:gap-6 min-w-[1000px] px-1">
              
              {/* Column 1: Pending Review */}
              <div className="flex-1 flex flex-col min-w-[260px] md:min-w-[280px]">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    Pending Review
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-bold">4</span>
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar pb-10">
                  
                  {/* Card 1 - URGENT HIGHLIGHT */}
                  <div className="bg-white dark:bg-card-dark p-4 rounded-2xl shadow-[0_0_15px_rgba(254,87,150,0.2)] dark:shadow-[0_0_15px_rgba(254,87,150,0.1)] ring-1 ring-accent/40 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent"></div>
                    <div className="flex justify-between items-start mb-3 pl-2">
                      <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 animate-pulse">
                        <AlertCircle size={10} /> Urgent
                      </span>
                      <button className="text-gray-400 hover:text-primary dark:hover:text-white">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mb-3 pl-2">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <img alt="Patient" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100"/>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary dark:text-white text-sm">Eleanor Pena</h4>
                        <p className="text-xs text-gray-500">Age: 64 • F</p>
                      </div>
                    </div>
                    <div className="bg-background-light dark:bg-background-dark rounded-xl p-2 mb-3 flex items-center gap-3 ml-2">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          <img alt="Scan" className="w-full h-full object-cover opacity-80" src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=100&h=100"/>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Latest Scan</p>
                        <p className="text-xs font-bold text-primary dark:text-white">CT Thorax w/contrast</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-white/5 pl-2">
                      <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                        <Clock size={10} /> 12m ago
                      </span>
                      <div className="flex -space-x-1.5">
                        <img alt="Doc" className="w-5 h-5 rounded-full border border-white dark:border-card-dark" src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&h=100"/>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white dark:bg-card-dark p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group border border-transparent hover:border-border-light dark:hover:border-border-dark relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
                    <div className="flex justify-between items-start mb-3 pl-2">
                      <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                        Stable
                      </span>
                      <button className="text-gray-400 hover:text-primary dark:hover:text-white">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mb-3 pl-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">JM</div>
                      <div>
                        <h4 className="font-bold text-primary dark:text-white text-sm">Jerome Bell</h4>
                        <p className="text-xs text-gray-500">Age: 42 • M</p>
                      </div>
                    </div>
                    <div className="bg-background-light dark:bg-background-dark rounded-xl p-2 mb-3 flex items-center gap-3 ml-2">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                        <ImageOff size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Latest Scan</p>
                        <p className="text-xs font-bold text-primary dark:text-white">Pending Upload</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Column 2: Analysis in Progress */}
              <div className="flex-1 flex flex-col min-w-[260px] md:min-w-[280px]">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan"></span>
                    Analysis in Progress
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-bold">2</span>
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar pb-10">
                  
                  {/* Active Analysis Card - AI HIGHLIGHT */}
                  <div className="bg-white dark:bg-card-dark p-4 rounded-2xl shadow-[0_0_15px_rgba(20,245,214,0.15)] ring-1 ring-cyan/40 cursor-pointer group border-l-4 border-l-cyan relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-1.5">
                          <span className="flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan"></span>
                          </span>
                      </div>
                      <div className="flex justify-between items-start mb-3">
                          <span className="bg-cyan/10 text-cyan-700 dark:text-cyan text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <RefreshCw size={10} className="animate-spin" /> AI Analyzing
                          </span>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">JW</div>
                          <div>
                          <h4 className="font-bold text-primary dark:text-white text-sm">Jenny Wilson</h4>
                          <p className="text-xs text-gray-500">Age: 28 • F</p>
                          </div>
                      </div>
                      <div className="bg-background-light dark:bg-background-dark rounded-xl p-2.5 mb-3">
                          <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1.5">
                          <span>MedGemma Processing</span>
                          <span className="text-cyan-700 dark:text-cyan">78%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan w-[78%] rounded-full shadow-[0_0_8px_rgba(20,245,214,0.6)] animate-pulse"></div>
                          </div>
                      </div>
                      <div className="flex gap-2">
                          <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-[10px] font-bold text-gray-500 dark:text-gray-400">MRI</span>
                          <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-[10px] font-bold text-gray-500 dark:text-gray-400">Neuro</span>
                      </div>
                  </div>

                </div>
              </div>

              {/* Column 3: Consultation */}
              <div className="flex-1 flex flex-col min-w-[260px] md:min-w-[280px]">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    Consultation
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-bold">1</span>
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar pb-10">
                  
                  <div className="bg-white dark:bg-card-dark p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group border border-transparent hover:border-border-light dark:hover:border-border-dark relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
                    <div className="flex justify-between items-start mb-3 pl-2">
                      <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                        Stable
                      </span>
                      <button className="text-gray-400 hover:text-primary dark:hover:text-white">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mb-3 pl-2">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                        <img alt="Patient" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100"/>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary dark:text-white text-sm">Robert Fox</h4>
                        <p className="text-xs text-gray-500">Age: 55 • M</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg p-2.5 text-xs mb-3 flex items-start gap-2 ml-2 font-medium">
                      <Video size={14} className="mt-0.5" />
                      <span>Virtual consultation scheduled for 2:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-white/5 pl-2">
                      <span className="text-[10px] text-gray-400 font-medium">Dr. Williamson</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Column 4: Treatment Plan */}
              <div className="flex-1 flex flex-col min-w-[260px] md:min-w-[280px]">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Treatment Plan
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-bold">3</span>
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar pb-10">
                  
                  <div className="bg-white dark:bg-card-dark p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group border border-transparent hover:border-border-light dark:hover:border-border-dark relative overflow-hidden opacity-75 hover:opacity-100">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>
                    <div className="flex justify-between items-start mb-3 pl-2">
                      <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                        Follow Up
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-2 pl-2">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-xs">CF</div>
                      <div>
                        <h4 className="font-bold text-primary dark:text-white text-sm">Cody Fisher</h4>
                        <p className="text-xs text-gray-500">Age: 19 • M</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Assistant Side Panel - Stack below on mobile, side on lg */}
        <aside className="w-full lg:w-80 bg-white/60 dark:bg-card-dark/60 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-border-light dark:border-border-dark flex flex-col transition-all duration-300 lg:rounded-l-3xl shadow-2xl z-10 h-[400px] lg:h-full flex-shrink-0">
          <div className="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-between sticky top-0 bg-white/50 dark:bg-card-dark/50 backdrop-blur-md z-10">
            <div className="flex items-center gap-2 text-primary dark:text-white">
              <Sparkles size={18} className="text-cyan" />
              <h3 className="font-bold text-sm">Workflow Assistant</h3>
            </div>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              
              {/* Selected Patient Mini-View */}
              <div className="mb-6">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Selected Patient</p>
                  <div className="bg-white dark:bg-card-dark rounded-xl p-3 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">JW</div>
                      <div>
                          <h4 className="font-bold text-primary dark:text-white text-sm">Jenny Wilson</h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></span>
                              <p className="text-xs text-gray-500 font-medium">Analysis in Progress</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* AI Recommendations */}
              <div className="space-y-4 mb-8">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">AI Recommended Actions</p>
                  
                  <div className="bg-gradient-to-br from-white to-background-light dark:from-card-dark dark:to-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex items-start gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                              <AlertCircle size={16} />
                          </div>
                          <div>
                              <h5 className="font-bold text-sm text-primary dark:text-white">Flag for Specialist</h5>
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">MedGemma detected anomalies in the parietal lobe. Recommend immediate Neuro consult.</p>
                          </div>
                      </div>
                      <button className="w-full mt-2 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-xs font-bold text-gray-600 dark:text-gray-200 hover:bg-accent hover:text-white hover:border-accent dark:hover:bg-accent transition-colors shadow-sm">
                          Flag Now
                      </button>
                  </div>

                  <div className="bg-gradient-to-br from-white to-background-light dark:from-card-dark dark:to-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex items-start gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                              <FileText size={16} />
                          </div>
                          <div>
                              <h5 className="font-bold text-sm text-primary dark:text-white">Draft Report</h5>
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">Automate preliminary diagnostic report based on MRI scan analysis.</p>
                          </div>
                      </div>
                      <button className="w-full mt-2 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-xs font-bold text-gray-600 dark:text-gray-200 hover:bg-secondary hover:text-white hover:border-secondary dark:hover:bg-secondary transition-colors shadow-sm">
                          Generate Draft
                      </button>
                  </div>
              </div>

               {/* AI Recommended Next Steps */}
                <div className="mb-8">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Suggested Next Steps</p>
                    <div className="space-y-2">
                        <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 hover:border-secondary hover:shadow-sm transition-all group text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                                    <Stethoscope size={16} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-primary dark:text-white group-hover:text-secondary transition-colors">Schedule Echo</div>
                                    <div className="text-[10px] text-gray-500">Neuro Consult Pending</div>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-gray-400 group-hover:text-secondary transition-colors" />
                        </button>
                        
                        <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 hover:border-cyan hover:shadow-sm transition-all group text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-cyan/10 text-cyan-600 dark:text-cyan flex items-center justify-center">
                                    <ClipboardList size={16} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-primary dark:text-white group-hover:text-cyan transition-colors">Review Vitals History</div>
                                    <div className="text-[10px] text-gray-500">Anomaly detected in last 4h</div>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-gray-400 group-hover:text-cyan transition-colors" />
                        </button>
                    </div>
                </div>

              {/* Quick Actions */}
              <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-3">
                      <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 hover:border-cyan/50 hover:shadow-glow transition-all group">
                          <ArrowRight size={20} className="text-cyan group-hover:translate-x-1 transition-transform" />
                          <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Move Next</span>
                      </button>
                      <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 hover:border-accent/50 hover:shadow-soft transition-all group">
                          <Edit3 size={20} className="text-accent group-hover:-translate-y-1 transition-transform" />
                          <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Quick Note</span>
                      </button>
                  </div>
              </div>

          </div>
        </aside>
      </div>
    </div>
  );
}