import React, { useState, useMemo, useEffect } from 'react';
import {
  SlidersHorizontal,
  Download,
  ArrowUp,
  ArrowDown,
  Cpu,
  Network,
  AlertTriangle,
  Activity,
  Flame,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  FileText,
  Info,
  X,
  Share2,
  Eye,
  EyeOff,
  Check,
  ChevronRight,
  Bell,
  BellOff,
  Trash2,
  RefreshCw
} from 'lucide-react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine
} from 'recharts';

// --- Data per period ---
const DATA_BY_PERIOD: Record<string, Array<Record<string, number | string | undefined>>> = {
  '6M': [
    { month: 'Jan', cardio: 30, resp: 45, viral: 20, neuro: 65 },
    { month: 'Feb', cardio: 40, resp: 35, viral: 25, neuro: 62 },
    { month: 'Mar', cardio: 35, resp: 55, viral: 35, neuro: 60 },
    { month: 'Apr', cardio: 80, resp: 50, viral: 45, neuro: 58 },
    { month: 'May', cardio: 60, resp: 30, viral: 20, neuro: 63 },
    { month: 'Jun', cardio: 70, resp: 25, viral: 60, neuro: 68, cardioProj: 70, respProj: 25, viralProj: 60, neuroProj: 68 },
    { month: 'Jul', cardioProj: 85, respProj: 20, viralProj: 15, neuroProj: 70 },
    { month: 'Aug', cardioProj: 90, respProj: 15, viralProj: 10, neuroProj: 72 },
  ],
  '1Y': [
    { month: 'Jan', cardio: 25, resp: 60, viral: 40, neuro: 50 },
    { month: 'Mar', cardio: 35, resp: 50, viral: 30, neuro: 55 },
    { month: 'May', cardio: 50, resp: 40, viral: 20, neuro: 58 },
    { month: 'Jul', cardio: 65, resp: 30, viral: 55, neuro: 60 },
    { month: 'Sep', cardio: 72, resp: 45, viral: 35, neuro: 62 },
    { month: 'Nov', cardio: 68, resp: 55, viral: 48, neuro: 65, cardioProj: 68, respProj: 55, viralProj: 48, neuroProj: 65 },
    { month: 'Dec', cardioProj: 78, respProj: 60, viralProj: 30, neuroProj: 67 },
    { month: 'Jan+', cardioProj: 82, respProj: 65, viralProj: 22, neuroProj: 68 },
  ],
  '2Y': [
    { month: 'Q1 23', cardio: 20, resp: 50, viral: 35, neuro: 48 },
    { month: 'Q2 23', cardio: 30, resp: 45, viral: 28, neuro: 50 },
    { month: 'Q3 23', cardio: 42, resp: 38, viral: 32, neuro: 52 },
    { month: 'Q4 23', cardio: 55, resp: 52, viral: 40, neuro: 55 },
    { month: 'Q1 24', cardio: 60, resp: 35, viral: 25, neuro: 58 },
    { month: 'Q2 24', cardio: 70, resp: 28, viral: 55, neuro: 63, cardioProj: 70, respProj: 28, viralProj: 55, neuroProj: 63 },
    { month: 'Q3 24', cardioProj: 80, respProj: 22, viralProj: 20, neuroProj: 66 },
    { month: 'Q4 24', cardioProj: 88, respProj: 18, viralProj: 15, neuroProj: 70 },
  ]
};

// --- Notification data ---
interface Notification {
  id: string;
  icon: 'sparkles' | 'alert' | 'file';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: '1', icon: 'sparkles', title: 'Model Retraining Complete', description: 'HAI-DEF v2.1 updated with latest patient dataset.', time: '2 mins ago', read: false },
  { id: '2', icon: 'alert', title: 'Data Anomaly Detected', description: 'Unexpected variance in blood pressure readings from Ward 3.', time: '1 hour ago', read: false },
  { id: '3', icon: 'file', title: 'Report Generated', description: 'Weekly population health summary is ready.', time: '3 hours ago', read: true },
  { id: '4', icon: 'sparkles', title: 'New Dataset Available', description: 'Community transmission data Q2 2024 uploaded.', time: '5 hours ago', read: true },
];

// --- Prediction alerts ---
interface PredictionAlert {
  id: string;
  ward: string;
  risk: string;
  riskChange: number;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

const PREDICTION_ALERTS: PredictionAlert[] = [
  { id: 'p1', ward: 'Ward 4B (Pediatrics)', risk: '+22%', riskChange: 22, description: 'Projected spike in RSV cases over next 72 hours based on community transmission data.', severity: 'high' },
  { id: 'p2', ward: 'Ward 2A (Cardiology)', risk: '+15%', riskChange: 15, description: 'Elevated cardiovascular event risk during heatwave forecast.', severity: 'medium' },
  { id: 'p3', ward: 'ICU', risk: '+8%', riskChange: 8, description: 'Slight increase in sepsis indicators among post-op patients.', severity: 'low' },
];

// --- Series visibility ---
type SeriesKey = 'cardio' | 'resp' | 'viral' | 'neuro';

export default function AIInsights() {
  // Modals
  const [showExplainabilityModal, setShowExplainabilityModal] = useState(false);
  const [showModelSettings, setShowModelSettings] = useState(false);
  const [showAlertDetail, setShowAlertDetail] = useState<string | null>(null);

  // Chart period
  const [chartPeriod, setChartPeriod] = useState<'6M' | '1Y' | '2Y'>('6M');

  // Series toggles
  const [visibleSeries, setVisibleSeries] = useState<Record<SeriesKey, boolean>>({
    cardio: true, resp: true, viral: true, neuro: true
  });

  // Geographic view
  const [geoView, setGeoView] = useState<'city' | 'regional'>('city');

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  // Model settings state
  const [modelConfidence, setModelConfidence] = useState(95);
  const [modelVersion, setModelVersion] = useState('v4.2');

  // Export state
  const [exportSuccess, setExportSuccess] = useState(false);

  // Animated accuracy
  const [displayAccuracy, setDisplayAccuracy] = useState(0);
  useEffect(() => {
    const target = 98.4;
    const timer = setTimeout(() => setDisplayAccuracy(target), 100);
    return () => clearTimeout(timer);
  }, []);

  const chartData = useMemo(() => DATA_BY_PERIOD[chartPeriod], [chartPeriod]);
  const bridgeMonth = useMemo(() => {
    const bridgeItem = chartData.find(d =>
      d.cardio !== undefined && d.cardioProj !== undefined
    );
    return bridgeItem?.month || 'Jun';
  }, [chartData]);

  const toggleSeries = (key: SeriesKey) => {
    setVisibleSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const downloadChartCSV = () => {
    const headers = ['Month', 'Cardio', 'Respiratory', 'Viral', 'Neuro', 'Cardio (Proj)', 'Respiratory (Proj)', 'Viral (Proj)', 'Neuro (Proj)'];
    const rows = chartData.map(row => [
      row.month, row.cardio || '', row.resp || '', row.viral || '', row.neuro || '',
      row.cardioProj || '', row.respProj || '', row.viralProj || '', row.neuroProj || ''
    ].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `disease_trends_${chartPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportReport = () => {
    downloadChartCSV();
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert("Chart view link copied to clipboard!");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const notifIcon = (type: string) => {
    switch (type) {
      case 'sparkles': return <Sparkles size={14} />;
      case 'alert': return <AlertCircle size={14} />;
      case 'file': return <FileText size={14} />;
      default: return <Info size={14} />;
    }
  };
  const notifColor = (type: string) => {
    switch (type) {
      case 'sparkles': return 'bg-cyan/20 text-cyan';
      case 'alert': return 'bg-accent/20 text-accent';
      case 'file': return 'bg-gray-100 dark:bg-gray-700 text-gray-500';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pr-2 relative">
      {/* Toolbar */}
      <div className="flex items-center justify-end mb-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => setShowModelSettings(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark text-sm font-semibold text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-soft"
          >
            <SlidersHorizontal size={18} />
            Model Settings
          </button>
          {exportSuccess ? (
            <div className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-green-500 text-white text-sm font-semibold">
              <Check size={18} /> Exported!
            </div>
          ) : (
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Download size={18} />
              Export Report
            </button>
          )}
        </div>
      </div>

      {/* Top Section Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

        {/* Disease Prevalence Chart */}
        <div className="xl:col-span-2 bg-card-light dark:bg-card-dark rounded-3xl p-6 shadow-soft border border-transparent dark:border-border-dark flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h3 className="font-bold text-primary dark:text-white text-lg">Disease Prevalence Trends</h3>
              <p className="text-xs text-gray-500 mt-1">Comparative analysis including AI projections</p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {/* Period Toggle */}
              <div className="flex bg-background-light dark:bg-background-dark p-1 rounded-full mr-2">
                {(['6M', '1Y', '2Y'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setChartPeriod(p)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${chartPeriod === p
                      ? 'bg-white dark:bg-card-dark shadow-sm text-primary dark:text-white'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                      }`}
                  >{p}</button>
                ))}
              </div>

              <button onClick={handleShare} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-primary dark:hover:text-white transition-colors" title="Share Chart">
                <Share2 size={16} />
              </button>
              <button onClick={downloadChartCSV} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-primary dark:hover:text-white transition-colors" title="Export Data">
                <Download size={16} />
              </button>
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

              {/* Togglable Series Legend */}
              <div className="flex items-center gap-2">
                {([
                  { key: 'cardio' as SeriesKey, label: 'Cardio', color: 'bg-accent' },
                  { key: 'resp' as SeriesKey, label: 'Resp', color: 'bg-secondary' },
                  { key: 'viral' as SeriesKey, label: 'Viral', color: 'bg-cyan' },
                  { key: 'neuro' as SeriesKey, label: 'Neuro', color: 'bg-primary/30' },
                ]).map(s => (
                  <button
                    key={s.key}
                    onClick={() => toggleSeries(s.key)}
                    className={`flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-md transition-all ${visibleSeries[s.key] ? 'text-gray-600 dark:text-gray-300' : 'text-gray-300 dark:text-gray-600 line-through'}`}
                  >
                    <span className={`w-2 h-2 rounded-full mr-1 ${s.color} ${!visibleSeries[s.key] ? 'opacity-30' : ''}`}></span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full relative h-[300px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCardio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FE5796" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FE5796" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />

                {visibleSeries.neuro && <Line type="monotone" dataKey="neuro" name="Neurology" stroke="#160527" strokeOpacity={0.2} strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />}
                {visibleSeries.resp && <Line type="monotone" dataKey="resp" name="Respiratory" stroke="#54E097" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6, strokeWidth: 0, fill: '#54E097' }} />}
                {visibleSeries.viral && <Line type="monotone" dataKey="viral" name="Viral" stroke="#14F5D6" strokeDasharray="5 5" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6, strokeWidth: 0, fill: '#14F5D6' }} />}
                {visibleSeries.cardio && <Area type="monotone" dataKey="cardio" name="Cardiology" stroke="#FE5796" strokeWidth={4} fillOpacity={1} fill="url(#colorCardio)" activeDot={{ r: 6, strokeWidth: 0, fill: '#FE5796' }} />}

                {/* Projections */}
                {visibleSeries.cardio && <Line type="monotone" dataKey="cardioProj" name="Cardio (Proj)" stroke="#FE5796" strokeOpacity={0.6} strokeWidth={3} strokeDasharray="4 4" dot={{ r: 3, strokeWidth: 0, fill: '#FE5796' }} />}
                {visibleSeries.resp && <Line type="monotone" dataKey="respProj" name="Resp (Proj)" stroke="#54E097" strokeOpacity={0.6} strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, strokeWidth: 0, fill: '#54E097' }} />}
                {visibleSeries.viral && <Line type="monotone" dataKey="viralProj" name="Viral (Proj)" stroke="#14F5D6" strokeOpacity={0.6} strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, strokeWidth: 0, fill: '#14F5D6' }} />}
                {visibleSeries.neuro && <Line type="monotone" dataKey="neuroProj" name="Neuro (Proj)" stroke="#160527" strokeOpacity={0.15} strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, strokeWidth: 0, fill: '#160527' }} />}

                <ReferenceLine x={bridgeMonth as string} stroke="#9ca3af" strokeDasharray="3 3" label={{ position: 'top', value: 'Now', fill: '#9ca3af', fontSize: 10 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column Stack */}
        <div className="xl:col-span-1 flex flex-col gap-6">

          {/* Model Accuracy Card */}
          <div className="bg-primary rounded-3xl p-6 text-white relative overflow-hidden flex-1 flex flex-col justify-between min-h-[220px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-20 blur-3xl rounded-full transform translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary opacity-20 blur-3xl rounded-full transform -translate-x-10 translate-y-10"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">Model Accuracy</h3>
                  <p className="text-xs text-gray-300">MedGemma Performance</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowExplainabilityModal(true)}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-1.5 rounded-lg border border-white/10 transition-colors"
                    title="How predictions work"
                  >
                    <Info size={14} className="text-white" />
                  </button>
                  <span className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-mono border border-white/10 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    LIVE
                  </span>
                </div>
              </div>

              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold" style={{ transition: 'all 1s ease-out' }}>{displayAccuracy.toFixed(1)}%</span>
                <span className="text-secondary text-sm font-semibold mb-1 flex items-center">
                  <ArrowUp size={14} /> 0.2%
                </span>
              </div>

              <div className="w-full bg-white/10 rounded-full h-1.5 mb-6">
                <div className="bg-secondary h-1.5 rounded-full shadow-[0_0_10px_rgba(84,224,151,0.5)] transition-all duration-1000" style={{ width: `${displayAccuracy}%` }}></div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-white/10 rounded-lg"><Cpu size={14} className="text-cyan" /></span>
                    <div className="text-sm">
                      <div className="font-medium text-xs">HAI-DEF Core</div>
                      <div className="text-[10px] text-gray-400">Inference Time: 12ms</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-cyan">99.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-white/10 rounded-lg"><Network size={14} className="text-accent" /></span>
                    <div className="text-sm">
                      <div className="font-medium text-xs">Population Cluster</div>
                      <div className="text-[10px] text-gray-400">Inference Time: 45ms</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-accent">96.8%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Prediction Alert Card */}
          <div className="bg-white dark:bg-card-dark rounded-3xl p-6 shadow-soft border border-transparent dark:border-border-dark">
            <h3 className="font-bold text-primary dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="text-accent" size={20} />
              Prediction Alerts
              <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold ml-auto">{PREDICTION_ALERTS.length}</span>
            </h3>
            <div className="space-y-3">
              {PREDICTION_ALERTS.map(alert => (
                <div key={alert.id} className={`bg-background-light dark:bg-background-dark p-3 rounded-xl border-l-4 ${alert.severity === 'high' ? 'border-accent' : alert.severity === 'medium' ? 'border-yellow-400' : 'border-gray-300'} transition-all`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-primary dark:text-white">{alert.ward}</span>
                    <span className={`text-[10px] font-bold ${alert.severity === 'high' ? 'text-accent' : alert.severity === 'medium' ? 'text-yellow-500' : 'text-gray-500'}`}>{alert.risk} Risk</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight mb-2">{alert.description}</p>
                  <button
                    onClick={() => setShowAlertDetail(alert.id)}
                    className="text-[10px] font-semibold text-primary dark:text-cyan flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    View Analysis <ChevronRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">

        {/* Geographic Health Insights */}
        <div className="lg:col-span-2 bg-card-light dark:bg-card-dark rounded-3xl p-6 shadow-soft border border-transparent dark:border-border-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-primary dark:text-white">Geographic Health Insights</h3>
            <div className="flex gap-2 bg-background-light dark:bg-background-dark p-1 rounded-full">
              <button
                onClick={() => setGeoView('city')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${geoView === 'city' ? 'bg-white dark:bg-card-dark shadow-sm text-primary dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
              >City View</button>
              <button
                onClick={() => setGeoView('regional')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${geoView === 'regional' ? 'bg-white dark:bg-card-dark shadow-sm text-primary dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
              >Regional</button>
            </div>
          </div>

          <div className="relative h-64 w-full bg-background-light dark:bg-gray-800 rounded-2xl overflow-hidden group border border-border-light dark:border-border-dark">
            <div className="absolute inset-0 opacity-30 dark:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/map-cubes.png')]"></div>

            {geoView === 'city' ? (
              <>
                <div className="absolute top-[30%] left-[20%] w-32 h-32 bg-secondary rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
                <div className="absolute top-[60%] left-[60%] w-40 h-40 bg-accent rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-[20%] right-[20%] w-24 h-24 bg-cyan rounded-full filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

                <div className="absolute top-[35%] left-[22%] group/pin cursor-pointer">
                  <div className="w-3 h-3 bg-secondary rounded-full ring-4 ring-secondary/20 group-hover/pin:scale-125 transition-transform"></div>
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white dark:bg-card-dark px-2 py-1 rounded shadow-lg text-[10px] font-bold whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity z-10">
                    Low Risk Zone
                  </div>
                </div>
                <div className="absolute top-[65%] left-[62%] group/pin cursor-pointer">
                  <div className="w-4 h-4 bg-accent rounded-full ring-4 ring-accent/20 animate-ping absolute opacity-75"></div>
                  <div className="w-4 h-4 bg-accent rounded-full relative group-hover/pin:scale-125 transition-transform"></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-card-dark px-2 py-1 rounded shadow-lg text-[10px] font-bold text-accent whitespace-nowrap z-10">
                    High Concentration
                  </div>
                </div>
                <div className="absolute top-[25%] right-[25%] group/pin cursor-pointer">
                  <div className="w-3 h-3 bg-cyan rounded-full ring-4 ring-cyan/20 group-hover/pin:scale-125 transition-transform"></div>
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white dark:bg-card-dark px-2 py-1 rounded shadow-lg text-[10px] font-bold text-cyan whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity z-10">
                    Monitoring Zone
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="absolute top-[15%] left-[10%] w-48 h-48 bg-secondary rounded-full filter blur-[60px] opacity-30 animate-pulse"></div>
                <div className="absolute top-[40%] left-[45%] w-56 h-56 bg-accent rounded-full filter blur-[60px] opacity-25 animate-pulse" style={{ animationDelay: '0.8s' }}></div>
                <div className="absolute top-[10%] right-[10%] w-40 h-40 bg-cyan rounded-full filter blur-[60px] opacity-35 animate-pulse" style={{ animationDelay: '0.3s' }}></div>

                <div className="absolute top-[25%] left-[18%] group/pin cursor-pointer">
                  <div className="w-5 h-5 bg-secondary rounded-full ring-4 ring-secondary/20 group-hover/pin:scale-125 transition-transform flex items-center justify-center text-[8px] font-bold text-white">N</div>
                  <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-white dark:bg-card-dark px-2 py-1 rounded shadow-lg text-[10px] font-bold whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity z-10">
                    North Region — Low Risk
                  </div>
                </div>
                <div className="absolute top-[50%] left-[50%] group/pin cursor-pointer">
                  <div className="w-6 h-6 bg-accent rounded-full ring-4 ring-accent/20 animate-ping absolute opacity-75"></div>
                  <div className="w-6 h-6 bg-accent rounded-full relative group-hover/pin:scale-125 transition-transform flex items-center justify-center text-[8px] font-bold text-white">C</div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-card-dark px-2 py-1 rounded shadow-lg text-[10px] font-bold text-accent whitespace-nowrap z-10">
                    Central Region — Critical
                  </div>
                </div>
                <div className="absolute top-[20%] right-[18%] group/pin cursor-pointer">
                  <div className="w-5 h-5 bg-cyan rounded-full ring-4 ring-cyan/20 group-hover/pin:scale-125 transition-transform flex items-center justify-center text-[8px] font-bold text-white">E</div>
                  <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-white dark:bg-card-dark px-2 py-1 rounded shadow-lg text-[10px] font-bold text-cyan whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity z-10">
                    East Region — Watch
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 flex gap-6 overflow-x-auto pb-2">
            <div className="flex items-center gap-3 min-w-max p-2 rounded-xl hover:bg-background-light dark:hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary"><ShieldCheck size={20} /></div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase font-bold">Low Risk Zones</div>
                <div className="font-bold text-sm text-primary dark:text-white">{geoView === 'city' ? 'North, West Districts' : 'North, West Regions'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 min-w-max p-2 rounded-xl hover:bg-background-light dark:hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent"><Flame size={20} /></div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase font-bold">Hotspots</div>
                <div className="font-bold text-sm text-primary dark:text-white">{geoView === 'city' ? 'Downtown, East Side' : 'Central, South Regions'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* System Notifications */}
        <div className="lg:col-span-1 bg-white dark:bg-card-dark rounded-3xl p-6 shadow-soft border border-transparent dark:border-border-dark flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-primary dark:text-white flex items-center gap-2">
              System Notifications
              {unreadCount > 0 && (
                <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold">{unreadCount}</span>
              )}
            </h3>
            <button onClick={markAllRead} className="text-[10px] text-gray-400 hover:text-primary dark:hover:text-white font-medium transition-colors">
              Mark all read
            </button>
          </div>
          <div className="space-y-2 overflow-y-auto flex-1 pr-2">
            {notifications.length > 0 ? notifications.map(n => (
              <div key={n.id} className={`flex gap-3 items-start p-3 hover:bg-background-light dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer group relative ${!n.read ? 'bg-background-light/50 dark:bg-white/[0.02]' : ''}`}>
                {!n.read && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent"></div>}
                <div className={`w-8 h-8 rounded-full ${notifColor(n.icon)} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  {notifIcon(n.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-primary dark:text-white font-bold">{n.title}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{n.description}</p>
                  <span className="text-[9px] text-gray-400 mt-1 block font-medium">{n.time}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); dismissNotification(n.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-all text-gray-400 flex-shrink-0"
                >
                  <X size={12} />
                </button>
              </div>
            )) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-8 gap-2">
                <BellOff size={24} className="opacity-30" />
                <p className="text-xs">All caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Explainability Modal */}
      {showExplainabilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-card-dark rounded-3xl shadow-2xl max-w-2xl w-full p-6 border border-white/20 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowExplainabilityModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-primary dark:text-white mb-2 flex items-center gap-2">
              <Cpu size={24} className="text-secondary" />
              MedGemma Logic Explorer
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Understanding how the HAI-DEF model processes signals to ensure high accuracy.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-background-light dark:bg-background-dark p-4 rounded-2xl border border-border-light dark:border-border-dark">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Key Factors</h4>
                <ul className="space-y-2">
                  {[
                    { color: 'bg-accent', label: 'Historical Patient Vitals (35%)' },
                    { color: 'bg-secondary', label: 'Demographic Clustering (25%)' },
                    { color: 'bg-cyan', label: 'Real-time Sensor Data (20%)' },
                    { color: 'bg-gray-400', label: 'External Environmental Data (20%)' }
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-primary dark:text-white">
                      <div className={`w-1.5 h-1.5 rounded-full ${f.color}`}></div>
                      {f.label}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-background-light dark:bg-background-dark p-4 rounded-2xl border border-border-light dark:border-border-dark">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confidence Score</h4>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-primary dark:text-white">98.4%</span>
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">High Trust</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-secondary to-cyan h-full w-[98.4%]"></div>
                </div>
                <p className="text-[10px] text-gray-500 mt-2">The model has successfully validated this prediction against 1.2M historical records.</p>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
              <div className="flex gap-3">
                <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100">Bias Mitigation Active</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    MedGemma actively filters for demographic anomalies. The current prediction shows <span className="font-bold">0.02%</span> variance across diverse population sets, well below the 0.5% threshold.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model Settings Modal */}
      {showModelSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-card-dark rounded-3xl shadow-2xl max-w-md w-full p-6 border border-white/20 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowModelSettings(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-primary dark:text-white mb-1 flex items-center gap-2">
              <SlidersHorizontal size={20} className="text-secondary" />
              Model Settings
            </h3>
            <p className="text-xs text-gray-500 mb-6">Configure AI model parameters</p>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Model Version</label>
                <div className="flex gap-2">
                  {['v3.0', 'v4.0', 'v4.2'].map(v => (
                    <button
                      key={v}
                      onClick={() => setModelVersion(v)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${modelVersion === v
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10'
                        }`}
                    >{v}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Confidence Threshold: <span className="text-primary dark:text-white">{modelConfidence}%</span></label>
                <input
                  type="range"
                  min={50}
                  max={99}
                  value={modelConfidence}
                  onChange={(e) => setModelConfidence(Number(e.target.value))}
                  className="w-full accent-secondary"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>50% (Sensitive)</span>
                  <span>99% (Strict)</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Prediction Horizon</label>
                <select className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-secondary outline-none text-sm dark:text-white">
                  <option>24 hours</option>
                  <option>48 hours</option>
                  <option>72 hours</option>
                  <option>1 week</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowModelSettings(false)} className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={() => setShowModelSettings(false)} className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Detail Modal */}
      {showAlertDetail && (() => {
        const alert = PREDICTION_ALERTS.find(a => a.id === showAlertDetail);
        if (!alert) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-card-dark rounded-3xl shadow-2xl max-w-md w-full p-6 border border-white/20 relative animate-in zoom-in-95 duration-200">
              <button onClick={() => setShowAlertDetail(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                <X size={20} />
              </button>
              <h3 className="text-lg font-bold text-primary dark:text-white mb-1 flex items-center gap-2">
                <AlertTriangle size={20} className="text-accent" />
                {alert.ward}
              </h3>
              <p className="text-xs text-gray-500 mb-4">AI Prediction Analysis</p>

              <div className={`p-4 rounded-xl mb-4 ${alert.severity === 'high' ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800' : alert.severity === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800' : 'bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-primary dark:text-white">Risk Elevation</span>
                  <span className={`text-lg font-bold ${alert.severity === 'high' ? 'text-accent' : alert.severity === 'medium' ? 'text-yellow-500' : 'text-gray-500'}`}>{alert.risk}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${alert.severity === 'high' ? 'bg-accent' : alert.severity === 'medium' ? 'bg-yellow-400' : 'bg-gray-400'}`} style={{ width: `${alert.riskChange * 3}%` }}></div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{alert.description}</p>

              <div className="bg-background-light dark:bg-background-dark p-3 rounded-xl mb-4">
                <h4 className="text-xs font-bold text-gray-500 mb-2">Recommended Actions</h4>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2 text-xs text-primary dark:text-white"><Check size={12} className="text-secondary" /> Increase monitoring frequency</li>
                  <li className="flex items-center gap-2 text-xs text-primary dark:text-white"><Check size={12} className="text-secondary" /> Alert on-call staff</li>
                  <li className="flex items-center gap-2 text-xs text-primary dark:text-white"><Check size={12} className="text-secondary" /> Prepare isolation protocols</li>
                </ul>
              </div>

              <button onClick={() => setShowAlertDetail(null)} className="w-full py-3 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                Acknowledge & Close
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}