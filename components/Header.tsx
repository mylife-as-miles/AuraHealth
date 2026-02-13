import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ title = "Clinical Dashboard", subtitle = "Welcome back, Dr. Williamson" }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0">
      <div>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-1">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{subtitle}</p>
      </div>

      <div className="flex items-center gap-6">
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

        <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-white dark:border-background-dark"></span>
            </button>

            <div className="flex items-center gap-3 pl-2 cursor-pointer group rounded-full pr-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <img 
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&h=100" 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover shadow-sm"
                />
                <div className="hidden md:block">
                <p className="text-sm font-bold text-primary dark:text-white leading-tight group-hover:text-secondary transition-colors">Alex Williamson</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Chief Resident</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
            </div>
        </div>
      </div>
    </header>
  );
}