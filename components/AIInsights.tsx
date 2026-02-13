import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Download, 
  ArrowUp, 
  Cpu, 
  Network, 
  AlertTriangle, 
  Activity, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  FileText,
  Info,
  X
} from 'lucide-react';
import { 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine
} from 'recharts';

// Mock Data for the main chart including projections
const diseaseData = [
  { month: 'Jan', cardio: 30, resp: 45, viral: 20, neuro: 65, isProjection: false },
  { month: 'Feb', cardio: 40, resp: 35, viral: 25, neuro: 62, isProjection: false },
  { month: 'Mar', cardio: 35, resp: 55, viral: 35, neuro: 60, isProjection: false },
  { month: 'Apr', cardio: 80, resp: 50, viral: 45, neuro: 58, isProjection: false },
  { month: 'May', cardio: 60, resp: 30, viral: 20, neuro: 63, isProjection: false },
  { month: 'Jun', cardio: 70, resp: 25, viral: 60, neuro: 68, isProjection: false },
  // Projected Data
  { month: 'Jul (Proj)', cardio: 85, resp: 20, viral: 15, neuro: 70, isProjection: true },
  { month: 'Aug (Proj)', cardio: 90, resp: 15, viral: 10, neuro: 72, isProjection: true },
];

export default function AIInsights() {
  const [showExplainabilityModal, setShowExplainabilityModal] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pr-2 relative">
      {/* Header */}
      <header className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-6 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-1">Population Analytics</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">AI-driven insights powered by MedGemma & HAI-DEF</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark text-sm font-semibold text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-soft">
            <SlidersHorizontal size={18} />
            Model Settings
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            <Download size={18} />
            Export Report
          </button>
          <div className="h-8 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1 hidden xl:block"></div>
          <div className="flex items-center gap-3 pl-2 cursor-pointer">
            <img 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-card-dark shadow-sm" 
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&h=100" 
            />
            <div className="hidden xl:block">
              <p className="text-sm font-bold text-primary dark:text-white leading-tight">Dr. Williamson</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Lead Data Scientist</p>
            </div>
          </div>
        </div>
      </header>

      {/* Top Section Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        
        {/* Disease Prevalence Chart */}
        <div className="xl:col-span-2 bg-card-light dark:bg-card-dark rounded-3xl p-6 shadow-soft border border-transparent dark:border-border-dark flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-primary dark:text-white text-lg">Disease Prevalence Trends</h3>
              <p className="text-xs text-gray-500 mt-1">Comparative analysis including AI projections</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center text-[10px] text-gray-500 font-medium"><span className="w-2 h-2 rounded-full bg-accent mr-1.5"></span>Cardio</span>
              <span className="flex items-center text-[10px] text-gray-500 font-medium"><span className="w-2 h-2 rounded-full bg-secondary mr-1.5"></span>Respiratory</span>
              <span className="flex items-center text-[10px] text-gray-500 font-medium"><span className="w-2 h-2 rounded-full bg-cyan mr-1.5"></span>Viral</span>
              <span className="flex items-center text-[10px] text-gray-500 font-medium"><span className="w-2 h-2 rounded-full bg-primary mr-1.5"></span>Neuro</span>
              <span className="flex items-center text-[10px] text-gray-400 font-medium ml-2 border-l pl-2 border-gray-300"><span className="w-3 h-0.5 border-t border-dashed border-gray-400 mr-1.5"></span>Projection</span>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={diseaseData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCardio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FE5796" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FE5796" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }} 
                  dy={10}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                
                {/* Historical Data Lines */}
                <Line 
                  type="monotone" 
                  dataKey="neuro" 
                  stroke="#160527" 
                  strokeOpacity={0.2} 
                  strokeWidth={2} 
                  dot={false} 
                  strokeDasharray="0"
                />
                 <Line 
                  type="monotone" 
                  dataKey="resp" 
                  stroke="#54E097" 
                  strokeWidth={3} 
                  dot={false}
                   strokeDasharray="0"
                />
                <Line 
                  type="monotone" 
                  dataKey="viral" 
                  stroke="#14F5D6" 
                  strokeDasharray="5 5" 
                  strokeWidth={3} 
                  dot={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="cardio" 
                  stroke="#FE5796" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorCardio)" 
                />

                {/* Vertical Line separating historical from projection */}
                <ReferenceLine x="Jun" stroke="#9ca3af" strokeDasharray="3 3" label={{ position: 'top',  value: 'Now', fill: '#9ca3af', fontSize: 10 }} />

                {/* Custom Annotation simulating the popup */}
                <ReferenceDot x="Apr" y={80} r={5} fill="#FE5796" stroke="white" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
             {/* HTML Overlay for the specific tooltip style in design */}
             <div className="absolute top-[20%] left-[35%] bg-white dark:bg-card-dark p-3 rounded-xl shadow-xl border border-border-light dark:border-border-dark animate-bounce pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  <span className="text-xs font-bold text-primary dark:text-white">Cardio Spike</span>
                </div>
                <p className="text-[10px] text-gray-500">+14% vs last month</p>
              </div>
          </div>
        </div>

        {/* Right Column Stack */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* Model Accuracy Card */}
          <div className="bg-primary rounded-3xl p-6 text-white relative overflow-hidden flex-1 flex flex-col justify-between min-h-[220px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-20 blur-3xl rounded-full transform translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary opacity-20 blur-3xl rounded-full transform -translate-x-10 translate-y-10"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">Model Accuracy</h3>
                  <p className="text-xs text-gray-300">MedGemma Performance</p>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => setShowExplainabilityModal(true)}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-1.5 rounded-lg border border-white/10 transition-colors"
                    title="How predictions work"
                   >
                     <Info size={14} className="text-white" />
                   </button>
                   <span className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-mono border border-white/10 flex items-center">LIVE</span>
                </div>
              </div>
              
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold">98.4%</span>
                <span className="text-secondary text-sm font-semibold mb-1 flex items-center">
                  <ArrowUp size={14} /> 0.2%
                </span>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-1.5 mb-6">
                <div className="bg-secondary h-1.5 rounded-full shadow-[0_0_10px_rgba(84,224,151,0.5)]" style={{ width: '98.4%' }}></div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-white/10 rounded-lg">
                      <Cpu size={14} className="text-cyan" />
                    </span>
                    <div className="text-sm">
                      <div className="font-medium text-xs">HAI-DEF Core</div>
                      <div className="text-[10px] text-gray-400">Inference Time: 12ms</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-cyan">99.1%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-white/10 rounded-lg">
                      <Network size={14} className="text-accent" />
                    </span>
                    <div className="text-sm">
                      <div className="font-medium text-xs">Population Cluster</div>
                      <div className="text-[10px] text-gray-400">Inference Time: 45ms</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-accent">96.8%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Prediction Alert Card */}
          <div className="bg-white dark:bg-card-dark rounded-3xl p-6 shadow-soft border border-transparent dark:border-border-dark">
            <h3 className="font-bold text-primary dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="text-accent" size={20} />
              Prediction Alert
            </h3>
            <div className="bg-background-light dark:bg-background-dark p-4 rounded-xl border-l-4 border-accent mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-primary dark:text-white">Ward 4B (Pediatrics)</span>
                <span className="text-[10px] font-bold text-accent">+22% Risk</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-tight">Projected spike in RSV cases over next 72 hours based on community transmission data.</p>
            </div>
            <button className="w-full py-2.5 border border-border-light dark:border-border-dark rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              View Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        
        {/* Geographic Health Insights */}
        <div className="lg:col-span-2 bg-card-light dark:bg-card-dark rounded-3xl p-6 shadow-soft border border-transparent dark:border-border-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-primary dark:text-white">Geographic Health Insights</h3>
            <div className="flex gap-2 bg-background-light dark:bg-background-dark p-1 rounded-full">
              <button className="px-3 py-1 rounded-full bg-white dark:bg-card-dark shadow-sm text-xs font-bold text-primary dark:text-white">City View</button>
              <button className="px-3 py-1 rounded-full text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">Regional</button>
            </div>
          </div>
          
          <div className="relative h-64 w-full bg-background-light dark:bg-gray-800 rounded-2xl overflow-hidden group border border-border-light dark:border-border-dark">
            {/* Map Background Pattern */}
            <div className="absolute inset-0 opacity-30 dark:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/map-cubes.png')]"></div>
            
            {/* Heatmap Blobs */}
            <div className="absolute top-[30%] left-[20%] w-32 h-32 bg-secondary rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
            <div className="absolute top-[60%] left-[60%] w-40 h-40 bg-accent rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-[20%] right-[20%] w-24 h-24 bg-cyan rounded-full filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            
            {/* Interactive Pins */}
            <div className="absolute top-[35%] left-[22%] group/pin cursor-pointer">
              <div className="w-3 h-3 bg-secondary rounded-full ring-4 ring-secondary/20 group-hover/pin:scale-125 transition-transform"></div>
              <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white dark:bg-card-dark px-2 py-1 rounded shadow-lg text-[10px] font-bold whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity z-10">
                 Low Risk Zone
              </div>
            </div>

            <div className="absolute top-[65%] left-[62%] group/pin cursor-pointer">
              <div className="w-4 h-4 bg-accent rounded-full ring-4 ring-accent/20 animate-ping absolute opacity-75"></div>
              <div className="w-4 h-4 bg-accent rounded-full relative group-hover/pin:scale-125 transition-transform"></div>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-card-dark px-2 py-1 rounded shadow-lg text-[10px] font-bold text-accent whitespace-nowrap z-10">
                 High Concentration
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-6 overflow-x-auto pb-2">
            <div className="flex items-center gap-3 min-w-max p-2 rounded-xl hover:bg-background-light dark:hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase font-bold">Low Risk Zones</div>
                <div className="font-bold text-sm text-primary dark:text-white">North, West Districts</div>
              </div>
            </div>
            <div className="flex items-center gap-3 min-w-max p-2 rounded-xl hover:bg-background-light dark:hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Flame size={20} />
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase font-bold">Hotspots</div>
                <div className="font-bold text-sm text-primary dark:text-white">Downtown, East Side</div>
              </div>
            </div>
          </div>
        </div>

        {/* System Notifications */}
        <div className="lg:col-span-1 bg-white dark:bg-card-dark rounded-3xl p-6 shadow-soft border border-transparent dark:border-border-dark flex flex-col">
          <h3 className="font-bold text-primary dark:text-white mb-4">System Notifications</h3>
          <div className="space-y-2 overflow-y-auto flex-1 pr-2">
            <div className="flex gap-3 items-start p-3 hover:bg-background-light dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-cyan/20 text-cyan flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles size={14} />
              </div>
              <div>
                <p className="text-xs text-primary dark:text-white font-bold">Model Retraining Complete</p>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">HAI-DEF v2.1 updated with latest patient dataset.</p>
                <span className="text-[9px] text-gray-400 mt-1 block font-medium">2 mins ago</span>
              </div>
            </div>
            
            <div className="flex gap-3 items-start p-3 hover:bg-background-light dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <AlertCircle size={14} />
              </div>
              <div>
                <p className="text-xs text-primary dark:text-white font-bold">Data Anomaly Detected</p>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">Unexpected variance in blood pressure readings from Ward 3.</p>
                <span className="text-[9px] text-gray-400 mt-1 block font-medium">1 hour ago</span>
              </div>
            </div>
            
            <div className="flex gap-3 items-start p-3 hover:bg-background-light dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <FileText size={14} />
              </div>
              <div>
                <p className="text-xs text-primary dark:text-white font-bold">Report Generated</p>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">Weekly population health summary is ready.</p>
                <span className="text-[9px] text-gray-400 mt-1 block font-medium">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Explainability Modal */}
      {showExplainabilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-card-dark rounded-3xl shadow-2xl max-w-2xl w-full p-6 border border-white/20 relative animate-in zoom-in-95 duration-200">
             <button 
              onClick={() => setShowExplainabilityModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
             >
               <X size={20} />
             </button>

             <h3 className="text-xl font-bold text-primary dark:text-white mb-2 flex items-center gap-2">
               <Cpu size={24} className="text-secondary" />
               MedGemma Logic Explorer
             </h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Understanding how the HAI-DEF model processes signals to ensure high accuracy.</p>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-background-light dark:bg-background-dark p-4 rounded-2xl border border-border-light dark:border-border-dark">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Key Factors</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-primary dark:text-white">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                      Historical Patient Vitals (35%)
                    </li>
                    <li className="flex items-center gap-2 text-sm text-primary dark:text-white">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                      Demographic Clustering (25%)
                    </li>
                    <li className="flex items-center gap-2 text-sm text-primary dark:text-white">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan"></div>
                      Real-time Sensor Data (20%)
                    </li>
                    <li className="flex items-center gap-2 text-sm text-primary dark:text-white">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      External Environmental Data (20%)
                    </li>
                  </ul>
                </div>
                
                <div className="bg-background-light dark:bg-background-dark p-4 rounded-2xl border border-border-light dark:border-border-dark">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confidence Score</h4>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-primary dark:text-white">98.4%</span>
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">High Trust</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-secondary to-cyan h-full w-[98.4%]"></div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">The model has successfully validated this prediction against 1.2M historical records.</p>
                </div>
             </div>

             <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
               <div className="flex gap-3">
                 <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                 <div>
                   <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100">Bias Mitigation Active</h4>
                   <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                     MedGemma actively filters for demographic anomalies. The current prediction shows <span className="font-bold">0.02%</span> variance across diverse population sets, well below the 0.5% threshold.
                   </p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}