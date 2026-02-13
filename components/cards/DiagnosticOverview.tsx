import React, { useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis, Tooltip } from 'recharts';
import { Download, AlertCircle, RefreshCw } from 'lucide-react';

const initialData = [
  { name: 'Sep', val: 35 },
  { name: 'Oct', val: 55 },
  { name: 'Nov', val: 75 },
  { name: 'Dec', val: 100, isPeak: true },
  { name: 'Jan', val: 85 },
  { name: 'Feb', val: 65 },
  { name: 'Mar', val: 50 },
];

export default function DiagnosticOverview() {
  const [activeIndex, setActiveIndex] = useState<number | null>(3);
  const [data, setData] = useState(initialData);
  const [error, setError] = useState<boolean>(false);

  const downloadCSV = () => {
    try {
      if (!data || data.length === 0) throw new Error("No data to export");

      const headers = ["Month,Value,IsPeak"];
      const rows = data.map(row => `${row.name},${row.val},${row.isPeak ? 'Yes' : 'No'}`);
      const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "diagnostic_overview.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Export failed", e);
      // Optional: set UI error state if export fails
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 p-3 rounded-xl shadow-xl">
          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{label} Statistics</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <p className="text-sm font-bold text-primary dark:text-white">
              {payload[0].value} <span className="font-medium text-gray-500 dark:text-gray-400">Patients</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (error || !data) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
          <AlertCircle size={24} />
        </div>
        <div>
          <h3 className="font-bold text-primary dark:text-white">Failed to load data</h3>
          <p className="text-xs text-gray-500 mt-1">We couldn't retrieve the diagnostic trends.</p>
        </div>
        <button 
          onClick={() => { setError(false); setData(initialData); }} 
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-primary dark:text-white text-lg">Diagnostic Overview</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Tracking patient intake vs discharge trends</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={downloadCSV}
             className="p-2 text-gray-400 hover:text-primary dark:hover:text-white bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
             title="Export CSV"
           >
             <Download size={16} />
           </button>
           <div className="bg-primary text-white text-xs px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg shadow-primary/20">
            <span className="font-semibold opacity-90">08.12.2024</span>
            <span className="w-px h-3 bg-white/20"></span>
            <span className="text-secondary font-bold">+91%</span>
          </div>
        </div>
      </div>

      {/* Fixed height container with min-w-0 to prevent flexbox sizing issues */}
      <div className="h-[250px] w-full relative min-w-0">
         {/* Y Axis Labels (Static for aesthetic match) */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-bold text-gray-300 pointer-events-none z-0">
          <span>600K</span>
          <span>400K</span>
          <span>200K</span>
          <span>0</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 30, right: 0, left: 30, bottom: 0 }} onMouseMove={(state: any) => {
              if (state.activeTooltipIndex !== undefined) {
                  setActiveIndex(state.activeTooltipIndex);
              }
          }} onMouseLeave={() => setActiveIndex(3)}>
            <defs>
                 {/* Stripe Pattern for the Peak bar */}
                <pattern id="stripePattern" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
                    <rect width="10" height="10" fill="#54E097" />
                    <path d="M 0,10 L 10,0" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/>
                </pattern>
            </defs>
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'transparent' }} // Using transparent cursor to maintain the custom active bar styling
            />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }} 
                dy={10}
            />
            <Bar dataKey="val" radius={[12, 12, 0, 0]} animationDuration={1000}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isPeak ? 'url(#stripePattern)' : (index === activeIndex ? '#54E097' : 'rgba(84, 224, 151, 0.3)')} 
                  className="transition-all duration-300"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Floating Peak Label - Only show if current data has a peak and not error */}
        {!error && (
            <div className="absolute top-[0%] left-[50%] transform -translate-x-1/2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded shadow-md animate-bounce pointer-events-none">
                Peak
            </div>
        )}
      </div>
    </div>
  );
}