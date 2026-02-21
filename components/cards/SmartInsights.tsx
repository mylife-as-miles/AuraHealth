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
    if (!patients.length && !cases.length) return [];

    const active = patients.filter(p => p.active !== false);
    const totalActive = active.length || 1;

    // 1. Recovery Rate: based on actual Low Risk patient ratio
    const lowRisk = active.filter(p => p.risk === 'Low Risk').length;
    const recoveryRate = ((lowRisk / totalActive) * 100).toFixed(1);

    // 2. Diagnostic Efficiency: based on avg confidence score from completed cases
    const completedCases = cases.filter(c => c.confidence > 0);
    const avgConfidence = completedCases.length > 0
      ? (completedCases.reduce((sum, c) => sum + c.confidence, 0) / completedCases.length).toFixed(1)
      : '0';

    // 3. High Confidence Accuracy: percentage of cases above 90% confidence
    const highConf = cases.filter(c => c.confidence > 90).length;
    const accuracy = cases.length > 0 ? ((highConf / cases.length) * 100).toFixed(1) : '0';

    // 4. Avg Processing: based on total slices across active scans
    const totalSlices = cases.reduce((sum, c) => sum + c.totalSlices, 0);
    const avgSlices = cases.length > 0 ? Math.round(totalSlices / cases.length) : 0;

    const dynamic = [
      {
        text: `${lowRisk} of ${totalActive} patients classified as low-risk — recovery rate at`,
        highlight: `${recoveryRate}%`,
        suffix: 'based on current triage data.'
      },
      {
        text: 'Average diagnostic confidence across completed scans is',
        highlight: `${avgConfidence}%`,
        suffix: 'powered by MedGemma model analysis.'
      },
      {
        text: 'High-confidence detection (>90%) achieved in',
        highlight: `${accuracy}%`,
        suffix: `of ${cases.length} diagnostic ${cases.length === 1 ? 'case' : 'cases'}.`
      },
      {
        text: 'Average scan complexity:',
        highlight: `${avgSlices} slices`,
        suffix: `across ${cases.length} active ${cases.length === 1 ? 'study' : 'studies'}.`
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

        {/* Top Space for Icon */}
        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[160px]">
          {/* Center Visual Icon */}
          <div className="relative w-32 h-32 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center shadow-[0_0_40px_rgba(20,245,214,0.3)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-12 text-cyan drop-shadow-[0_0_15px_rgba(20,245,214,0.8)] relative z-10"
            >
              <path strokeDasharray="80" strokeDashoffset="80" d="M13 2L3 14H12L11 22L21 10H12L13 2Z">
                <animate attributeName="stroke-dashoffset" values="80;0;0;80" keyTimes="0;0.35;0.65;1" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="fill" values="transparent;rgba(20,245,214,0.6);rgba(20,245,214,0.6);transparent" keyTimes="0;0.35;0.65;1" dur="2.5s" repeatCount="indefinite" />
              </path>
            </svg>

            {/* Rotating ring element */}
            <div className="absolute inset-0 rounded-full border-t border-secondary/50 animate-spin duration-[3s]"></div>

            {/* Floating Tags relative to the icon */}
            <div className="absolute -top-4 -right-12 bg-secondary/20 backdrop-blur-md border border-secondary/30 text-secondary text-[10px] whitespace-nowrap font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg animate-[bounce_3s_infinite] z-20">
              <TrendingUp size={12} />
              +{insight.highlight} Expected
            </div>

            <div className="absolute -bottom-2 -left-10 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] whitespace-nowrap font-medium px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg animate-[pulse_4s_infinite] z-20">
              <Verified size={12} className="text-cyan" />
              High Accuracy
            </div>
          </div>
        </div>

        {/* Action Button — navigates to AI Insights */}
        <button
          onClick={() => navigate('/ai-insights')}
          className="mb-6 -mt-6 w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform hover:bg-cyan hover:text-primary z-30 relative"
          title="View AI Insights"
        >
          <ArrowUp strokeWidth={3} size={20} />
        </button>

        {/* Glass Text Panel with rotating insights */}
        <div className="w-full p-5 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-lg text-left relative z-20">
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