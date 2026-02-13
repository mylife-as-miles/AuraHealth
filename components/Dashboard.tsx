import React from 'react';
import ClinicalInsights from './cards/ClinicalInsights';
import ResourceAllocation from './cards/ResourceAllocation';
import PatientSatisfaction from './cards/PatientSatisfaction';
import DiagnosticOverview from './cards/DiagnosticOverview';
import SmartInsights from './cards/SmartInsights';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
      {/* Top Row: Spans 2 cols, split internally */}
      <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-6 bg-card-light dark:bg-card-dark rounded-3xl p-6 shadow-soft dark:shadow-none dark:border dark:border-border-dark">
        <ClinicalInsights />
        <ResourceAllocation />
      </div>

      {/* Top Row: Right col */}
      <div className="col-span-1 bg-card-light dark:bg-card-dark rounded-3xl p-6 shadow-soft dark:shadow-none dark:border dark:border-border-dark">
        <PatientSatisfaction />
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
  );
}