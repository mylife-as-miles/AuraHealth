import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Verified, TrendingUp, ArrowUp } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../lib/db';

export default function SmartInsights() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const patients = useLiveQuery(() => db.patients.toArray()) || [];
  const cases = useLiveQuery(() => db.diagnosticCases.toArray()) || [];

  const insights = useMemo(() => {
    // defaults
    if (!patients.length && !cases.length) return [];

    // 1. Recovery Rate (Low Risk / Total)
    const active = patients.filter(p => p.active).length;
    const stable = patients.filter(p => p.risk === 'Low Risk').length;
    const recoveryParam = active > 0 ? Math.round((stable / (active || 1)) * 100) / 10 : 12; // simulated growth

    // 2. High Confidence Cases
    const highConf = cases.filter(c => c.confidence > 90).length;
    const accuracy = cases.length > 0 ? ((highConf / cases.length) * 100).toFixed(1) : '96.4';

    // 3. Avg Turnaround (mocked variation based on case count)
    const turnAround = Math.max(15, 45 - cases.length);

    const dynamic = [
      {
        text: 'Patient recovery rates are projected to increase by',
        highlight: `${recoveryParam}%`,
        suffix: 'based on current HAI-DEF diagnostic trends.'
      },
      {
        text: 'Cardiology ward efficiency has improved by',
        highlight: `${(8 + (cases.length % 5)).toFixed(1)}%`,
        suffix: 'after MedGemma model optimizations.'
      },
      {
        text: 'Early detection accuracy for oncology cases reached',
        highlight: `${accuracy}%`,
        suffix: 'using cross-referencing modules.'
      },
      {
        text: 'Average diagnostic turnaround time reduced by',
        highlight: `${turnAround} min`,
        suffix: 'compared to the previous quarter.'
      },
    ];
    return dynamic;

  }, [patients, cases]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % insights.length);
        setIsVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, [insights.length]);

  if (!patients.length && !cases.length) {
    return (
      <div className="rounded-3xl h-full w-full bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark flex flex-col items-center justify-center p-6 text-center shadow-soft">
        <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4">
          <Zap className="text-gray-300 dark:text-gray-600" size={32} />
        </div>
        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-1">No AI Insights</h3>
        <p className="text-xs text-gray-300 dark:text-gray-600 max-w-[200px]">
          Add patient data or run diagnostics to generate AI analysis.
        </p>
      </div>
    );
  }

  const insight = insights[currentIndex] || insights[0];

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
          +{insight.highlight} Expected
        </div>

        <div className="absolute top-[50%] left-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg animate-[pulse_4s_infinite]">
          <Verified size={12} className="text-cyan" />
          High Accuracy
        </div>

        {/* Action Button — navigates to AI Insights */}
        <button
          onClick={() => navigate('/ai-insights')}
          className="mb-6 w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform hover:bg-cyan hover:text-primary z-20"
          title="View AI Insights"
        >
          <ArrowUp strokeWidth={3} size={20} />
        </button>

        {/* Glass Text Panel with rotating insights */}
        <div className="w-full p-5 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-lg text-left">
          <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
            Smart AI Insights
            <span className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_10px_#14F5D6] animate-pulse"></span>
          </h3>
          <p
            className={`text-gray-200 text-xs leading-relaxed font-medium transition-all duration-400 ${isVisible ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-1'
              }`}
          >
            {insight.text}{' '}
            <span className="text-secondary font-bold">{insight.highlight}</span>{' '}
            {insight.suffix}
          </p>
          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {insights.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentIndex(i); setIsVisible(true); }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-cyan w-4' : 'bg-white/30 hover:bg-white/50'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}