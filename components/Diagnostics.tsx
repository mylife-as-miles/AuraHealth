import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useActiveModel } from '../lib/useActiveModel';
import {
  Search,
  MoreVertical,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Plus,
  Minus,
  Hand,
  Layers,
  Ruler,
  CheckCircle,
  Users,
  AlertCircle,
  Info,
  Brain,
  RefreshCw,
  Clock,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Move,
  Maximize2,
  AlertTriangle,
  X,
  Send,
  Activity
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { DiagCase } from '../lib/types';
import EmptyState from './EmptyState';

// --- Types imported from ../lib/types ---

// --- Helpers ---
const statusStyle = (s: DiagCase['status']) => {
  switch (s) {
    case 'Critical': return { dot: 'bg-accent animate-pulse', text: 'text-accent' };
    case 'Ready': return { dot: 'bg-secondary', text: 'text-secondary' };
    case 'In Progress': return { dot: '', text: 'text-cyan' };
    case 'Pending': return { dot: 'bg-gray-400', text: 'text-gray-500' };
  }
};

// --- Component ---
export default function Diagnostics() {
  const { modelName } = useActiveModel();
  const cases = useLiveQuery(() => db.diagnosticCases.toArray()) || [];

  // Selection & search
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [queueSearch, setQueueSearch] = useState('');

  // Viewer tools
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showOverlays, setShowOverlays] = useState(true);
  const [showMeasure, setShowMeasure] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  // Pan drag refs
  const dragStart = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  // Playback
  const [currentSlice, setCurrentSlice] = useState(42);
  const [isPlaying, setIsPlaying] = useState(false);

  // UI feedback
  const [confirmed, setConfirmed] = useState(false);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [consultSent, setConsultSent] = useState(false);

  // Derived
  const selectedCase = useMemo(() => cases.find(c => c.id === selectedCaseId) || cases[0], [cases, selectedCaseId]);
  const filteredCases = useMemo(() => {
    let result = cases;
    if (queueSearch.trim()) {
      const q = queueSearch.toLowerCase();
      result = cases.filter(c => c.patientName.toLowerCase().includes(q) || c.scanType.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
    }
    return result.sort((a, b) => {
      // Critical jumps to the top
      if (a.status === 'Critical' && b.status !== 'Critical') return -1;
      if (b.status === 'Critical' && a.status !== 'Critical') return 1;
      // Then sort by newest first
      return b.timestamp - a.timestamp;
    });
  }, [cases, queueSearch]);

  // Reset state when case changes
  useEffect(() => {
    if (!selectedCase) return;
    setCurrentSlice(Math.floor(selectedCase.totalSlices * 0.33));
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
    setConfirmed(false);
    setConsultSent(false);
  }, [selectedCaseId, selectedCase]);

  // Playback auto-advance
  useEffect(() => {
    if (!isPlaying || !selectedCase) return;
    const interval = setInterval(() => {
      setCurrentSlice(prev => {
        if (prev >= selectedCase.totalSlices) { setIsPlaying(false); return 1; }
        return prev + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying, selectedCase]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  }, [isPanning, panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPanOffset({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  }, []);

  const handleMouseUp = useCallback(() => { isDragging.current = false; }, []);

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && viewerRef.current) {
      viewerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Confidence ring offset calculation
  const circumference = 2 * Math.PI * 44; // r=44% but we use a fixed circumference of ~276
  const strokeDashoffset = selectedCase ? 276 - (276 * (selectedCase.confidence || 0)) / 100 : 276;

  if (cases.length === 0) {
    return (
      <div className="h-full w-full bg-white dark:bg-card-dark rounded-3xl border border-border-light dark:border-border-dark shadow-soft overflow-hidden">
        <EmptyState
          icon={Activity}
          title="No Diagnostic Cases"
          description="There are no active diagnostic cases or scans queued. Import patient data to generate sample cases."
          color="accent"
        />
      </div>
    );
  }

  if (!selectedCase) return null;

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-white dark:bg-card-dark rounded-3xl overflow-y-auto lg:overflow-hidden border border-border-light dark:border-border-dark shadow-soft">

      {/* 1. Queue Sidebar */}
      <section className="w-full lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-r border-border-light dark:border-border-dark flex flex-col bg-white dark:bg-card-dark z-10 flex-shrink-0 h-72 lg:h-full">
        <div className="p-4 lg:p-5 border-b border-border-light dark:border-border-dark">
          <h2 className="text-base lg:text-lg font-bold text-primary dark:text-white flex items-center gap-2">
            Queue
            <span className="text-[10px] lg:text-xs font-normal bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">{filteredCases.length}</span>
          </h2>
          <div className="mt-3 lg:mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              value={queueSearch}
              onChange={(e) => setQueueSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background-light dark:bg-background-dark rounded-xl text-[10px] lg:text-xs border-none focus:ring-1 focus:ring-secondary text-gray-600 dark:text-gray-300 placeholder-gray-400 outline-none"
              placeholder="Filter cases..."
              type="text"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 lg:p-3 space-y-2 custom-scrollbar">
          {filteredCases.map((c) => {
            const style = statusStyle(c.status);
            const isSelected = c.id === selectedCaseId;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`p-2.5 lg:p-3 border rounded-xl cursor-pointer transition-all ${isSelected
                  ? 'bg-primary/5 dark:bg-primary/20 border-primary/10 dark:border-primary/30 shadow-sm'
                  : 'bg-white dark:bg-card-dark border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  } ${c.status === 'Pending' ? 'opacity-60' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {style.dot && <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>}
                    <span className={`text-[10px] lg:text-xs font-bold uppercase tracking-wider ${style.text}`}>{c.status}</span>
                  </div>
                  <span className="text-[9px] lg:text-[10px] text-gray-400">{c.time}</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden flex-shrink-0 relative">
                    {c.image ? (
                      <img alt="Scan" className="w-full h-full object-cover opacity-80" src={c.image} />
                    ) : c.status === 'In Progress' ? (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <RefreshCw className="text-white w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                      </div>
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs lg:text-sm font-bold text-primary dark:text-white leading-tight">{c.patientName}</h3>
                    <p className="text-[10px] lg:text-[11px] text-gray-500 dark:text-gray-400">{c.scanType}</p>
                    <p className="text-[9px] lg:text-[10px] text-gray-400 mt-0.5">ID: {c.id}</p>
                  </div>
                </div>
                {c.status === 'In Progress' && c.progress && (
                  <div className="mt-2 w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan h-full rounded-full transition-all duration-500" style={{ width: `${c.progress}%` }}></div>
                  </div>
                )}
              </div>
            );
          })}
          {filteredCases.length === 0 && (
            <div className="text-center text-xs text-gray-400 py-6">No cases match "{queueSearch}"</div>
          )}
        </div>
      </section>

      {/* 2. Main Viewer Section */}
      <section ref={viewerRef} className="flex-1 bg-black relative flex flex-col overflow-hidden group min-h-[400px] lg:min-h-0 order-first lg:order-none">

        {/* Top Overlay Toolbar */}
        <div className="absolute top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 z-20 flex flex-col md:flex-row justify-between pointer-events-none gap-2">
          {/* Left tools */}
          <div className="bg-card-dark/80 backdrop-blur-md rounded-lg p-1 flex gap-0.5 md:gap-1 pointer-events-auto border border-white/10 shadow-lg self-start">
            <button onClick={() => setZoom(z => Math.min(z + 0.25, 3))} className={`p-1.5 md:p-2 hover:bg-white/10 rounded-md text-white transition-colors`} title="Zoom In"><Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
            <button onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))} className={`p-1.5 md:p-2 hover:bg-white/10 rounded-md text-white transition-colors`} title="Zoom Out"><Minus className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
            <div className="w-px h-5 md:h-6 bg-white/10 my-auto mx-0.5 md:mx-1"></div>
            <button onClick={() => { setIsPanning(!isPanning); if (isPanning) setPanOffset({ x: 0, y: 0 }); }} className={`p-1.5 md:p-2 rounded-md transition-colors ${isPanning ? 'bg-cyan/20 text-cyan' : 'text-white hover:bg-white/10'}`} title="Pan"><Hand className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
            <button onClick={() => setShowOverlays(!showOverlays)} className={`p-1.5 md:p-2 rounded-md transition-colors ${showOverlays ? 'bg-cyan/20 text-cyan' : 'text-white hover:bg-white/10'}`} title="AI Overlay"><Layers className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
            <button onClick={() => setShowMeasure(!showMeasure)} className={`p-1.5 md:p-2 rounded-md transition-colors ${showMeasure ? 'bg-cyan/20 text-cyan' : 'text-white hover:bg-white/10'}`} title="Measure"><Ruler className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
            <div className="w-px h-5 md:h-6 bg-white/10 my-auto mx-0.5 md:mx-1"></div>
            <button onClick={toggleFullscreen} className="p-1.5 md:p-2 hover:bg-white/10 rounded-md text-white transition-colors" title="Fullscreen"><Maximize2 className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
          </div>

          {/* Right info */}
          <div className="bg-card-dark/80 backdrop-blur-md rounded-lg px-2 py-1 md:px-3 md:py-1.5 flex items-center gap-2 md:gap-3 pointer-events-auto border border-white/10 shadow-lg self-end md:self-auto">
            <div className="flex flex-col text-right">
              <span className="text-[8px] md:text-[10px] text-gray-400 uppercase tracking-wider">Slice</span>
              <span className="text-[10px] md:text-xs font-bold text-white">{currentSlice} / {selectedCase.totalSlices}</span>
            </div>
            <div className="h-6 md:h-8 w-px bg-white/10"></div>
            <div className="flex flex-col text-right">
              <span className="text-[8px] md:text-[10px] text-gray-400 uppercase tracking-wider">Zoom</span>
              <span className="text-[10px] md:text-xs font-bold text-white">{Math.round(zoom * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Main Image Viewport */}
        <div
          className={`flex-1 relative flex items-center justify-center bg-[#050505] overflow-hidden ${isPanning ? 'cursor-grab active:cursor-grabbing' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#2E2E33 1px, transparent 1px), linear-gradient(90deg, #2E2E33 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

          {selectedCase.image ? (
            <div
              className={`relative w-[90%] md:w-[85%] h-[90%] md:h-[85%] max-w-[800px] aspect-[3/4] md:aspect-square ${selectedCase.scanType.toLowerCase().includes('screening') || selectedCase.scanType.toLowerCase().includes('lab') ? 'bg-card-dark text-white p-8 lg:p-12 overflow-y-auto' : 'bg-gray-900'} rounded-lg overflow-hidden border border-gray-800 shadow-2xl transition-transform duration-150`}
              style={selectedCase.scanType.toLowerCase().includes('screening') || selectedCase.scanType.toLowerCase().includes('lab') ? {} : { transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)` }}
            >
              {selectedCase.scanType.toLowerCase().includes('screening') || selectedCase.scanType.toLowerCase().includes('lab') ? (
                <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan shadow-sm">
                      <Activity size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-serif">{selectedCase.scanType}</h2>
                      <p className="text-sm text-gray-400">Dr7 Triage Text Analysis Engine</p>
                    </div>
                  </div>

                  <div className="prose prose-invert prose-sm max-w-none flex-1">
                    <h3 className="text-cyan mb-2">Clinical Context Review</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">{selectedCase.aiSummary}</p>

                    <h3 className="text-cyan mb-2">Automated Extraction</h3>
                    <ul className="space-y-3">
                      {selectedCase.findings.map((f, i) => (
                        <li key={i} className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <span className="font-bold text-white block mb-1">{f.title}</span>
                          <span className="text-gray-400">{f.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  <img alt="Medical Scan" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale contrast-125 brightness-75" src={selectedCase.image} />
                  {/* AI Overlays */}
                  {showOverlays && (
                    <div className="absolute inset-0 z-10">
                      {selectedCase.annotations.map((ann, i) => (
                        <React.Fragment key={i}>
                          {ann.type === 'box' && (
                            <div
                              className="absolute border-2 border-cyan/60 rounded-sm shadow-[0_0_15px_rgba(20,245,214,0.3)] flex items-start justify-end group cursor-pointer hover:bg-cyan/5 transition-colors"
                              style={{ top: ann.top, left: ann.left, width: ann.width, height: ann.height }}
                            >
                              <div className="absolute -top-6 right-0 bg-cyan/20 backdrop-blur-sm border border-cyan/40 text-cyan text-[9px] md:text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                <span className="font-bold">{ann.confidence}%</span>
                                <span>{ann.label}</span>
                              </div>
                            </div>
                          )}
                          {ann.type === 'point' && (
                            <>
                              <div className={`absolute w-2.5 h-2.5 md:w-3 md:h-3 rounded-full animate-pulse shadow-[0_0_15px_rgba(254,87,150,0.6)] ${ann.severity === 'critical' ? 'bg-accent' : 'bg-cyan'}`} style={{ top: ann.top, left: ann.left }}></div>
                              {ann.lineX2 && ann.lineY2 && (
                                <>
                                  <svg className="absolute inset-0 pointer-events-none w-full h-full">
                                    <line stroke={ann.severity === 'critical' ? '#FE5796' : '#14F5D6'} strokeDasharray="4 2" strokeWidth="1" x1={`${parseInt(ann.left) + 2}%`} x2={ann.lineX2} y1={`${parseInt(ann.top) + 1}%`} y2={ann.lineY2}></line>
                                  </svg>
                                  <div className={`absolute ${ann.severity === 'critical' ? 'bg-accent/20 border-accent/40 text-accent' : 'bg-cyan/20 border-cyan/40 text-cyan'} backdrop-blur-sm border text-[9px] md:text-[10px] px-2 py-1 rounded whitespace-nowrap`} style={{ top: ann.lineY2, left: ann.lineX2 }}>
                                    <span className="font-bold">{ann.severity === 'critical' ? 'Critical:' : 'Note:'}</span> {ann.label}
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </React.Fragment>
                      ))}

                      {/* Corner Markers */}
                      <div className="absolute top-3 left-3 md:top-4 md:left-4 w-6 h-6 md:w-8 md:h-8 border-l border-t border-white/20"></div>
                      <div className="absolute top-3 right-3 md:top-4 md:right-4 w-6 h-6 md:w-8 md:h-8 border-r border-t border-white/20"></div>
                      <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 w-6 h-6 md:w-8 md:h-8 border-l border-b border-white/20"></div>
                      <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-6 h-6 md:w-8 md:h-8 border-r border-b border-white/20"></div>
                    </div>
                  )}
                </>
              )}

              {/* Measure overlay */}
              {showMeasure && (
                <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none">
                  <line stroke="#14F5D6" strokeDasharray="6 3" strokeWidth="2" x1="20%" y1="50%" x2="80%" y2="50%" />
                  <circle cx="20%" cy="50%" r="4" fill="#14F5D6" />
                  <circle cx="80%" cy="50%" r="4" fill="#14F5D6" />
                  <text x="50%" y="47%" textAnchor="middle" fill="#14F5D6" fontSize="11" fontWeight="bold">12.4 cm</text>
                </svg>
              )}
            </div>
          ) : (
            /* No-image placeholder for pending/in-progress */
            <div className="flex flex-col items-center justify-center gap-4 text-gray-500">
              {selectedCase.status === 'In Progress' ? (
                <>
                  <RefreshCw className="w-12 h-12 animate-spin text-cyan/50" />
                  <p className="text-sm font-medium text-gray-400">Analysis in progress ({selectedCase.progress}%)</p>
                  <div className="w-48 bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan h-full rounded-full transition-all duration-500" style={{ width: `${selectedCase.progress}%` }}></div>
                  </div>
                </>
              ) : (
                <>
                  <Clock className="w-12 h-12 text-gray-600" />
                  <p className="text-sm font-medium text-gray-400">Scan queued — awaiting processing</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Bottom Playback Controls */}
        <div className="h-14 lg:h-16 bg-card-dark border-t border-border-dark flex items-center px-4 lg:px-6 gap-3 lg:gap-4 z-20">
          <button onClick={() => setCurrentSlice(s => Math.max(s - 1, 1))} className="text-white hover:text-cyan transition-colors"><SkipBack size={18} className="lg:w-5 lg:h-5" /></button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-cyan transition-colors">
            {isPlaying ? <Pause size={20} className="lg:w-6 lg:h-6" /> : <Play size={20} className="lg:w-6 lg:h-6" />}
          </button>
          <button onClick={() => setCurrentSlice(s => Math.min(s + 1, selectedCase.totalSlices))} className="text-white hover:text-cyan transition-colors"><SkipForward size={18} className="lg:w-5 lg:h-5" /></button>

          {/* Timeline Scrubber */}
          <div className="flex-1 relative h-8 lg:h-10 flex items-center gap-px overflow-hidden mx-2 lg:mx-4">
            {Array.from({ length: 30 }).map((_, i) => {
              const sliceForBar = Math.round((i / 29) * selectedCase.totalSlices);
              const isCurrent = Math.abs(sliceForBar - currentSlice) <= (selectedCase.totalSlices / 30);
              return (
                <button
                  key={i}
                  onClick={() => setCurrentSlice(Math.max(1, sliceForBar))}
                  className={`flex-1 h-full rounded-sm transition-all duration-100 ${isCurrent ? 'bg-cyan shadow-[0_0_8px_rgba(20,245,214,0.5)]' : 'bg-gray-700/50 hover:bg-gray-600'}`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Analysis Sidebar */}
      <section className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-border-light dark:border-border-dark flex flex-col p-4 lg:p-6 overflow-y-auto bg-white/50 dark:bg-card-dark/50 backdrop-blur-xl flex-shrink-0 h-auto lg:h-full">
        <div className="flex items-center gap-2 mb-4 lg:mb-6">
          <Brain className="text-cyan w-5 h-5 lg:w-6 lg:h-6" />
          <h2 className="text-base lg:text-lg font-bold text-primary dark:text-white">{modelName} Analysis</h2>
        </div>

        {selectedCase.confidence > 0 ? (
          <>
            {/* Circular Confidence Score */}
            <div className="mb-6 lg:mb-8 flex flex-col items-center relative">
              <div className="relative w-32 h-32 lg:w-40 lg:h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="dark:stroke-gray-700" cx="50%" cy="50%" fill="none" r="44%" stroke="#E6E6E6" strokeWidth="10%"></circle>
                  <circle
                    className="drop-shadow-[0_0_10px_rgba(20,245,214,0.5)] transition-all duration-1000 ease-out"
                    cx="50%" cy="50%" fill="none" r="44%"
                    stroke={selectedCase.confidence >= 80 ? '#14F5D6' : selectedCase.confidence >= 50 ? '#F5A623' : '#FE5796'}
                    strokeDasharray="276"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round" strokeWidth="10%"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl lg:text-4xl font-bold text-primary dark:text-white">{selectedCase.confidence}%</span>
                  <span className="text-[9px] lg:text-[10px] text-gray-500 uppercase tracking-widest mt-1">Confidence</span>
                </div>
              </div>
              <div className="mt-2 text-center">
                <p className="text-[10px] lg:text-xs text-gray-500">Model: {selectedCase.modelName}</p>
              </div>
            </div>

            {/* AI Summary */}
            <div className="mb-4 p-3 bg-gradient-to-br from-cyan/5 to-transparent border border-cyan/10 rounded-xl">
              <p className="text-[11px] lg:text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic">"{selectedCase.aiSummary}"</p>
            </div>

            {/* Findings Summary */}
            <div className="mb-6">
              <h3 className="text-xs lg:text-sm font-bold text-primary dark:text-white mb-3 flex items-center justify-between">
                Findings Summary
                <span className="text-[9px] lg:text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold">
                  {selectedCase.findings.filter(f => f.severity === 'critical').length > 0
                    ? `${selectedCase.findings.length} Abnormalit${selectedCase.findings.length !== 1 ? 'ies' : 'y'}`
                    : 'Normal'}
                </span>
              </h3>
              <div className="bg-white dark:bg-card-dark rounded-xl p-3 lg:p-4 shadow-sm border border-border-light dark:border-border-dark space-y-3">
                {selectedCase.findings.map((f, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <div className="h-px bg-gray-100 dark:bg-gray-700 w-full"></div>}
                    <div className="flex items-start gap-3">
                      {f.severity === 'critical' ? (
                        <AlertCircle className="text-accent w-3.5 h-3.5 lg:w-4 lg:h-4 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Info className="text-cyan w-3.5 h-3.5 lg:w-4 lg:h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-xs lg:text-sm text-gray-700 dark:text-gray-200 font-bold">{f.title}</p>
                        <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{f.description}</p>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Differential Diagnosis */}
            <div className="mb-6 lg:mb-8 flex-1">
              <h3 className="text-xs lg:text-sm font-bold text-primary dark:text-white mb-3">Differential Diagnosis</h3>
              <div className="space-y-2">
                {selectedCase.diagnosis.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 lg:p-2.5 rounded-lg hover:bg-white dark:hover:bg-card-dark border border-transparent hover:border-border-light dark:hover:border-border-dark transition-all cursor-default">
                    <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 font-medium">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-12 lg:w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${item.val}%` }}></div>
                      </div>
                      <span className={`text-[10px] lg:text-xs font-bold w-6 text-right ${i === 0 ? 'text-primary dark:text-white' : 'text-gray-500'}`}>{item.val}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto space-y-3">
              {confirmed ? (
                <div className="w-full py-2.5 lg:py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full flex items-center justify-center gap-2 text-xs lg:text-sm text-green-600 dark:text-green-400 font-bold">
                  <CheckCircle size={16} /> Findings Confirmed
                </div>
              ) : (
                <button
                  onClick={() => setConfirmed(true)}
                  className="w-full py-2.5 lg:py-3 bg-secondary text-primary font-bold rounded-full shadow-lg shadow-secondary/30 hover:shadow-secondary/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-xs lg:text-sm"
                >
                  <CheckCircle size={16} className="lg:w-[18px] lg:h-[18px]" />
                  Confirm Findings
                </button>
              )}
              {consultSent ? (
                <div className="w-full py-2.5 lg:py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full flex items-center justify-center gap-2 text-xs lg:text-sm text-blue-600 dark:text-blue-400 font-bold">
                  <Send size={16} /> Consult Requested
                </div>
              ) : (
                <button
                  onClick={() => setShowConsultModal(true)}
                  className="w-full py-2.5 lg:py-3 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-xs lg:text-sm"
                >
                  <Users size={16} className="lg:w-[18px] lg:h-[18px]" />
                  Request Consult
                </button>
              )}
            </div>
          </>
        ) : (
          /* Empty state for pending/in-progress scans */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Brain className="w-16 h-16 opacity-20" />
            <p className="text-sm font-medium">
              {selectedCase.status === 'In Progress' ? 'Analysis running...' : 'Awaiting scan data'}
            </p>
            <p className="text-xs text-center max-w-[200px]">{selectedCase.aiSummary}</p>
          </div>
        )}
      </section>

      {/* Consult Modal */}
      {showConsultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-card-dark rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-white/10 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-primary dark:text-white">Request Consult</h3>
              <button onClick={() => setShowConsultModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">Select a specialist for <span className="font-bold text-primary dark:text-white">{selectedCase.patientName}</span></p>
            <div className="space-y-2">
              {[
                { name: 'Dr. Sarah Chen', specialty: 'Pulmonologist', avatar: 'SC' },
                { name: 'Dr. Marcus Webb', specialty: 'Radiologist', avatar: 'MW' },
                { name: 'Dr. Amara Oti', specialty: 'Oncologist', avatar: 'AO' }
              ].map((doc) => (
                <button
                  key={doc.name}
                  onClick={() => {
                    setShowConsultModal(false);
                    setConsultSent(true);
                    db.notifications.add({
                      id: `n-${Date.now()}`,
                      type: 'consult',
                      title: 'Consult Requested',
                      content: `Requested consult from ${doc.name} for patient ${selectedCase.patientName}.`,
                      time: 'Just now',
                      timestamp: Date.now(),
                      read: false,
                      dismissible: true
                    });
                  }}
                  className="w-full flex items-center gap-3 p-3 border border-gray-100 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{doc.avatar}</div>
                  <div>
                    <div className="text-sm font-bold text-primary dark:text-white">{doc.name}</div>
                    <div className="text-[10px] text-gray-500">{doc.specialty}</div>
                  </div>
                  <ChevronRight size={16} className="ml-auto text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}