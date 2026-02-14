import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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

import { useState, useEffect } from 'react';
import CommandPalette from './components/CommandPalette';

// ... (previous imports)

const Layout = () => {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getHeaderInfo = (pathname: string) => {
    switch (pathname) {
      case '/':
        return { title: "Clinical Dashboard", subtitle: "Welcome back, Dr. Williamson" };
      case '/patients':
        return { title: "Patient Directory", subtitle: "Manage patient records and diagnostic history" };
      case '/diagnostics':
        return { title: "Diagnostics Center", subtitle: "Real-time diagnostic analysis" };
      case '/ai-insights':
        return { title: "Population Analytics", subtitle: "AI-driven insights powered by MedGemma & HAI-DEF" };
      case '/workflow':
        return { title: "Clinical Workflow", subtitle: "Triage Board • Cardiology Unit A" };
      case '/settings':
        return { title: "Settings & Configuration", subtitle: "Manage your profile, HAI-DEF models, and system privacy." };
      case '/notifications':
        return { title: "Notifications", subtitle: "Stay updated with critical alerts and system changes." };
      default:
        return { title: "Clinical Dashboard", subtitle: "Welcome back, Dr. Williamson" };
    }
  };

  const { title, subtitle } = getHeaderInfo(location.pathname);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center bg-background-light dark:bg-black transition-colors duration-300">
      <div className="w-full max-w-[1440px] bg-white dark:bg-card-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[850px] border border-border-light dark:border-border-dark transition-colors duration-300 h-[calc(100vh-4rem)]">
        <Sidebar onOpenSearch={() => setIsSearchOpen(true)} />
        <main className="flex-1 bg-background-light dark:bg-background-dark p-6 md:p-8 flex flex-col overflow-hidden relative">
          <Header title={title} subtitle={subtitle} />

          <div className="flex-1 overflow-hidden h-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<PatientRecords />} />
              <Route path="/diagnostics" element={<Diagnostics />} />
              <Route path="/ai-insights" element={<AIInsights />} />
              <Route path="/workflow" element={<ClinicalWorkflow />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="*" element={<PlaceholderView title="Not Found" />} />
            </Routes>
          </div>
        </main>
      </div>
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
