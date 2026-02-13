import React from 'react';
import { MoreHorizontal, TrendingUp } from 'lucide-react';

const StatBox = ({ label, value, trend, trendColor }: { label: string, value: string, trend: string, trendColor: 'secondary' | 'cyan' }) => (
  <div className="flex-1 p-4 rounded-2xl bg-background-light dark:bg-gray-800/50 border border-transparent dark:border-border-dark">
    <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
    <div className="flex items-baseline gap-2">
      <h4 className="text-2xl font-bold text-primary dark:text-white tracking-tight">{value}</h4>
      <span className={`text-xs font-bold flex items-center px-1.5 py-0.5 rounded ${
        trendColor === 'secondary' ? 'text-secondary bg-secondary/10' : 'text-cyan bg-cyan/10'
      }`}>
        {trendColor === 'secondary' && <TrendingUp className="w-3 h-3 mr-0.5" />}
        {trend}
      </span>
    </div>
  </div>
);

const ProgressBar = ({ label, percentage, color }: { label: string, percentage: number, color: string }) => (
  <div>
    <div className="flex justify-between text-xs font-bold mb-2">
      <span className="text-gray-600 dark:text-gray-300">{label}</span>
      <span className="text-primary dark:text-white">{percentage}% Capacity</span>
    </div>
    <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      ></div>
    </div>
  </div>
);

export default function ClinicalInsights() {
  return (
    <div className="flex-1 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-primary dark:text-white text-lg">Clinical Insights</h3>
          <p className="text-xs text-gray-500 font-medium mt-1">MedGemma Model Analysis</p>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <MoreHorizontal className="text-gray-400 w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <StatBox label="Active Cases" value="462" trend="12%" trendColor="secondary" />
        <StatBox label="Recovery Rate" value="94%" trend="+2.4%" trendColor="cyan" />
      </div>

      <div className="space-y-5">
        <ProgressBar label="Cardiology Ward" percentage={83} color="#FE5796" />
        <ProgressBar label="Neurology Ward" percentage={42} color="#54E097" />
      </div>
    </div>
  );
}