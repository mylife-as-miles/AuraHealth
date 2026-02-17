import React, { useState, useMemo, useCallback } from 'react';
import {
  Search,
  MoreHorizontal,
  Plus,
  MoreVertical,
  Clock,
  ImageOff,
  RefreshCw,
  Video,
  Sparkles,
  X,
  AlertCircle,
  FileText,
  ArrowRight,
  Edit3,
  Stethoscope,
  ClipboardList,
  ChevronRight,
  Check,
  ArrowLeft,
  GripVertical,
  User,
  Send,
  MessageSquare,
  Users
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { WorkflowCard as DBWorkflowCard, Patient } from '../lib/types';
import EmptyState from './EmptyState';

// --- Types ---
type ColumnId = 'pending' | 'analysis' | 'consultation' | 'treatment';
type Priority = 'urgent' | 'stable' | 'follow-up';

interface EnrichedCard extends DBWorkflowCard {
  avatarType: 'image' | 'initials';
  avatarBg?: string;
}

// --- Mock Data ---
// --- Mock Data Removed ---

const COLUMNS: { id: ColumnId; label: string; dot: string }[] = [
  { id: 'pending', label: 'Pending Review', dot: 'bg-gray-400' },
  { id: 'analysis', label: 'Analysis in Progress', dot: 'bg-cyan' },
  { id: 'consultation', label: 'Consultation', dot: 'bg-purple-400' },
  { id: 'treatment', label: 'Treatment Plan', dot: 'bg-secondary' }
];

// AI recommendations per card
// --- Dynamic Recommendations ---
const getRecommendations = (card: EnrichedCard) => {
  const recs = [];
  if (card.priority === 'urgent') {
    recs.push({ icon: 'alert', title: 'Priority Escalation', description: 'Condition marked as Urgent. Recommend immediate review.', actionLabel: 'Escalate Now', actionColor: 'hover:bg-accent hover:text-white hover:border-accent' });
  }
  if (card.column === 'analysis') {
    recs.push({ icon: 'file', title: 'Draft Report', description: 'Generate preliminary diagnostic report.', actionLabel: 'Generate Draft', actionColor: 'hover:bg-secondary hover:text-white hover:border-secondary' });
  }
  if (card.column === 'consultation') {
    recs.push({ icon: 'stethoscope', title: 'Prepare Consult', description: 'Compile history and vitals for consultation.', actionLabel: 'Prepare Pack', actionColor: 'hover:bg-cyan hover:text-white hover:border-cyan' });
  }
  return recs;
};

const getNextSteps = (card: EnrichedCard) => {
  const steps = [];
  if (card.priority === 'urgent') steps.push({ icon: 'stethoscope', title: 'Order Stat Labs', subtitle: 'Check critical values', color: 'secondary' });
  steps.push({ icon: 'clipboard', title: 'Review Vitals', subtitle: 'Check recent trends', color: 'cyan' });
  return steps;
};

// --- Helpers ---
const priorityStyle = (p: Priority) => {
  switch (p) {
    case 'urgent': return { bg: 'bg-accent/10', text: 'text-accent', label: 'Urgent', bar: 'bg-accent' };
    case 'stable': return { bg: 'bg-secondary/10', text: 'text-secondary', label: 'Stable', bar: 'bg-secondary' };
    case 'follow-up': return { bg: 'bg-accent/10', text: 'text-accent', label: 'Follow Up', bar: 'bg-accent' };
  }
};

export default function ClinicalWorkflow() {
  const workflowCards = useLiveQuery(() => db.workflowCards.toArray()) || [];
  const patients = useLiveQuery(() => db.patients.toArray()) || [];

  const cards: EnrichedCard[] = useMemo(() => {
    return workflowCards.map(c => {
      const p = patients.find(pat => pat.id === c.patientId);
      // Deterministic color based on ID code
      const colors = ['bg-blue-100 text-blue-600', 'bg-pink-100 text-pink-600', 'bg-amber-100 text-amber-600', 'bg-teal-100 text-teal-600', 'bg-purple-100 text-purple-600', 'bg-green-100 text-green-600'];
      const bgIndex = c.id.charCodeAt(c.id.length - 1) % colors.length;

      return {
        ...c,
        patientName: p?.name || c.patientName || 'Unknown Patient',
        age: p?.age ?? c.age ?? 0,
        gender: p?.gender ? (p.gender === 'Female' ? 'F' : 'M') : c.gender,
        avatar: p?.image || c.avatar,
        avatarType: p?.image || c.avatar ? 'image' : 'initials',
        avatarBg: (p?.image || c.avatar) ? undefined : colors[bgIndex]
      };
    });
  }, [workflowCards, patients]);

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showAssistant, setShowAssistant] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<Record<string, string>>({});
  const [quickNote, setQuickNote] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnId | null>(null);
  const [showAddModal, setShowAddModal] = useState<ColumnId | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');

  const selectedCard = useMemo(() => cards.find(c => c.id === selectedCardId) || null, [cards, selectedCardId]);
  const cardsByColumn = useMemo(() => {
    const result: Record<ColumnId, EnrichedCard[]> = { pending: [], analysis: [], consultation: [], treatment: [] };
    cards.forEach(c => result[c.column].push(c));
    return result;
  }, [cards]);

  // Move card to next column
  const moveCardForward = useCallback((cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    const order: ColumnId[] = ['pending', 'analysis', 'consultation', 'treatment'];
    const idx = order.indexOf(card.column);
    if (idx < order.length - 1) {
      db.workflowCards.update(cardId, {
        column: order[idx + 1],
        aiProgress: order[idx + 1] === 'analysis' ? 0 : card.aiProgress
      });
    }
  }, [cards]);

  const moveCardBack = useCallback((cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    const order: ColumnId[] = ['pending', 'analysis', 'consultation', 'treatment'];
    const idx = order.indexOf(card.column);
    if (idx > 0) {
      db.workflowCards.update(cardId, { column: order[idx - 1] });
    }
  }, [cards]);

  // Drag handlers
  const handleDragStart = (cardId: string) => { setDraggedCardId(cardId); };
  const handleDragOver = (e: React.DragEvent, colId: ColumnId) => { e.preventDefault(); setDragOverColumn(colId); };
  const handleDragLeave = () => { setDragOverColumn(null); };
  const handleDrop = (colId: ColumnId) => {
    if (draggedCardId) {
      if (draggedCardId) {
        db.workflowCards.update(draggedCardId, { column: colId });
      }
    }
    setDraggedCardId(null);
    setDragOverColumn(null);
  };
  const handleDragEnd = () => { setDraggedCardId(null); setDragOverColumn(null); };

  // Action feedback
  const triggerAction = (key: string, label: string) => {
    setActionFeedback(prev => ({ ...prev, [key]: label }));
    setTimeout(() => setActionFeedback(prev => { const copy = { ...prev }; delete copy[key]; return copy; }), 2500);
  };

  // Save note
  const saveNote = () => {
    if (!selectedCardId || !quickNote.trim()) return;
    if (!selectedCardId || !quickNote.trim()) return;
    db.workflowCards.update(selectedCardId, { note: quickNote });
    setQuickNote('');
    setShowNoteModal(false);
    triggerAction('note', 'Note saved');
  };

  // Patient pool from Patient Records
  const existingPatientNames = useMemo(() => new Set(cards.map(c => c.patientName)), [cards]);

  const filteredPool = useMemo(() => {
    const q = pickerSearch.toLowerCase();
    return patients.filter(p => !existingPatientNames.has(p.name) && (
      p.name.toLowerCase().includes(q) ||
      p.condition.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    ));
  }, [pickerSearch, patients, existingPatientNames]);

  const addPatientFromPool = async (poolPatient: Patient) => {
    if (!showAddModal) return;
    const riskToPriority: Record<string, Priority> = { 'High Risk': 'urgent', 'Moderate': 'stable', 'Low Risk': 'stable' };

    try {
      const id = `wf-${Date.now()}`;
      await db.workflowCards.add({
        id,
        patientId: poolPatient.id,
        patientName: poolPatient.name,
        age: poolPatient.age,
        gender: poolPatient.gender,
        column: showAddModal,
        priority: riskToPriority[poolPatient.risk] || 'stable',
        scanType: poolPatient.condition,
        time: 'Just now',
        tags: []
      });
      setSelectedCardId(id);
      setShowAddModal(null);
      setPickerSearch('');
    } catch (e) {
      console.error("Failed to add card", e);
    }
  };

  const recIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertCircle size={16} />;
      case 'file': return <FileText size={16} />;
      case 'stethoscope': return <Stethoscope size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };
  const recIconBg = (type: string) => {
    switch (type) {
      case 'alert': return 'bg-accent/10 text-accent';
      case 'file': return 'bg-secondary/10 text-secondary';
      case 'stethoscope': return 'bg-cyan/10 text-cyan';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="flex h-full overflow-hidden flex-col">
      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 flex flex-col h-full overflow-hidden ${showAssistant ? 'pr-0 md:pr-4' : 'pr-0'}`}>
          {workflowCards.length === 0 ? (
            <div className="h-full w-full p-6">
              <div className="h-full w-full bg-white dark:bg-card-dark rounded-3xl border border-border-light dark:border-border-dark shadow-soft overflow-hidden">
                <EmptyState
                  icon={ClipboardList}
                  title="No Workflow Cards"
                  description="There are no active patients in the clinical workflow. Import patient data or add a patient from records."
                  color="secondary"
                  actionLabel="Add Patient"
                  onAction={() => setShowAddModal('pending')}
                />
              </div>
            </div>
          ) : (
            /* Kanban Columns */
            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
              <div className="flex h-full gap-4 md:gap-6 min-w-[1000px]">

                {COLUMNS.map(col => (
                  <div
                    key={col.id}
                    className={`flex-1 flex flex-col min-w-[260px] transition-all ${dragOverColumn === col.id ? 'bg-cyan/5 rounded-2xl' : ''}`}
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={() => handleDrop(col.id)}
                  >
                    <div className="flex items-center justify-between mb-4 px-1">
                      <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${col.dot}`}></span>
                        {col.label}
                        <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-bold">{cardsByColumn[col.id].length}</span>
                      </h3>
                      <button onClick={() => setShowAddModal(col.id)} className="text-gray-400 hover:text-cyan dark:hover:text-cyan transition-colors" title={`Add patient to ${col.label}`}>
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                      {cardsByColumn[col.id].map(card => {
                        const ps = priorityStyle(card.priority as Priority);
                        const isSelected = card.id === selectedCardId;
                        const isDragged = card.id === draggedCardId;
                        return (
                          <div
                            key={card.id}
                            draggable
                            onDragStart={() => handleDragStart(card.id)}
                            onDragEnd={handleDragEnd}
                            onClick={() => { setSelectedCardId(card.id); if (!showAssistant) setShowAssistant(true); }}
                            className={`bg-white dark:bg-card-dark p-4 rounded-2xl transition-all cursor-pointer group relative overflow-hidden
                            ${card.priority === 'urgent' ? 'shadow-[0_0_15px_rgba(254,87,150,0.15)] ring-1 ring-accent/30' : 'shadow-sm hover:shadow-md border border-transparent hover:border-border-light dark:hover:border-border-dark'}
                            ${isSelected ? 'ring-2 ring-cyan/50 shadow-[0_0_20px_rgba(20,245,214,0.15)]' : ''}
                            ${isDragged ? 'opacity-40 scale-95' : ''}
                          `}
                          >
                            {/* Left accent bar */}
                            <div className={`absolute left-0 top-0 bottom-0 ${card.priority === 'urgent' ? 'w-1.5' : 'w-1'} ${ps.bar}`}></div>

                            {/* Drag handle */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity">
                              <GripVertical size={14} className="text-gray-400" />
                            </div>

                            <div className="flex justify-between items-start mb-3 pl-2">
                              <span className={`${ps.bg} ${ps.text} text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 ${card.priority === 'urgent' ? 'animate-pulse' : ''}`}>
                                {card.priority === 'urgent' && <AlertCircle size={10} />}
                                {ps.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 mb-3 pl-2">
                              {card.avatarType === 'image' && card.avatar ? (
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                  <img alt="Patient" className="w-full h-full object-cover" src={card.avatar} />
                                </div>
                              ) : (
                                <div className={`w-10 h-10 rounded-full ${card.avatarBg} flex items-center justify-center font-bold text-xs`}>{card.patientName.charAt(0)}</div>
                              )}
                              <div>
                                <h4 className="font-bold text-primary dark:text-white text-sm">{card.patientName}</h4>
                                <p className="text-xs text-gray-500">Age: {card.age} • {card.gender}</p>
                              </div>
                            </div>

                            {/* Scan info */}
                            {card.scanType && card.column !== 'analysis' && (
                              <div className="bg-background-light dark:bg-background-dark rounded-xl p-2 mb-3 flex items-center gap-3 ml-2">
                                <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center text-gray-400">
                                  {card.scanImage ? (
                                    <img alt="Scan" className="w-full h-full object-cover opacity-80" src={card.scanImage} />
                                  ) : (
                                    <ImageOff size={16} />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-[10px] text-gray-400 uppercase font-bold">Latest Scan</p>
                                  <p className="text-xs font-bold text-primary dark:text-white">{card.scanType}</p>
                                </div>
                              </div>
                            )}

                            {/* AI Progress (analysis column) */}
                            {card.column === 'analysis' && card.aiProgress !== undefined && (
                              <div className="bg-background-light dark:bg-background-dark rounded-xl p-2.5 mb-3">
                                <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1.5">
                                  <span className="flex items-center gap-1"><RefreshCw size={10} className="animate-spin" /> MedGemma Processing</span>
                                  <span className="text-cyan-700 dark:text-cyan">{card.aiProgress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-cyan rounded-full shadow-[0_0_8px_rgba(20,245,214,0.6)] transition-all duration-700" style={{ width: `${card.aiProgress}%` }}></div>
                                </div>
                                {card.tags && (
                                  <div className="flex gap-2 mt-2">
                                    {card.tags.map(t => (
                                      <span key={t} className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-[10px] font-bold text-gray-500 dark:text-gray-400">{t}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Consultation note */}
                            {card.column === 'consultation' && card.note && (
                              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg p-2.5 text-xs mb-3 flex items-start gap-2 ml-2 font-medium">
                                <Video size={14} className="mt-0.5 flex-shrink-0" />
                                <span>{card.note}</span>
                              </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-white/5 pl-2">
                              <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                                {card.time ? <><Clock size={10} /> {card.time}</> : card.doctor || ''}
                              </span>
                              {card.doctor && card.time && (
                                <span className="text-[10px] text-gray-400 font-medium">{card.doctor}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Drop zone indicator */}
                      {dragOverColumn === col.id && (
                        <div className="border-2 border-dashed border-cyan/40 rounded-2xl h-24 flex items-center justify-center text-xs text-cyan font-medium">
                          Drop here
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Assistant Side Panel */}
        {showAssistant && (
          <aside className="w-80 bg-white/60 dark:bg-card-dark/60 backdrop-blur-xl border-l border-border-light dark:border-border-dark flex flex-col transition-all duration-300 rounded-l-3xl shadow-2xl z-10 flex-shrink-0 hidden md:flex">
            <div className="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary dark:text-white">
                <Sparkles size={18} className="text-cyan" />
                <h3 className="font-bold text-sm">Workflow Assistant</h3>
              </div>
              <button onClick={() => setShowAssistant(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {selectedCard ? (
                <>
                  {/* Selected Patient Mini-View */}
                  <div className="mb-6">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Selected Patient</p>
                    <div className="bg-white dark:bg-card-dark rounded-xl p-3 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-3">
                      {selectedCard.avatarType === 'image' ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img alt="" className="w-full h-full object-cover" src={selectedCard.avatar} />
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-full ${selectedCard.avatarBg} flex items-center justify-center font-bold text-xs`}>{selectedCard.avatar}</div>
                      )}
                      <div>
                        <h4 className="font-bold text-primary dark:text-white text-sm">{selectedCard.patientName}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {selectedCard.column === 'analysis' && <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></span>}
                          <p className="text-xs text-gray-500 font-medium">
                            {COLUMNS.find(c => c.id === selectedCard.column)?.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  {getRecommendations(selectedCard).length > 0 && (
                    <div className="space-y-4 mb-8">
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">AI Recommended Actions</p>
                      {getRecommendations(selectedCard).map((rec, i) => {
                        const feedbackKey = `rec-${selectedCard.id}-${i}`;
                        return (
                          <div key={i} className="bg-gradient-to-br from-white to-background-light dark:from-card-dark dark:to-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start gap-3 mb-2">
                              <div className={`w-8 h-8 rounded-lg ${recIconBg(rec.icon)} flex items-center justify-center flex-shrink-0`}>
                                {recIcon(rec.icon)}
                              </div>
                              <div>
                                <h5 className="font-bold text-sm text-primary dark:text-white">{rec.title}</h5>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{rec.description}</p>
                              </div>
                            </div>
                            {actionFeedback[feedbackKey] ? (
                              <div className="w-full mt-2 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full text-xs font-bold text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                                <Check size={14} /> {actionFeedback[feedbackKey]}
                              </div>
                            ) : (
                              <button
                                onClick={() => triggerAction(feedbackKey, rec.actionLabel + 'd')}
                                className={`w-full mt-2 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-xs font-bold text-gray-600 dark:text-gray-200 ${rec.actionColor} dark:${rec.actionColor} transition-colors shadow-sm`}
                              >
                                {rec.actionLabel}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Suggested Next Steps */}
                  {getNextSteps(selectedCard).length > 0 && (
                    <div className="mb-8">
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Suggested Next Steps</p>
                      <div className="space-y-2">
                        {getNextSteps(selectedCard).map((step, i) => {
                          const feedbackKey = `step-${selectedCard.id}-${i}`;
                          return actionFeedback[feedbackKey] ? (
                            <div key={i} className="w-full flex items-center justify-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs font-bold text-green-600 dark:text-green-400 gap-1">
                              <Check size={14} /> {actionFeedback[feedbackKey]}
                            </div>
                          ) : (
                            <button
                              key={i}
                              onClick={() => triggerAction(feedbackKey, step.title + ' initiated')}
                              className={`w-full flex items-center justify-between p-3 rounded-xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 hover:border-${step.color} hover:shadow-sm transition-all group text-left`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg bg-${step.color}/10 text-${step.color === 'cyan' ? 'cyan-600 dark:text-cyan' : step.color} flex items-center justify-center`}>
                                  {step.icon === 'stethoscope' ? <Stethoscope size={16} /> : <ClipboardList size={16} />}
                                </div>
                                <div>
                                  <div className={`text-xs font-bold text-primary dark:text-white group-hover:text-${step.color} transition-colors`}>{step.title}</div>
                                  <div className="text-[10px] text-gray-500">{step.subtitle}</div>
                                </div>
                              </div>
                              <ChevronRight size={16} className={`text-gray-400 group-hover:text-${step.color} transition-colors`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Quick Actions</p>
                    <div className="grid grid-cols-2 gap-3">
                      {actionFeedback['move-next'] ? (
                        <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-[10px] font-bold text-green-600 dark:text-green-400">
                          <Check size={16} /> Moved!
                        </div>
                      ) : (
                        <button
                          onClick={() => { moveCardForward(selectedCard.id); triggerAction('move-next', 'Moved'); }}
                          className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 hover:border-cyan/50 hover:shadow-glow transition-all group"
                        >
                          <ArrowRight size={20} className="text-cyan group-hover:translate-x-1 transition-transform" />
                          <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Move Next</span>
                        </button>
                      )}
                      <button
                        onClick={() => setShowNoteModal(true)}
                        className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 hover:border-accent/50 hover:shadow-soft transition-all group"
                      >
                        <Edit3 size={20} className="text-accent group-hover:-translate-y-1 transition-transform" />
                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Quick Note</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 py-12">
                  <User size={32} className="opacity-20" />
                  <p className="text-sm font-medium">Select a patient card</p>
                  <p className="text-xs text-center max-w-[180px]">Click any card on the board to see AI recommendations</p>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Toggle Assistant button when hidden */}
        {!showAssistant && (
          <button
            onClick={() => setShowAssistant(true)}
            className="hidden md:flex fixed right-4 bottom-6 z-20 items-center gap-2 px-4 py-3 bg-primary text-white rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Sparkles size={16} className="text-cyan" />
            <span className="text-xs font-bold">Assistant</span>
          </button>
        )}
      </div>

      {/* Quick Note Modal */}
      {showNoteModal && selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-card-dark rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-white/10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                <MessageSquare size={20} className="text-accent" />
                Quick Note
              </h3>
              <button onClick={() => setShowNoteModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">Add a note for <span className="font-bold text-primary dark:text-white">{selectedCard.patientName}</span></p>
            <textarea
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="Type your note here..."
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-secondary outline-none text-sm dark:text-white resize-none h-28"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowNoteModal(false)} className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={saveNote} className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                <Send size={16} /> Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Picker Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-card-dark rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-white/10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                <Plus size={20} className="text-cyan" />
                Add to {COLUMNS.find(c => c.id === showAddModal)?.label}
              </h3>
              <button onClick={() => { setShowAddModal(null); setPickerSearch(''); }} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-3">Select a patient from existing records</p>

            {/* Search */}
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={pickerSearch}
                onChange={e => setPickerSearch(e.target.value)}
                placeholder="Search by name, condition, or ID..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-cyan outline-none text-sm dark:text-white"
                autoFocus
              />
            </div>

            {/* Patient List */}
            <div className="space-y-2 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
              {filteredPool.map(p => {
                const alreadyOnBoard = existingPatientNames.has(p.name);
                const riskColor = p.risk === 'High Risk' ? 'text-accent' : p.risk === 'Moderate' ? 'text-amber-500' : 'text-secondary';
                return (
                  <button
                    key={p.id}
                    onClick={() => !alreadyOnBoard && addPatientFromPool(p)}
                    disabled={alreadyOnBoard}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${alreadyOnBoard
                      ? 'opacity-40 cursor-not-allowed bg-gray-50 dark:bg-white/5'
                      : 'bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 hover:border-cyan hover:shadow-sm cursor-pointer'
                      }`}
                  >
                    {p.image ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <img alt="" className="w-full h-full object-cover" src={p.image} />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-xs flex-shrink-0">
                        {p.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-primary dark:text-white truncate">{p.name}</h4>
                        <span className="text-[10px] text-gray-400 font-mono flex-shrink-0 ml-2">{p.id}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{p.age}{p.gender === 'F' ? 'F' : 'M'} • {p.condition}</span>
                        <span className={`text-[10px] font-bold ${riskColor}`}>{p.risk}</span>
                      </div>
                    </div>
                    {alreadyOnBoard ? (
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md flex-shrink-0">On Board</span>
                    ) : (
                      <ArrowRight size={16} className="text-gray-300 group-hover:text-cyan flex-shrink-0" />
                    )}
                  </button>
                );
              })}
              {filteredPool.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <User size={24} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No matching patients</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>

  );
}