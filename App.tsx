import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

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

  const getTitle = () => {
    switch(currentView) {
      case 'dashboard': return "Clinical Dashboard";
      case 'patients': return "Patient Records";
      case 'diagnostics': return "Diagnostics Center";
      case 'ai-insights': return "AI Insights";
      case 'workflow': return "Clinical Workflow";
      case 'settings': return "Settings";
      default: return "Clinical Dashboard";
    }
  };

  const renderView = () => {
    if (currentView === 'dashboard') {
      return <Dashboard />;
    }
    return <PlaceholderView title={getTitle()} />;
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center bg-background-light dark:bg-black transition-colors duration-300">
      <div className="w-full max-w-[1440px] bg-white dark:bg-card-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[850px] border border-border-light dark:border-border-dark transition-colors duration-300">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />
        <main className="flex-1 bg-background-light dark:bg-background-dark p-6 md:p-8 overflow-y-auto flex flex-col">
          <Header title={getTitle()} />
          <div className="flex-1">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}