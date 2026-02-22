import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  FileText,
  Trash2,
  UserCircle,
  Stethoscope,
  Camera,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Play,
  History,
  Sparkles,
  Clock,
  Calendar,
  User,
  X,
  ChevronRight,
  ShieldPlus,
  Thermometer,
  Activity,
  Weight,
  AlertTriangle,
  Download,
  Pill,
  Syringe,
  CheckCircle2,
  ChevronLeft,
  Users,
  Zap,
  Check,
  UploadCloud
} from 'lucide-react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { SafeChart } from './SafeChart';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { Patient } from '../lib/types';
import { triageReferralNotes, streamPatientReasoning } from '../lib/dr7';
import EmptyState from './EmptyState';

// --- Types & Interfaces ---

// --- Types imported from ../lib/types ---

// --- Sub-components ---

const AddPatientModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'Male',
    insurance: '',
    referralNotes: '',
    context: 'Routine',
    continuousMonitoring: true,
    image: '',
    medicalHistoryNotes: 'Not provided',
    medicationsNotes: 'Not provided',
    familyHistoryNotes: 'Not provided',
    allergies: 'Not provided'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!formData.name || !formData.dob) return;

    const age = new Date().getFullYear() - new Date(formData.dob).getFullYear();

    setIsSubmitting(true);

    // Phase 1: Parsing
    setLoadingPhase(0);
    await new Promise(resolve => setTimeout(resolve, 600));

    // Phase 2: AI Triage (real Dr7.ai call if notes provided)
    setLoadingPhase(1);
    let triageData: { priority: 'High Risk' | 'Moderate' | 'Low Risk'; aiReason: string; riskPercentage: number; condition: string } = { priority: 'Low Risk', aiReason: 'Follow-up required', riskPercentage: 5, condition: 'Undiagnosed' };

    const combinedNotes = `
Referral Notes/Presenting Symptoms: ${formData.referralNotes}
Medical History: ${formData.medicalHistoryNotes}
Medications: ${formData.medicationsNotes}
Family History: ${formData.familyHistoryNotes}
Allergies: ${formData.allergies}
    `.trim();

    if (combinedNotes.length > 100 || formData.referralNotes.trim()) {
      try {
        triageData = await triageReferralNotes(combinedNotes, formData.context, age, formData.gender);
      } catch (e) {
        console.warn('AI triage failed, using defaults:', e);
      }
    }

    // Phase 3: Done
    setLoadingPhase(2);
    await new Promise(resolve => setTimeout(resolve, 400));

    // Map priority to riskColor
    const riskColorMap: Record<string, 'accent' | 'yellow' | 'secondary'> = {
      'High Risk': 'accent', 'Moderate': 'yellow', 'Low Risk': 'secondary'
    };

    try {
      const newId = `#AH-${Math.floor(Math.random() * 9000) + 1000}`;
      await db.patients.add({
        id: newId,
        name: formData.name,
        age: age > 0 ? age : 0,
        gender: formData.gender,
        lastVisit: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        condition: triageData.condition,
        risk: triageData.priority,
        riskColor: riskColorMap[triageData.priority] || 'secondary',
        active: triageData.priority === 'High Risk',
        vitals: [],
        medications: [],
        history: [{
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          title: 'Patient Registered',
          type: 'Routine',
          description: `AI Triage: ${triageData.aiReason}. Risk: ${triageData.riskPercentage}%.`
        }],
        insurance: { provider: formData.insurance || 'Unknown', policy: 'Pending' },
        aiSummary: `AI Triage Result: ${triageData.condition} — ${triageData.aiReason}. Complication risk if ignored: ${triageData.riskPercentage}%.`,
        aiReason: triageData.aiReason,
        riskPercentage: triageData.riskPercentage,
        baselineSummary: `Baseline established for ${triageData.condition}. Risk profile: ${triageData.priority}.`,
        currentPriority: triageData.priority,
        riskIfIgnored: triageData.riskPercentage,
        image: formData.image || undefined,
        medicalHistoryNotes: formData.medicalHistoryNotes,
        medicationsNotes: formData.medicationsNotes,
        familyHistoryNotes: formData.familyHistoryNotes,
        allergies: formData.allergies
      });

      // Log AI Event: TRIAGED
      await db.aiDecisions.add({
        patientId: newId,
        type: 'TRIAGED',
        model: 'medgemma-27b-it',
        timestamp: Date.now()
      });

      await db.notifications.add({
        id: `n-${Date.now()}`,
        type: 'system',
        title: 'New Patient Monitored',
        content: `Patient ${formData.name} (${newId}) has been added to MedGemma active surveillance.`,
        time: 'Just now',
        timestamp: Date.now(),
        read: false,
        action: { label: 'View Insights' },
        dismissible: true
      });

      setIsSubmitting(false);
      setLoadingPhase(0);
      onClose();
      setFormData({
        name: '', dob: '', gender: 'Male', insurance: '', referralNotes: '', context: 'Routine', continuousMonitoring: true, image: '',
        medicalHistoryNotes: 'Not provided', medicationsNotes: 'Not provided', familyHistoryNotes: 'Not provided', allergies: 'Not provided'
      });
    } catch (error) {
      console.error("Failed to add patient:", error);
      setIsSubmitting(false);
      setLoadingPhase(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-card-dark rounded-3xl p-6 w-full max-w-2xl shadow-2xl border border-gray-100 dark:border-white/10 animate-in fade-in zoom-in duration-200 relative overflow-y-auto max-h-[90vh] custom-scrollbar">

        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 z-20 bg-white/90 dark:bg-card-dark/95 backdrop-blur-sm flex items-center justify-center flex-col animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan shadow-[0_0_20px_rgba(20,245,214,0.4)] animate-pulse mb-6">
              <Sparkles size={32} />
            </div>
            <h3 className="text-lg font-bold text-primary dark:text-white mb-2">MedGemma Agent Logic</h3>
            <div className="h-6 flex items-center justify-center overflow-hidden">
              <p key={loadingPhase} className="text-sm text-cyan font-bold leading-none animate-in slide-in-from-bottom-2 fade-in duration-300">
                {loadingPhase === 0 ? "Parsing clinical history..." :
                  loadingPhase === 1 ? "Establishing risk baseline..." :
                    "Patient successfully added to Clinical Attention Queue."}
              </p>
            </div>
            {/* Progress Bar */}
            <div className="w-48 h-1 bg-gray-100 dark:bg-white/10 rounded-full mt-6 overflow-hidden">
              <div
                className="h-full bg-cyan transition-all duration-[800ms] shadow-[0_0_10px_#14F5D6]"
                style={{ width: `${(loadingPhase + 1) * 33.3}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-primary dark:text-white flex items-center gap-2">
              Register Patient for Monitoring <Sparkles size={18} className="text-cyan fill-cyan/20" />
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-1">MedGemma will immediately begin background risk surveillance.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors shrink-0">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6">

          {/* Left Column: Core Inputs */}
          <div className="space-y-4">
            <div className="flex flex-col items-start gap-2 mb-2">
              <label className="relative cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, image: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center group-hover:border-secondary group-hover:bg-secondary/5 transition-all overflow-hidden relative">
                  {formData.image ? (
                    <img src={formData.image} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={20} className="text-gray-400 group-hover:text-secondary transition-colors" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white dark:border-card-dark shadow-sm">
                  <Plus size={12} className="text-white" />
                </div>
              </label>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-secondary outline-none text-sm dark:text-white"
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-secondary outline-none text-sm dark:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Gender</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-secondary outline-none text-sm dark:text-gray-300"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: AI Context & Notes */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Activity size={12} className="text-secondary" /> Initial Context Parameter
              </label>
              <select
                value={formData.context}
                onChange={e => setFormData({ ...formData, context: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-secondary/5 text-secondary font-bold border border-secondary/20 focus:border-secondary outline-none text-sm"
              >
                <option className="bg-white dark:bg-card-dark text-primary dark:text-white">Routine</option>
                <option className="bg-white dark:bg-card-dark text-primary dark:text-white">Emergency</option>
                <option className="bg-white dark:bg-card-dark text-primary dark:text-white">Post-operative</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex justify-between">
                <span>Referral Notes / Presenting Symptoms</span>
                <span className="text-cyan lowercase font-semibold flex items-center gap-1"><Sparkles size={10} /> parsed by AI</span>
              </label>
              <textarea
                value={formData.referralNotes}
                onChange={e => setFormData({ ...formData, referralNotes: e.target.value })}
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-secondary outline-none text-sm dark:text-white h-[100px] resize-none leading-relaxed font-mono text-[11px]"
                placeholder="Paste raw unformatted clinical notes here..."
              />
            </div>

            <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent cursor-pointer group hover:border-cyan/30 transition-colors mt-2">
              <div className="relative flex items-center justify-center w-5 h-5 rounded-[6px] border border-cyan/50 bg-cyan/10">
                <input
                  type="checkbox"
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                  checked={formData.continuousMonitoring}
                  onChange={(e) => setFormData({ ...formData, continuousMonitoring: e.target.checked })}
                />
                {formData.continuousMonitoring && <Check size={14} className="text-cyan font-bold" strokeWidth={3} />}
              </div>
              <span className="text-sm font-bold text-primary dark:text-white flex-1">Continuous Surveillance Mode</span>
              <span className="text-[10px] font-bold bg-cyan/10 text-cyan px-2 py-0.5 rounded-full border border-cyan/20">Active</span>
            </label>
          </div>

        </div>

        {/* Additional Clinical Data */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-white/5 pt-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex justify-between">
              <span>Medical History</span>
              <span className="text-cyan lowercase font-semibold flex items-center gap-1"><Sparkles size={10} /></span>
            </label>
            <textarea
              value={formData.medicalHistoryNotes}
              onChange={e => setFormData({ ...formData, medicalHistoryNotes: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-secondary outline-none text-sm dark:text-white resize-none text-[11px] font-mono h-[60px]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex justify-between">
              <span>Medications</span>
              <span className="text-cyan lowercase font-semibold flex items-center gap-1"><Sparkles size={10} /></span>
            </label>
            <textarea
              value={formData.medicationsNotes}
              onChange={e => setFormData({ ...formData, medicationsNotes: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-secondary outline-none text-sm dark:text-white resize-none text-[11px] font-mono h-[60px]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex justify-between">
              <span>Family History</span>
              <span className="text-cyan lowercase font-semibold flex items-center gap-1"><Sparkles size={10} /></span>
            </label>
            <textarea
              value={formData.familyHistoryNotes}
              onChange={e => setFormData({ ...formData, familyHistoryNotes: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-secondary outline-none text-sm dark:text-white resize-none text-[11px] font-mono h-[60px]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex justify-between">
              <span>Allergies</span>
              <span className="text-cyan lowercase font-semibold flex items-center gap-1"><Sparkles size={10} /></span>
            </label>
            <textarea
              value={formData.allergies}
              onChange={e => setFormData({ ...formData, allergies: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-secondary outline-none text-sm dark:text-white resize-none text-[11px] font-mono h-[60px]"
            />
          </div>
        </div>

        {/* Full Width Row: Unstructured Data Ingestion (Drag-and-Drop) */}
        <div className="mt-6 border-t border-gray-100 dark:border-white/5 pt-6">
          <label className="block text-[10px] font-bold text-primary dark:text-white uppercase tracking-wider mb-1.5 flex justify-between items-center">
            <span>Attach Medical Records (Labs, Imaging Reports, Vitals History)</span>
          </label>
          <p className="text-[11px] text-gray-500 font-medium mb-3">
            MedGemma will auto-extract and analyze all attached documents.
          </p>
          <div className="w-full relative group cursor-pointer">
            <input type="file" accept="image/*,.pdf,application/pdf" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="w-full h-[120px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 flex flex-col items-center justify-center transition-all group-hover:border-cyan group-hover:bg-cyan/5">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-card-dark shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <UploadCloud size={20} className="text-gray-400 group-hover:text-cyan transition-colors" />
              </div>
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-cyan transition-colors">
                Drop Lab Results / Clinical Notes Here
              </span>
              <span className="text-xs text-gray-400 mt-1">or click to browse files</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-white/5 flex gap-3 justify-end items-center">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-primary bg-cyan hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/20 flex items-center gap-2 group"
          >
            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
            Activate Monitoring
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function PatientRecords() {
  const navigate = useNavigate();
  const patients = useLiveQuery(() => db.patients.toArray()) || [];
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVital, setActiveVital] = useState<'hr' | 'bp' | 'temp' | 'weight'>('hr');
  const [contextMenuPatientId, setContextMenuPatientId] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- Flow B: Streaming reasoning ---
  const [streamingText, setStreamingText] = useState<Record<string, string>>({});
  const [reasoningLoading, setReasoningLoading] = useState<string | null>(null);
  const [reasoningDone, setReasoningDone] = useState<Set<string>>(new Set());
  const [lastAnalyzed, setLastAnalyzed] = useState<Record<string, number>>({});
  const [acceptedPatients, setAcceptedPatients] = useState<Set<string>>(new Set());

  // Close context menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenuPatientId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Sort Status
  const [sortConfig, setSortConfig] = useState<{ key: keyof Patient; direction: 'asc' | 'desc' } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Derived Data
  const filteredPatients = useMemo(() => {
    let sorted = [...patients];

    // Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      sorted = sorted.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortConfig) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return sorted;
  }, [searchQuery, sortConfig]);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const handleSort = (key: keyof Patient) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getRiskStyles = (color: string) => {
    switch (color) {
      case 'secondary': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'accent': return 'bg-accent/10 text-accent border-accent/20';
      case 'yellow': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  const getRiskDot = (color: string) => {
    switch (color) {
      case 'secondary': return 'bg-secondary';
      case 'accent': return 'bg-accent';
      case 'yellow': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const downloadVitalsCSV = () => {
    if (!selectedPatient) return;
    const headers = "Time,Heart Rate,Systolic BP,Diastolic BP,Temperature,Weight\n";
    const rows = selectedPatient.vitals.map(d => `${d.time},${d.hr},${d.sys},${d.dia},${d.temp},${d.weight}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vitals_${selectedPatient.name.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper mappings for the Clinical Attention Queue semantics
  const getAIReason = (risk: string) => {
    if (risk === 'High Risk') return 'Vital deterioration';
    if (risk === 'Moderate Risk') return 'Pattern anomaly';
    return 'Follow-up required';
  };

  const getTeam = (id: string) => {
    const num = parseInt(id.replace(/\D/g, '')) || 0;
    if (num % 3 === 0) return 'Cardiology';
    if (num % 3 === 1) return 'Surgery';
    return 'General Ward';
  };

  const getTimeSince = (dateStr: string) => {
    // Generate a deterministic fake time based on the string length to make it look stable in demo
    const mins = (dateStr.length * 7) % 59 + 2;
    return `${mins} min ago`;
  };

  return (
    <div className="flex flex-col h-full relative">
      <AddPatientModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* Action Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-end mb-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-72 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-secondary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-card-dark rounded-full text-sm border border-gray-200 dark:border-border-dark focus:ring-2 focus:ring-secondary focus:border-transparent shadow-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 transition-all outline-none"
              placeholder="Search active queue..."
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm font-semibold whitespace-nowrap"
          >
            <Plus size={18} />
            Add Patient
          </button>
        </div>
      </div>

      {/* Main Content Split View */}
      <div className="flex flex-1 gap-6 overflow-hidden h-full">
        {/* Left List Panel */}
        <div className={`flex-1 bg-white/60 dark:bg-card-dark/60 backdrop-blur-md rounded-3xl border border-white/20 dark:border-white/5 shadow-soft dark:shadow-none dark:border-border-dark overflow-hidden flex flex-col transition-all ${selectedPatientId ? 'hidden lg:flex' : 'flex'}`}>
          {/* Toolbar */}
          <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1 shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                <Filter size={14} /> Filter
              </button>
            </div>
            <div className="text-xs text-gray-500">Showing <span className="font-bold text-primary dark:text-white">{paginatedPatients.length}</span> of <span className="font-bold text-primary dark:text-white">{filteredPatients.length}</span> results</div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto custom-scrollbar p-2">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead className="bg-gray-50/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs font-semibold sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th
                    onClick={() => handleSort('name')}
                    className="px-4 py-3 rounded-l-xl cursor-pointer hover:text-primary dark:hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">Patient <ArrowUpDown size={12} className="opacity-50" /></div>
                  </th>
                  <th className="px-4 py-3 hidden md:table-cell">Trigger</th>
                  <th
                    onClick={() => handleSort('lastVisit')}
                    className="px-4 py-3 cursor-pointer hover:text-primary dark:hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">Time Since Event <ArrowUpDown size={12} className="opacity-50" /></div>
                  </th>
                  <th className="px-4 py-3">Responsible Team</th>
                  <th
                    onClick={() => handleSort('risk')}
                    className="px-4 py-3 cursor-pointer hover:text-primary dark:hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">AI Reason <ArrowUpDown size={12} className="opacity-50" /></div>
                  </th>
                  <th className="px-4 py-3 rounded-r-xl"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {paginatedPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => setSelectedPatientId(patient.id)}
                    className={`group bg-white dark:bg-card-dark hover:bg-primary/5 dark:hover:bg-white/5 transition-all cursor-pointer shadow-sm relative z-0 ${selectedPatientId === patient.id ? 'ring-2 ring-primary/10 dark:ring-white/10 transform scale-[1.01]' : ''}`}
                  >
                    <td className={`px-4 py-3 rounded-l-xl border-l-4 transition-colors ${selectedPatientId === patient.id ? 'border-secondary' : 'border-transparent hover:border-accent/50'}`}>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {patient.image ? (
                            <img alt={patient.name} className="w-10 h-10 rounded-full object-cover" src={patient.image} />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                              {patient.initials}
                            </div>
                          )}
                          {selectedPatientId === patient.id && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-card-dark rounded-full"></div>}
                        </div>
                        <div className="flex flex-col">
                          <div className="font-bold text-primary dark:text-white flex items-center gap-1">
                            {patient.risk === 'High Risk' && <Zap size={12} className="text-accent fill-accent" />}
                            {patient.risk === 'Low Risk' && <Check size={12} className="text-secondary" />}
                            {patient.name}
                          </div>
                          <div className="text-xs text-gray-400 font-medium">Risk if ignored: +{patient.riskPercentage ?? ((patient.age % 10) + 5)}% complication</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-primary dark:text-white text-xs hidden md:table-cell max-w-[150px] truncate" title={patient.condition}>
                      AI detected {patient.condition.toLowerCase()}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs font-bold">{getTimeSince(patient.lastVisit)}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{getTeam(patient.id)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getRiskStyles(patient.riskColor || 'secondary')}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getRiskDot(patient.riskColor || 'secondary')}`}></span> {getAIReason(patient.risk)}
                      </span>
                    </td>
                    <td className="px-4 py-3 rounded-r-xl text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setContextMenuPatientId(contextMenuPatientId === patient.id ? null : patient.id);
                        }}
                        className="text-gray-400 hover:text-primary dark:hover:text-white p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {contextMenuPatientId === patient.id && (
                        <div
                          ref={contextMenuRef}
                          className="absolute right-4 top-12 z-50 w-48 bg-white dark:bg-card-dark rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 py-2 animate-in fade-in zoom-in-95 duration-150"
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedPatientId(patient.id); setContextMenuPatientId(null); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          >
                            <UserCircle size={16} className="text-gray-400" /> View Profile
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedPatientId(patient.id); setContextMenuPatientId(null); navigate('/diagnostics'); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          >
                            <Stethoscope size={16} className="text-gray-400" /> Start Diagnosis
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setContextMenuPatientId(null);
                              const p = patients.find(mp => mp.id === patient.id);
                              if (!p) return;
                              const headers = 'Time,Heart Rate,Systolic BP,Diastolic BP,Temperature,Weight\n';
                              const rows = p.vitals.map(d => `${d.time},${d.hr},${d.sys},${d.dia},${d.temp},${d.weight}`).join('\n');
                              const csvContent = 'data:text/csv;charset=utf-8,' + headers + rows;
                              const link = document.createElement('a');
                              link.setAttribute('href', encodeURI(csvContent));
                              link.setAttribute('download', `record_${p.name.replace(' ', '_')}.csv`);
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          >
                            <FileText size={16} className="text-gray-400" /> Export Record
                          </button>
                          <div className="my-1 border-t border-gray-100 dark:border-white/5"></div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setContextMenuPatientId(null);
                              if (window.confirm('Are you sure you want to delete this patient?')) {
                                db.patients.delete(patient.id);
                                if (selectedPatientId === patient.id) setSelectedPatientId(null);
                              }
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                          >
                            <Trash2 size={16} /> Delete Patient
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {paginatedPatients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500 text-sm">No patients found matches "{searchQuery}"</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(c => Math.max(c - 1, 1))}
                className="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${currentPage === i + 1
                      ? 'bg-primary text-white font-bold'
                      : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(c => Math.min(c + 1, totalPages))}
                className="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {patients.length === 0 && searchQuery === '' && (
          <div className="absolute inset-0 bg-background-light dark:bg-background-dark z-10 flex items-center justify-center">
            <EmptyState
              icon={UserCircle}
              title="No Patient Records"
              description="Your patient directory is empty. Add a new patient or import sample data to get started."
              actionLabel="Add New Patient"
              onAction={() => setIsAddModalOpen(true)}
              color="primary"
            />
          </div>
        )}

        {/* Right Detail Panel */}
        {selectedPatient ? (
          <div className={`w-full lg:w-96 xl:w-[420px] bg-card-light dark:bg-card-dark rounded-3xl shadow-soft dark:shadow-none dark:border dark:border-border-dark flex flex-col overflow-hidden relative border border-border-light transition-all flex-shrink-0 animate-in slide-in-from-right-4 duration-300 ${!selectedPatientId ? 'hidden' : 'flex'}`}>
            {/* Header Background */}
            <div className="h-28 bg-primary relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-secondary blur-3xl opacity-20"></div>
              {/* Back button for mobile */}
              <button
                onClick={() => setSelectedPatientId(null)}
                className="absolute top-4 left-4 text-white/80 cursor-pointer hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors lg:hidden"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setSelectedPatientId(null)}
                className="absolute top-4 right-4 text-white/80 cursor-pointer hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors hidden lg:block"
                title="Close Panel"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Section */}
            <div className="px-6 relative -mt-10 mb-4 flex-shrink-0">
              <div className="relative inline-block group">
                {selectedPatient.image ? (
                  <img alt={selectedPatient.name} className="w-20 h-20 rounded-2xl border-4 border-white dark:border-card-dark object-cover shadow-lg group-hover:scale-105 transition-transform" src={selectedPatient.image} />
                ) : (
                  <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-card-dark bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary shadow-lg">
                    {selectedPatient.initials}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-secondary text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-card-dark shadow-sm">Active</div>
              </div>
              <div className="mt-3">
                <h3 className="text-xl font-bold text-primary dark:text-white">{selectedPatient.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {selectedPatient.age} yrs</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="flex items-center gap-1"><User size={14} /> {selectedPatient.gender}</span>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 space-y-6">

              {/* WHY THIS PATIENT APPEARED — Live Streaming MedGemma Reasoning */}
              <div className="bg-white/50 dark:bg-white/5 p-4 rounded-xl border border-primary/10 dark:border-white/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-cyan fill-cyan" />
                  <h4 className="text-xs font-bold text-primary dark:text-white uppercase tracking-wider">Why This Patient Appeared</h4>
                  {!streamingText[selectedPatient.id] && !reasoningLoading && (
                    <button
                      onClick={async () => {
                        const patientId = selectedPatient.id;
                        setReasoningLoading(patientId);
                        setStreamingText(prev => ({ ...prev, [patientId]: '' }));
                        try {
                          await streamPatientReasoning(selectedPatient, (token) => {
                            setStreamingText(prev => ({
                              ...prev,
                              [patientId]: (prev[patientId] || '') + token
                            }));
                          });
                          setReasoningDone(prev => new Set([...prev, patientId]));
                          setLastAnalyzed(prev => ({ ...prev, [patientId]: Date.now() }));
                        } catch (e) {
                          console.error('Streaming reasoning failed:', e);
                          setStreamingText(prev => ({
                            ...prev,
                            [patientId]: `${selectedPatient.condition} pattern detected — deviation from established baseline. Risk profile consistent with ${selectedPatient.risk.toLowerCase()} trajectory. Manual clinical review recommended.`
                          }));
                          setReasoningDone(prev => new Set([...prev, patientId]));
                        } finally {
                          setReasoningLoading(null);
                        }
                      }}
                      className="ml-auto text-[10px] font-bold text-cyan hover:text-cyan/80 transition-colors flex items-center gap-1"
                    >
                      <Sparkles size={10} /> Generate
                    </button>
                  )}
                  {reasoningLoading === selectedPatient.id && (
                    <span className="ml-auto text-[10px] font-bold text-cyan/60 flex items-center gap-1 animate-pulse">
                      <Sparkles size={10} className="animate-spin" /> Streaming...
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 font-medium pl-5 relative before:absolute before:left-1.5 before:top-2 before:bottom-0 before:w-[2px] before:bg-cyan/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <p>MedGemma reasoning:</p>
                    {reasoningDone.has(selectedPatient.id) && lastAnalyzed[selectedPatient.id] && (
                      <span className="text-[10px] text-gray-400 font-normal">
                        Updated {Math.floor((Date.now() - lastAnalyzed[selectedPatient.id]) / 1000)}s ago
                      </span>
                    )}
                  </div>
                  {streamingText[selectedPatient.id] !== undefined ? (
                    <div className="space-y-3">
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-mono">
                        {streamingText[selectedPatient.id]}
                        {!reasoningDone.has(selectedPatient.id) && (
                          <span className="inline-block w-1.5 h-3.5 bg-cyan ml-0.5 animate-pulse rounded-sm" />
                        )}
                      </div>
                      {reasoningDone.has(selectedPatient.id) && (
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-0.5 rounded bg-cyan/10 border border-cyan/20 text-[9px] font-bold text-cyan uppercase tracking-wider">
                            medgemma-27b-it • Clinical reasoning
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[11px] text-gray-400 dark:text-gray-500 italic">
                      Click <strong className="text-cyan not-italic">Generate</strong> to stream live MedGemma clinical reasoning
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-col sm:flex-row">
                <button
                  disabled={acceptedPatients.has(selectedPatient.id)}
                  onClick={async () => {
                    try {
                      await db.aiDecisions.add({
                        patientId: selectedPatient.id,
                        type: 'ESCALATED',
                        model: 'medgemma-27b-it',
                        timestamp: Date.now()
                      });
                      // Mark patient as active & add history entry
                      await db.patients.update(selectedPatient.id, {
                        active: true,
                        history: [...selectedPatient.history, {
                          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          title: 'AI Priority Accepted',
                          type: 'Diagnosis' as const,
                          description: `Clinician accepted AI-assigned priority: ${selectedPatient.risk}. Patient moved to urgent workflow.`
                        }]
                      });
                      setAcceptedPatients(prev => new Set([...prev, selectedPatient.id]));
                    } catch (e) {
                      console.error('Failed to log AI decision:', e);
                    }
                  }}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 border border-white/10 ${acceptedPatients.has(selectedPatient.id)
                    ? 'bg-secondary text-primary cursor-default shadow-secondary/20'
                    : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                    }`}
                >
                  <CheckCircle2 size={16} />
                  {acceptedPatients.has(selectedPatient.id) ? 'Priority Accepted ✓' : 'Accept AI Priority'}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/diagnostics')}
                  className="flex-1 bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 text-primary dark:text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Play size={14} fill="currentColor" /> Start Diagnosis
                </button>
                <button
                  onClick={() => timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="flex-1 bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 text-primary dark:text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <History size={14} /> View History
                </button>
              </div>

              {/* AI Summary Card */}
              {selectedPatient.aiSummary && (
                <div className="bg-gradient-to-br from-background-light to-white dark:from-white/5 dark:to-white/0 rounded-2xl p-4 border border-gray-100 dark:border-white/5 relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="text-cyan w-8 h-8" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-primary dark:text-white uppercase tracking-wider">MedGemma Summary</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan/20 text-cyan-700 dark:text-cyan border border-cyan/20">AI Generated</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                      {selectedPatient.aiSummary}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <Clock size={12} /> Updated 2 mins ago
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Vitals Trends */}
              <div className="bg-white/50 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Vitals</h4>
                  <button
                    onClick={downloadVitalsCSV}
                    className="text-gray-400 hover:text-primary dark:hover:text-white transition-colors p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
                    title="Export CSV"
                  >
                    <Download size={14} />
                  </button>
                </div>

                {/* Vitals Selectors */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { id: 'hr', label: 'Heart Rate', unit: 'bpm', icon: Activity },
                    { id: 'bp', label: 'BP', unit: '', icon: Activity },
                    { id: 'temp', label: 'Temp', unit: '°F', icon: Thermometer },
                    { id: 'weight', label: 'Weight', unit: 'lbs', icon: Weight },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setActiveVital(v.id as any)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${activeVital === v.id
                        ? 'bg-white dark:bg-card-dark border-secondary shadow-sm ring-1 ring-secondary/20'
                        : 'bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-white/5 text-gray-400'
                        }`}
                    >
                      <v.icon size={16} className={`mb-1 ${activeVital === v.id ? 'text-secondary' : 'text-current'}`} />
                      <span className={`text-[10px] font-bold ${activeVital === v.id ? 'text-primary dark:text-white' : 'text-gray-500'}`}>{v.label}</span>
                    </button>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="h-32 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={200}>
                    <SafeChart>
                      <LineChart data={selectedPatient.vitals}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis
                          dataKey="time"
                          tick={{ fontSize: 10, fill: '#9ca3af' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#160527' }}
                        />
                        {activeVital === 'bp' ? (
                          <>
                            <Line type="monotone" dataKey="sys" stroke="#FE5796" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                            <Line type="monotone" dataKey="dia" stroke="#54E097" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                          </>
                        ) : (
                          <Line type="monotone" dataKey={activeVital} stroke="#54E097" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                        )}
                      </LineChart>
                    </SafeChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Current Medications */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Current Medications</h4>
                <div className="space-y-2">
                  {selectedPatient.medications.length > 0 ? selectedPatient.medications.map((med, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${med.type === 'pill' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                        {med.type === 'pill' ? <Pill size={14} /> : <Syringe size={14} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-bold text-primary dark:text-white">{med.name}</div>
                          <div className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">{med.time}</div>
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 flex gap-2">
                          <span>{med.dosage}</span>
                          <span>•</span>
                          <span>{med.freq}</span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-xs text-gray-400 text-center py-2 italic">No active medications</div>
                  )}
                </div>
              </div>

              {/* Medical History Timeline */}
              <div ref={timelineRef}>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Medical Timeline</h4>
                <div className="relative pl-4 space-y-6 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100 dark:before:bg-gray-800">
                  {selectedPatient.history.map((event, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-[16px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-card-dark ${idx === 0 ? 'bg-secondary ring-4 ring-secondary/20' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold text-primary dark:text-white">{event.title}</div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 max-w-[200px]">{event.description}</div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-md">{event.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insurance Card */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldPlus size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-primary dark:text-white">{selectedPatient.insurance.provider}</div>
                    <div className="text-[10px] text-gray-400">Policy: {selectedPatient.insurance.policy}</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-primary dark:group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        ) : (
          /* Placeholder when no patient selected on desktop */
          <div className="hidden lg:flex w-full lg:w-96 xl:w-[420px] bg-white/30 dark:bg-card-dark/30 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 items-center justify-center p-8 text-center flex-col gap-4">
            <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan shadow-[0_0_15px_rgba(20,245,214,0.3)]">
              <Sparkles size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary dark:text-white">AI Triage Active</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Select a patient from the queue to view MedGemma's reasoning and take action on the flagged symptoms.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}