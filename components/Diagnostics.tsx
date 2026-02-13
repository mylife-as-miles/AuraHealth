import React, { useState } from 'react';
import { 
  Search, 
  MoreVertical, 
  SkipBack, 
  Play, 
  SkipForward, 
  Plus, 
  Minus, 
  Hand, 
  Layers, 
  Ruler, 
  CheckCircle, 
  Users, 
  AlertCircle, 
  Info,
  Brain,
  RefreshCw,
  Clock,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Move,
  Maximize2,
  AlertTriangle
} from 'lucide-react';

export default function Diagnostics() {
  const [selectedCase, setSelectedCase] = useState('#8392-AX');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-white dark:bg-card-dark rounded-3xl overflow-y-auto lg:overflow-hidden border border-border-light dark:border-border-dark shadow-soft">
      
      {/* 1. Queue Sidebar */}
      <section className="w-full lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-r border-border-light dark:border-border-dark flex flex-col bg-white dark:bg-card-dark z-10 flex-shrink-0 h-72 lg:h-full">
        <div className="p-4 lg:p-5 border-b border-border-light dark:border-border-dark">
          <h2 className="text-base lg:text-lg font-bold text-primary dark:text-white flex items-center gap-2">
            Queue
            <span className="text-[10px] lg:text-xs font-normal bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">12</span>
          </h2>
          <div className="mt-3 lg:mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input 
              className="w-full pl-9 pr-4 py-2 bg-background-light dark:bg-background-dark rounded-xl text-[10px] lg:text-xs border-none focus:ring-1 focus:ring-secondary text-gray-600 dark:text-gray-300 placeholder-gray-400 outline-none" 
              placeholder="Filter cases..." 
              type="text"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 lg:p-3 space-y-2 custom-scrollbar">
          {/* Critical Item */}
          <div 
            onClick={() => setSelectedCase('#8392-AX')}
            className={`p-2.5 lg:p-3 border rounded-xl cursor-pointer transition-all ${
              selectedCase === '#8392-AX' 
                ? 'bg-primary/5 dark:bg-primary/20 border-primary/10 dark:border-primary/30' 
                : 'bg-white dark:bg-card-dark border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                <span className="text-[10px] lg:text-xs font-bold text-accent uppercase tracking-wider">Critical</span>
              </div>
              <span className="text-[9px] lg:text-[10px] text-gray-400">10:42 AM</span>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                <img alt="Scan" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRAwtPxFGdhQTwbfn24ASqWaHFM3S4Htma-suaq_gEiJojmGE25sayK2TQoek5ua90nYeBxqckI5cvXolA6p7gdikcIASIZJlfSHw2vAkNby0CBc52dsm1i9_qwjamdYrwOCodPXElxDYrbBfNBRIcUCXVE7Tg0WEkv23IbH-4KilvcYOyVSlqU7ToJrt2jVoBS5xxTKmeMrP3fJQYuvYStaKppvVG_ZzfAcQtZqP9-9avbykkR7FHuTxEnkIDEmlR49rhindmzX4"/>
              </div>
              <div>
                <h3 className="text-xs lg:text-sm font-bold text-primary dark:text-white leading-tight">Eleanor Pena</h3>
                <p className="text-[10px] lg:text-[11px] text-gray-500 dark:text-gray-400">Chest CT - Angio</p>
                <p className="text-[9px] lg:text-[10px] text-gray-400 mt-0.5">ID: #8392-AX</p>
              </div>
            </div>
          </div>

          {/* Ready Item */}
          <div className="p-2.5 lg:p-3 bg-white dark:bg-card-dark border border-transparent hover:border-border-light dark:hover:border-border-dark rounded-xl cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="text-[10px] lg:text-xs font-bold text-secondary uppercase tracking-wider">Ready</span>
              </div>
              <span className="text-[9px] lg:text-[10px] text-gray-400">09:15 AM</span>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                <img alt="Scan" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFZ5Ds1hg-ciMPSpXqdP99WBk3tJjWXKSsBox7AklkXUzFxV-typKAM9FHkb-sfn72mMin63BtJBwl0fDtDBc9QXFkkeKlJ7MsBThzztFfgYbd0tFNinVZcO1y-RE4QtnHIu5IS42GrbS_z73xPOSFMM025N68yLCh0YsKZqueczd_bqRsghvSBafrkq5F3CbRbYq8QS_wNUhnTq6BZnvxUimJFKe0QAOJ99V07S-TxKUwSMyt9i4tJm3bB4g_EwctI8DnBlX4ItE"/>
              </div>
              <div>
                <h3 className="text-xs lg:text-sm font-bold text-primary dark:text-white leading-tight">Jenny Wilson</h3>
                <p className="text-[10px] lg:text-[11px] text-gray-500 dark:text-gray-400">MRI - Brain</p>
                <p className="text-[9px] lg:text-[10px] text-gray-400 mt-0.5">ID: #9921-BR</p>
              </div>
            </div>
          </div>

          {/* In Progress Item */}
          <div className="p-2.5 lg:p-3 bg-white dark:bg-card-dark border border-transparent hover:border-border-light dark:hover:border-border-dark rounded-xl cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] lg:text-xs font-bold text-cyan uppercase tracking-wider">In Progress</span>
              </div>
              <span className="text-[9px] lg:text-[10px] text-gray-400">Running...</span>
            </div>
            <div className="flex gap-3 mb-2">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden flex-shrink-0 relative">
                 <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <RefreshCw className="text-white w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                 </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xs lg:text-sm font-bold text-primary dark:text-white leading-tight">Robert Fox</h3>
                <p className="text-[10px] lg:text-[11px] text-gray-500 dark:text-gray-400">X-Ray - Thorax</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan h-full rounded-full w-[65%]"></div>
            </div>
          </div>

          {/* Pending Item */}
          <div className="p-2.5 lg:p-3 bg-white dark:bg-card-dark border border-transparent hover:border-border-light dark:hover:border-border-dark rounded-xl cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 opacity-60">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                <span className="text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider">Pending</span>
              </div>
              <span className="text-[9px] lg:text-[10px] text-gray-400">Yesterday</span>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden flex-shrink-0"></div>
              <div>
                <h3 className="text-xs lg:text-sm font-bold text-primary dark:text-white leading-tight">Cody Fisher</h3>
                <p className="text-[10px] lg:text-[11px] text-gray-500 dark:text-gray-400">CT - Abdomen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Viewer Section */}
      <section className="flex-1 bg-black relative flex flex-col overflow-hidden group min-h-[400px] lg:min-h-0 order-first lg:order-none">
        
        {/* Top Overlay Toolbar */}
        <div className="absolute top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 z-20 flex flex-col md:flex-row justify-between pointer-events-none gap-2">
          <div className="bg-card-dark/80 backdrop-blur-md rounded-lg p-1 flex gap-0.5 md:gap-1 pointer-events-auto border border-white/10 shadow-lg self-start">
             <button className="p-1.5 md:p-2 hover:bg-white/10 rounded-md text-white transition-colors" title="Zoom In"><Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
             <button className="p-1.5 md:p-2 hover:bg-white/10 rounded-md text-white transition-colors" title="Zoom Out"><Minus className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
             <div className="w-px h-5 md:h-6 bg-white/10 my-auto mx-0.5 md:mx-1"></div>
             <button className="p-1.5 md:p-2 hover:bg-white/10 rounded-md text-white transition-colors" title="Pan"><Hand className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
             <button className="p-1.5 md:p-2 bg-cyan/20 text-cyan rounded-md transition-colors" title="AI Overlay"><Layers className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
             <button className="p-1.5 md:p-2 hover:bg-white/10 rounded-md text-white transition-colors" title="Measure"><Ruler className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
          </div>
          
          <div className="bg-card-dark/80 backdrop-blur-md rounded-lg px-2 py-1 md:px-3 md:py-1.5 flex items-center gap-2 md:gap-3 pointer-events-auto border border-white/10 shadow-lg self-end md:self-auto">
             <div className="flex flex-col text-right">
                <span className="text-[8px] md:text-[10px] text-gray-400 uppercase tracking-wider">Slice</span>
                <span className="text-[10px] md:text-xs font-bold text-white">42 / 128</span>
             </div>
             <div className="h-6 md:h-8 w-px bg-white/10"></div>
             <div className="flex flex-col text-right">
                <span className="text-[8px] md:text-[10px] text-gray-400 uppercase tracking-wider">Series</span>
                <span className="text-[10px] md:text-xs font-bold text-white">Art-Phase</span>
             </div>
          </div>
        </div>

        {/* Main Image Viewport */}
        <div className="flex-1 relative flex items-center justify-center bg-[#050505] overflow-hidden">
           {/* Grid Background */}
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#2E2E33 1px, transparent 1px), linear-gradient(90deg, #2E2E33 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
           
           <div className="relative w-[90%] md:w-[85%] h-[90%] md:h-[85%] max-w-[800px] aspect-[3/4] md:aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
              <img alt="Medical Scan" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale contrast-125 brightness-75" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaLzW74c-bLfMwdrsdol2N0t-NOhRcKNrmKPfQC4zh_Y9hqD8ybb6aMjWDyXd67Ova-Qf5hJs8rlMDitNP6uAJqtQw6zjfozs5JXXDW91SaC95QoQoJPi7y9wwzFOK_s-FLGE2H2TcvXPi0ZFjFkT8V4RihwXGZEIkMwWEt7BVZkIfEXfDjU4Q9UQfdtVmye5pZ_fMyb1C9mDAhcBAoVonT-s5STb17u8CyGLWZegfzbOewlQb_vbGrBCQ8-XPtWfNGzh-8jM0p00"/>
              
              {/* Overlays */}
              <div className="absolute inset-0 z-10">
                 {/* Bounding Box 1 - Nodule */}
                 <div className="absolute top-[35%] left-[55%] w-[15%] h-[12%] border-2 border-cyan/60 rounded-sm shadow-[0_0_15px_rgba(20,245,214,0.3)] flex items-start justify-end group cursor-pointer hover:bg-cyan/5 transition-colors">
                    <div className="absolute -top-6 right-0 bg-cyan/20 backdrop-blur-sm border border-cyan/40 text-cyan text-[9px] md:text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                       <span className="font-bold">88%</span>
                       <span>Nodule</span>
                    </div>
                 </div>

                 {/* Point Interest - Critical */}
                 <div className="absolute top-[62%] left-[30%] w-2.5 h-2.5 md:w-3 md:h-3 bg-accent rounded-full animate-pulse shadow-[0_0_15px_rgba(254,87,150,0.6)]"></div>
                 <svg className="absolute inset-0 pointer-events-none w-full h-full">
                    <line stroke="#FE5796" strokeDasharray="4 2" strokeWidth="1" x1="32%" x2="40%" y1="63%" y2="68%"></line>
                 </svg>
                 <div className="absolute top-[68%] left-[40%] bg-accent/20 backdrop-blur-sm border border-accent/40 text-accent text-[9px] md:text-[10px] px-2 py-1 rounded whitespace-nowrap">
                    <span className="font-bold">Critical:</span> Consolidation
                 </div>

                 {/* Corner Markers */}
                 <div className="absolute top-3 left-3 md:top-4 md:left-4 w-6 h-6 md:w-8 md:h-8 border-l border-t border-white/20"></div>
                 <div className="absolute top-3 right-3 md:top-4 md:right-4 w-6 h-6 md:w-8 md:h-8 border-r border-t border-white/20"></div>
                 <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 w-6 h-6 md:w-8 md:h-8 border-l border-b border-white/20"></div>
                 <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-6 h-6 md:w-8 md:h-8 border-r border-b border-white/20"></div>
              </div>
           </div>
        </div>

        {/* Bottom Playback Controls */}
        <div className="h-14 lg:h-16 bg-card-dark border-t border-border-dark flex items-center px-4 lg:px-6 gap-3 lg:gap-4 z-20">
           <button className="text-white hover:text-cyan transition-colors"><SkipBack size={18} className="lg:w-5 lg:h-5" /></button>
           <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-cyan transition-colors">
              {isPlaying ? <span className="material-symbols-outlined text-lg lg:text-xl">pause</span> : <Play size={20} className="lg:w-6 lg:h-6" />}
           </button>
           <button className="text-white hover:text-cyan transition-colors"><SkipForward size={18} className="lg:w-5 lg:h-5" /></button>
           
           {/* Timeline Scrubber Mockup */}
           <div className="flex-1 relative h-8 lg:h-10 flex items-center gap-0.5 lg:gap-1 overflow-hidden mx-2 lg:mx-4 mask-linear-fade">
              {[...Array(20)].map((_, i) => (
                  <div key={i} className={`w-0.5 lg:w-1 rounded h-full ${i === 8 ? 'bg-cyan border border-white/50 shadow-[0_0_10px_rgba(20,245,214,0.5)]' : 'bg-gray-700 opacity-50'}`}></div>
              ))}
           </div>
        </div>
      </section>

      {/* 3. Analysis Sidebar */}
      <section className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-border-light dark:border-border-dark flex flex-col p-4 lg:p-6 overflow-y-auto bg-white/50 dark:bg-card-dark/50 backdrop-blur-xl flex-shrink-0 h-auto lg:h-full">
         <div className="flex items-center gap-2 mb-4 lg:mb-6">
            <Brain className="text-cyan w-5 h-5 lg:w-6 lg:h-6" />
            <h2 className="text-base lg:text-lg font-bold text-primary dark:text-white">MedGemma Analysis</h2>
         </div>

         {/* Circular Confidence Score */}
         <div className="mb-6 lg:mb-8 flex flex-col items-center relative">
            <div className="relative w-32 h-32 lg:w-40 lg:h-40">
               <svg className="w-full h-full transform -rotate-90">
                  <circle className="dark:stroke-gray-700" cx="50%" cy="50%" fill="none" r="44%" stroke="#E6E6E6" strokeWidth="10%"></circle>
                  <circle 
                    className="drop-shadow-[0_0_10px_rgba(20,245,214,0.5)] transition-all duration-1000 ease-out" 
                    cx="50%" cy="50%" fill="none" r="44%" stroke="#14F5D6" 
                    strokeDasharray="440" strokeDashoffset="26" strokeLinecap="round" strokeWidth="10%"
                  ></circle>
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl lg:text-4xl font-bold text-primary dark:text-white">94%</span>
                  <span className="text-[9px] lg:text-[10px] text-gray-500 uppercase tracking-widest mt-1">Confidence</span>
               </div>
            </div>
            <div className="mt-2 text-center">
               <p className="text-[10px] lg:text-xs text-gray-500">Model: HAI-DEF v4.2</p>
            </div>
         </div>

         {/* Findings Summary */}
         <div className="mb-6">
            <h3 className="text-xs lg:text-sm font-bold text-primary dark:text-white mb-3 flex items-center justify-between">
                Findings Summary
                <span className="text-[9px] lg:text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold">2 Abnormalities</span>
            </h3>
            <div className="bg-white dark:bg-card-dark rounded-xl p-3 lg:p-4 shadow-sm border border-border-light dark:border-border-dark space-y-3">
               <div className="flex items-start gap-3">
                  <AlertCircle className="text-accent w-3.5 h-3.5 lg:w-4 lg:h-4 mt-0.5 flex-shrink-0" />
                  <div>
                     <p className="text-xs lg:text-sm text-gray-700 dark:text-gray-200 font-bold">Localized consolidation</p>
                     <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">Lower left lobe, approx 2.4cm diameter. Suggestive of acute infection.</p>
                  </div>
               </div>
               <div className="h-px bg-gray-100 dark:bg-gray-700 w-full"></div>
               <div className="flex items-start gap-3">
                  <Info className="text-cyan w-3.5 h-3.5 lg:w-4 lg:h-4 mt-0.5 flex-shrink-0" />
                  <div>
                     <p className="text-xs lg:text-sm text-gray-700 dark:text-gray-200 font-bold">Mild pleural effusion</p>
                     <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">Trace fluid noted in the costophrenic angle.</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Differential Diagnosis */}
         <div className="mb-6 lg:mb-8 flex-1">
            <h3 className="text-xs lg:text-sm font-bold text-primary dark:text-white mb-3">Differential Diagnosis</h3>
            <div className="space-y-2">
               {[
                 { label: 'Bacterial Pneumonia', val: 85, color: 'bg-primary' },
                 { label: 'Viral Pneumonia', val: 12, color: 'bg-gray-400' },
                 { label: 'Aspiration', val: 3, color: 'bg-gray-400' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-2 lg:p-2.5 rounded-lg hover:bg-white dark:hover:bg-card-dark border border-transparent hover:border-border-light dark:hover:border-border-dark transition-all cursor-default">
                    <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 font-medium">{item.label}</span>
                    <div className="flex items-center gap-2">
                       <div className="w-12 lg:w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.val}%` }}></div>
                       </div>
                       <span className={`text-[10px] lg:text-xs font-bold w-6 text-right ${i === 0 ? 'text-primary dark:text-white' : 'text-gray-500'}`}>{item.val}%</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Action Buttons */}
         <div className="mt-auto space-y-3">
            <button className="w-full py-2.5 lg:py-3 bg-secondary text-primary font-bold rounded-full shadow-lg shadow-secondary/30 hover:shadow-secondary/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-xs lg:text-sm">
               <CheckCircle size={16} className="lg:w-[18px] lg:h-[18px]" />
               Confirm Findings
            </button>
            <button className="w-full py-2.5 lg:py-3 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-xs lg:text-sm">
               <Users size={16} className="lg:w-[18px] lg:h-[18px]" />
               Request Consult
            </button>
         </div>
      </section>

    </div>
  );
}