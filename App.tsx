import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PatientRecords from './components/PatientRecords';
import AIInsights from './components/AIInsights';
import ClinicalWorkflow from './components/ClinicalWorkflow';
import Settings from './components/Settings';
import Diagnostics from './components/Diagnostics';
import Notifications from './components/Notifications';

// Placeholder component for non-dashboard views
const PlaceholderView = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400 animate-in fade-in duration-500">
    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 shadow-inner">
      <div className="w-8 h-8 rounded-full bg-secondary/20"></div>
    </div>
    <h3 className="text-xl font-bold text-primary dark:text-white mb-2">{title}</h3>
    <p className="text-sm opacity-60">This module is currently under active development.</p>
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getHeaderInfo = () => {
    switch(currentView) {
      case 'dashboard': 
        return { title: "Clinical Dashboard", subtitle: "Welcome back, Dr. Williamson" };
      case 'patients': 
        return { title: "Patient Directory", subtitle: "Manage patient records and diagnostic history" };
      case 'diagnostics': 
        return { title: "Diagnostics Center", subtitle: "Real-time diagnostic analysis" };
      case 'ai-insights': 
        return { title: "Population Analytics", subtitle: "AI-driven insights powered by MedGemma & HAI-DEF" };
      case 'workflow': 
        return { title: "Clinical Workflow", subtitle: "Triage Board • Cardiology Unit A" };
      case 'settings': 
        return { title: "Settings & Configuration", subtitle: "Manage your profile, HAI-DEF models, and system privacy." };
      case 'notifications': 
        return { title: "Notifications", subtitle: "Stay updated with critical alerts and system changes." };
      default: 
        return { title: "Clinical Dashboard", subtitle: "Welcome back, Dr. Williamson" };
    }
  };

  const renderView = () => {
    if (currentView === 'dashboard') {
      return <Dashboard />;
    }
    if (currentView === 'patients') {
      return <PatientRecords />;
    }
    if (currentView === 'ai-insights') {
      return <AIInsights />;
    }
    if (currentView === 'workflow') {
      return <ClinicalWorkflow />;
    }
    if (currentView === 'settings') {
      return <Settings />;
    }
    if (currentView === 'diagnostics') {
      return <Diagnostics />;
    }
    if (currentView === 'notifications') {
      return <Notifications />;
    }
    return <PlaceholderView title={getHeaderInfo().title} />;
  };

  const { title, subtitle } = getHeaderInfo();

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen p-0 md:p-4 lg:p-6 flex items-center justify-center bg-background-light dark:bg-black transition-colors duration-300">
      <div className="w-full max-w-[1440px] bg-white dark:bg-card-dark md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-screen md:h-[calc(100vh-2rem)] border-none md:border border-border-light dark:border-border-dark transition-colors duration-300 relative">
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        <Sidebar 
          currentView={currentView} 
          onNavigate={handleNavigate} 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        
        <main className="flex-1 bg-background-light dark:bg-background-dark p-4 md:p-8 flex flex-col overflow-hidden relative w-full">
          <Header 
            title={title} 
            subtitle={subtitle} 
            onNavigate={setCurrentView} 
            onMenuClick={() => setIsMobileMenuOpen(true)}
          />
          
          <div className="flex-1 overflow-hidden h-full relative">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}