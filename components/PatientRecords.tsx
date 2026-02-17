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
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { Patient } from '../lib/types';
import EmptyState from './EmptyState';

// --- Types & Interfaces ---

// --- Types imported from ../lib/types ---

// --- Sub-components ---

const AddPatientModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'Male',
    insurance: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!formData.name || !formData.dob) return;

    const age = new Date().getFullYear() - new Date(formData.dob).getFullYear();

    try {
      await db.patients.add({
        id: `#AH-${Math.floor(Math.random() * 9000) + 1000}`,
        name: formData.name,
        age: age > 0 ? age : 0,
        gender: formData.gender,
        lastVisit: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        condition: 'Undiagnosed',
        risk: 'Low Risk',
        riskColor: 'secondary',
        active: false,
        vitals: [],
        medications: [],
        history: [{
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          title: 'Patient Registered',
          type: 'Routine',
          description: 'New patient record created.'
        }],
        insurance: { provider: formData.insurance || 'Unknown', policy: 'Pending' },
        aiSummary: "New patient record. Data insufficient for AI analysis."
      });
      onClose();
      setFormData({ name: '', dob: '', gender: 'Male', insurance: '' });
    } catch (error) {
      console.error("Failed to add patient:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-card-dark rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-white/10 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-primary dark:text-white">Add New Patient</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <label className="relative cursor-pointer group">
              <input type="file" accept="image/*" className="hidden" />
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center group-hover:border-secondary group-hover:bg-secondary/5 transition-all">
                <Camera size={24} className="text-gray-400 group-hover:text-secondary transition-colors" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center border-2 border-white dark:border-card-dark shadow-sm">
                <Plus size={14} className="text-white" />
              </div>
            </label>
            <span className="text-[10px] text-gray-400 font-medium">Upload Photo</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-secondary outline-none text-sm dark:text-white"
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-secondary outline-none text-sm dark:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-secondary outline-none text-sm dark:text-gray-400"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Insurance Provider</label>
            <input
              type="text"
              value={formData.insurance}
              onChange={e => setFormData({ ...formData, insurance: e.target.value })}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-secondary outline-none text-sm dark:text-white"
              placeholder="e.g. BlueCross"
            />
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">Add Patient</button>
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

  return (
    <div className="flex flex-col h-full relative">
      <AddPatientModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* Action Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-primary dark:text-white hidden md:block">Patient Directory</h2>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-72 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-secondary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-card-dark rounded-full text-sm border border-gray-200 dark:border-border-dark focus:ring-2 focus:ring-secondary focus:border-transparent shadow-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 transition-all outline-none"
              placeholder="Search by name, ID or condition..."
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
                    <div className="flex items-center gap-1">Patient Name <ArrowUpDown size={12} className="opacity-50" /></div>
                  </th>
                  <th className="px-4 py-3">ID</th>
                  <th
                    onClick={() => handleSort('lastVisit')}
                    className="px-4 py-3 cursor-pointer hover:text-primary dark:hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">Last Visit <ArrowUpDown size={12} className="opacity-50" /></div>
                  </th>
                  <th className="px-4 py-3 hidden md:table-cell">Condition</th>
                  <th
                    onClick={() => handleSort('risk')}
                    className="px-4 py-3 cursor-pointer hover:text-primary dark:hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">AI Severity <ArrowUpDown size={12} className="opacity-50" /></div>
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
                        <div>
                          <div className="font-bold text-primary dark:text-white">{patient.name}</div>
                          <div className="text-xs text-gray-400">{patient.age} yrs, {patient.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{patient.id}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{patient.lastVisit}</td>
                    <td className="px-4 py-3 font-medium text-primary dark:text-white text-xs hidden md:table-cell">{patient.condition}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getRiskStyles(patient.riskColor || 'secondary')}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getRiskDot(patient.riskColor || 'secondary')}`}></span> {patient.risk}
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

              {/* AI Risk Alert System */}
              {selectedPatient.risk === 'High Risk' && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-3 animate-pulse">
                  <AlertTriangle className="text-red-500 w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-red-700 dark:text-red-400">Critical Risk Alert</h4>
                    <p className="text-[11px] text-red-600 dark:text-red-300 mt-1 leading-tight">AI models detect high probability of adverse event. Immediate review required.</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/diagnostics')}
                  className="flex-1 bg-primary text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
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
                  <ResponsiveContainer width="100%" height="100%">
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
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
              <User size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">No Patient Selected</h3>
              <p className="text-sm text-gray-400 mt-2">Select a patient from the directory to view their detailed medical record, vitals, and AI-driven insights.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}