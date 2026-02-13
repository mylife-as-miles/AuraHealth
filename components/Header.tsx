import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, LogOut, Menu } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onNavigate?: (view: string) => void;
  onMenuClick?: () => void;
}

export default function Header({ title = "Clinical Dashboard", subtitle = "Welcome back, Dr. Williamson", onNavigate, onMenuClick }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    // In a real app, this would clear auth tokens and redirect
    if (confirm("Are you sure you want to sign out?")) {
        console.log("Signing out user...");
        // window.location.href = "/login"; 
    }
    setIsProfileOpen(false);
  };

  return (
    <header className="flex items-center justify-between mb-6 md:mb-8 gap-4 flex-shrink-0 z-40 relative">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-primary dark:text-white mb-1 leading-tight">{title}</h2>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Active Doctors Stack - Only show on large screens */}
        <div className="hidden lg:flex items-center gap-3">
            <div className="flex -space-x-3">
            <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=100&h=100" 
                alt="Doctor 1" 
                className="w-10 h-10 rounded-full border-2 border-white dark:border-background-dark object-cover"
            />
            <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&h=100" 
                alt="Doctor 2" 
                className="w-10 h-10 rounded-full border-2 border-white dark:border-background-dark object-cover"
            />
            <div className="w-10 h-10 rounded-full border-2 border-white dark:border-background-dark bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                +3
            </div>
            </div>
        </div>

        <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

        <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => onNavigate && onNavigate('notifications')}
              className="p-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-white dark:border-background-dark animate-pulse"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <div 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 pl-2 cursor-pointer group rounded-full pr-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 select-none"
                >
                    <img 
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&h=100" 
                    alt="Profile" 
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shadow-sm"
                    />
                    <div className="hidden md:block">
                    <p className="text-sm font-bold text-primary dark:text-white leading-tight group-hover:text-secondary transition-colors">Alex Williamson</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Chief Resident</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 hidden md:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-card-dark rounded-2xl shadow-xl border border-gray-100 dark:border-border-dark py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 md:hidden">
                            <p className="text-sm font-bold text-primary dark:text-white">Alex Williamson</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Chief Resident</p>
                        </div>
                        
                        <div className="p-1">
                            <button 
                                onClick={handleSignOut}
                                className="w-full text-left px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl flex items-center gap-3 transition-colors group"
                            >
                                <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> 
                                <span className="font-bold">Sign Out</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </header>
  );
}