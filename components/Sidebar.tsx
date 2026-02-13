import React from 'react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Activity, 
  BrainCircuit, 
  GitBranch, 
  Settings, 
  Search, 
  Command,
  Hospital,
  Cpu,
  X
} from 'lucide-react';

interface NavItemProps {
  icon: any;
  label: string;
  id: string;
  active?: boolean;
  isNew?: boolean;
  onClick: (id: string) => void;
}

const NavItem = ({ icon: Icon, label, id, active = false, isNew = false, onClick }: NavItemProps) => (
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      onClick(id);
    }}
    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
      active
        ? 'bg-primary text-white shadow-lg shadow-primary/20'
        : 'text-gray-500 dark:text-gray-400 hover:bg-background-light dark:hover:bg-gray-800'
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? '' : 'group-hover:text-primary dark:group-hover:text-white transition-colors'}`} />
    <span className={`text-sm font-medium ${active ? '' : 'group-hover:text-primary dark:group-hover:text-white transition-colors'}`}>
      {label}
    </span>
    {isNew && (
      <span className="ml-auto bg-accent/10 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full">
        New
      </span>
    )}
  </a>
);

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ currentView, onNavigate, isOpen = false, onClose }: SidebarProps) {
  return (
    <aside className={`
      fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white dark:bg-card-dark border-r border-border-light dark:border-border-dark
      transform transition-transform duration-300 ease-in-out flex flex-col p-6 h-full
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* Brand */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-cyan flex items-center justify-center text-primary shadow-glow">
            <Hospital size={18} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-primary dark:text-white">AuraHealth</h1>
        </div>
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="md:hidden p-1 text-gray-400 hover:text-primary dark:hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-8 group">
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
      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Overview</div>
        <NavItem icon={LayoutDashboard} label="Dashboard" id="dashboard" active={currentView === 'dashboard'} onClick={onNavigate} />
        <NavItem icon={FolderOpen} label="Patient Records" id="patients" active={currentView === 'patients'} onClick={onNavigate} />
        <NavItem icon={Activity} label="Diagnostics" id="diagnostics" active={currentView === 'diagnostics'} onClick={onNavigate} />
        <NavItem icon={BrainCircuit} label="AI Insights" id="ai-insights" isNew active={currentView === 'ai-insights'} onClick={onNavigate} />
        <NavItem icon={GitBranch} label="Clinical Workflow" id="workflow" active={currentView === 'workflow'} onClick={onNavigate} />

        <div className="pt-8 pb-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Support</div>
          <NavItem icon={Settings} label="Settings" id="settings" active={currentView === 'settings'} onClick={onNavigate} />
          <NavItem icon={Activity} label="Notifications" id="notifications" active={currentView === 'notifications'} onClick={onNavigate} />
        </div>
      </nav>

      {/* Upgrade Card */}
      <div className="mt-auto relative rounded-2xl overflow-hidden p-4 shrink-0">
        <div className="absolute inset-0 bg-primary"></div>
        {/* Abstract Pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10 text-white">
          <h3 className="font-bold text-sm mb-1">MedGemma v2.4</h3>
          <p className="text-[11px] text-gray-300 mb-3">Running HAI-DEF models.</p>
          <button className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-white/10">
             <Cpu size={14} /> System Status
          </button>
        </div>
      </div>
    </aside>
  );
}