import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  Activity,
  BrainCircuit,
  GitBranch,
  Settings,
  Search,
  Command,
  Sparkles,
  Cpu
} from 'lucide-react';
import { useActiveModel } from '../lib/useActiveModel';

interface NavItemProps {
  icon: any;
  label: string;
  to: string;
  isNew?: boolean;
}

const NavItem = ({ icon: Icon, label, to, isNew = false }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${isActive
      ? 'bg-primary text-white shadow-lg shadow-primary/20'
      : 'text-gray-500 dark:text-gray-400 hover:bg-background-light dark:hover:bg-gray-800'
      }`}
  >
    {({ isActive }) => (
      <>
        <Icon className={`w-5 h-5 ${isActive ? '' : 'group-hover:text-primary dark:group-hover:text-white transition-colors'}`} />
        <span className={`text-sm font-medium ${isActive ? '' : 'group-hover:text-primary dark:group-hover:text-white transition-colors'}`}>
          {label}
        </span>
        {isNew && (
          <span className="ml-auto bg-accent/10 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full">
            New
          </span>
        )}
      </>
    )}
  </NavLink>
);

export default function Sidebar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const { modelName } = useActiveModel();
  return (
    <aside className="w-full md:w-64 flex-shrink-0 p-6 flex flex-col border-r border-border-light dark:border-border-dark bg-white dark:bg-card-dark">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-secondary to-cyan flex items-center justify-center text-primary shadow-glow">
          <Sparkles size={20} strokeWidth={2.5} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-primary dark:text-white">AuraHealth</h1>
      </div>

      {/* Search */}
      <div className="relative mb-8 group" onClick={onOpenSearch}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-secondary transition-colors" />
        <input
          type="text"
          className="w-full pl-10 pr-10 py-2.5 bg-background-light dark:bg-background-dark rounded-xl text-sm border-none focus:ring-2 focus:ring-secondary/50 focus:outline-none text-gray-600 dark:text-gray-300 placeholder-gray-400 transition-all"
          placeholder="Search patients..."
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-gray-400 border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded">
          <Command className="w-2.5 h-2.5" />K
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Overview</div>
        <NavItem icon={LayoutDashboard} label="Dashboard" to="/" />
        <NavItem icon={FolderOpen} label="Clinical Queue" to="/patients" />
        <NavItem icon={Activity} label="Diagnostics" to="/diagnostics" />
        <NavItem icon={BrainCircuit} label="AI Insights" to="/ai-insights" isNew />
        <NavItem icon={GitBranch} label="Clinical Workflow" to="/workflow" />

        <div className="pt-8 pb-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Support</div>
          <NavItem icon={Settings} label="Settings" to="/settings" />
        </div>
      </nav>

      {/* Upgrade Card */}
      <div className="mt-auto relative rounded-2xl overflow-hidden p-4 bg-primary">
        {/* Abstract Pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_rgba(84,224,151,0.8)]"></span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-secondary">{modelName} Monitoring Active</span>
          </div>
          <h3 className="font-bold text-sm mb-1">{modelName}</h3>
          <p className="text-[11px] text-gray-300 mb-3">Running HAI-DEF models.</p>
          <button className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-white/10">
            <Cpu size={14} /> System Status
          </button>
        </div>
      </div>
    </aside>
  );
}