import React from 'react';
import ClinicalInsights from './cards/ClinicalInsights';
import ActiveInterventions from './cards/ActiveInterventions';
import AttentionHeatmap from './cards/AttentionHeatmap';
import DiagnosticOverview from './cards/DiagnosticOverview';
import SmartInsights from './cards/SmartInsights';

export default function Dashboard() {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar pr-2 pb-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 auto-rows-[minmax(0,1fr)]">

        {/* Top left section (2 columns wide, split into 2) */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <ClinicalInsights />
          <ActiveInterventions />
        </div>

        {/* Top right section */}
        <div className="xl:col-span-1 h-full min-h-[380px]">
          <AttentionHeatmap />
        </div>

        {/* Bottom Row: Left col spans 2 */}
        <div className="col-span-1 md:col-span-2 bg-card-light dark:bg-card-dark rounded-3xl p-6 shadow-soft dark:shadow-none dark:border dark:border-border-dark">
          <DiagnosticOverview />
        </div>

        {/* Bottom Row: Right col */}
        <div className="col-span-1 h-full min-h-[320px]">
          <SmartInsights />
        </div>
      </div>
    </div>
  );
}