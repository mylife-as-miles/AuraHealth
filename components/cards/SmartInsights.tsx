import React from 'react';
import { Zap, Verified, TrendingUp, ArrowUp } from 'lucide-react';

export default function SmartInsights() {
  return (
    <div className="rounded-3xl h-full w-full relative overflow-hidden flex flex-col group shadow-2xl shadow-primary/20">
      {/* Background with Image and Overlay */}
      <div className="absolute inset-0 bg-primary">
        <img 
          alt="Abstract Medical Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay transition-transform duration-[10s] group-hover:scale-110" 
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent"></div>
        {/* Animated Glow Orb */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-cyan/30 blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 p-6 flex flex-col h-full items-center justify-end text-center">
        
        {/* Center Visual Icon */}
        <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center shadow-[0_0_40px_rgba(20,245,214,0.3)]">
          <Zap className="w-12 h-12 text-cyan drop-shadow-[0_0_10px_rgba(20,245,214,0.8)]" strokeWidth={2.5} />
          
          {/* Rotating ring element */}
          <div className="absolute inset-0 rounded-full border-t border-secondary/50 animate-spin duration-[3s]"></div>
        </div>

        {/* Floating Tags */}
        <div className="absolute top-[25%] right-2 bg-secondary/20 backdrop-blur-md border border-secondary/30 text-secondary text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg animate-[bounce_3s_infinite]">
            <TrendingUp size={12} />
            +12% Expected
        </div>
        
        <div className="absolute top-[50%] left-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg animate-[pulse_4s_infinite]">
            <Verified size={12} className="text-cyan" />
            High Accuracy
        </div>

        {/* Action Button */}
        <button className="mb-6 w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform hover:bg-cyan hover:text-primary z-20">
          <ArrowUp strokeWidth={3} size={20} />
        </button>

        {/* Glass Text Panel */}
        <div className="w-full p-5 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-lg text-left">
          <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
             Smart AI Insights
             <span className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_10px_#14F5D6] animate-pulse"></span>
          </h3>
          <p className="text-gray-200 text-xs leading-relaxed font-medium opacity-90">
            Your sales are likely to increase next month by <span className="text-secondary font-bold">12%</span> based on current HAI-DEF diagnostic trends.
          </p>
        </div>
      </div>
    </div>
  );
}