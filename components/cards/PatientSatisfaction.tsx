import React from 'react';

const StackedBar = ({ label, green, pink, isActive = false }: { label: string, green: number, pink: number, isActive?: boolean }) => (
  <div className="flex items-center gap-3">
    <span className="text-[11px] font-bold w-6 text-gray-400">{label}</span>
    <div className={`flex-1 h-3.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex relative group cursor-pointer transition-transform ${isActive ? 'scale-105' : ''}`}>
      <div style={{ width: `${green}%` }} className="h-full bg-secondary"></div>
      <div style={{ width: `${pink}%` }} className="h-full bg-accent"></div>
      
      {isActive && (
        <div className="absolute -top-12 right-0 bg-primary text-white text-[10px] p-2.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 w-24">
           <div className="flex justify-between w-full font-bold">
              <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1"></span>{green}%</span>
              <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-accent mr-1"></span>{pink}%</span>
           </div>
           <div className="absolute bottom-[-4px] right-4 w-2 h-2 bg-primary rotate-45"></div>
        </div>
      )}
    </div>
  </div>
);

export default function PatientSatisfaction() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-primary dark:text-white text-sm">Patient Satisfaction</h3>
        <div className="relative">
             <select className="appearance-none text-[10px] font-bold bg-background-light dark:bg-gray-800 border-none rounded-lg py-1.5 pl-3 pr-8 text-gray-600 dark:text-gray-300 focus:ring-0 cursor-pointer outline-none">
            <option>Monthly</option>
            <option>Weekly</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</span>
        </div>
       
      </div>

      <div className="flex-1 flex flex-col justify-center gap-6 mb-4">
        <StackedBar label="Jan" green={40} pink={30} />
        <StackedBar label="Dec" green={55} pink={25} isActive={true} />
        <StackedBar label="Nov" green={30} pink={20} />
      </div>

      <div className="flex justify-between items-center text-[10px] font-semibold text-gray-400 mt-auto px-4">
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-accent"></span>
           <span>Improving</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          <span>Overall Sat.</span>
        </div>
      </div>
    </div>
  );
}