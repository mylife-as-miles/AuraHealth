import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    User,
    LayoutDashboard,
    FolderOpen,
    Activity,
    BrainCircuit,
    GitBranch,
    Settings,
    Bell,
    ArrowRight,
    Command,
    FileText,
    Plus
} from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const PAGES = [
    { id: 'dashboard', title: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { id: 'patients', title: 'Patient Records', icon: FolderOpen, path: '/patients' },
    { id: 'diagnostics', title: 'Diagnostics', icon: Activity, path: '/diagnostics' },
    { id: 'ai-insights', title: 'AI Insights', icon: BrainCircuit, path: '/ai-insights' },
    { id: 'workflow', title: 'Clinical Workflow', icon: GitBranch, path: '/workflow' },
    { id: 'settings', title: 'Settings', icon: Settings, path: '/settings' },
    { id: 'notifications', title: 'Notifications', icon: Bell, path: '/notifications' },
];

const PATIENTS: any[] = [];

const ACTIONS = [
    { id: 'add-patient', title: 'Add New Patient', icon: Plus, group: 'Actions' },
    { id: 'new-report', title: 'Draft Diagnostic Report', icon: FileText, group: 'Actions' },
];

export default function CommandPalette({ isOpen, onClose }: Props) {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Reset query when opening
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Filter results
    const results = useMemo(() => {
        const q = query.toLowerCase();

        if (!q) return { patients: [], pages: PAGES, actions: [] };

        const pages = PAGES.filter(p => p.title.toLowerCase().includes(q));
        const patients = PATIENTS.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.id.toLowerCase().includes(q) ||
            p.condition.toLowerCase().includes(q)
        );
        const actions = ACTIONS.filter(a => a.title.toLowerCase().includes(q));

        return { patients, pages, actions };
    }, [query]);

    const flatResults = useMemo(() => {
        return [
            ...results.patients.map(i => ({ ...i, type: 'patient' })),
            ...results.pages.map(i => ({ ...i, type: 'page' })),
            ...results.actions.map(i => ({ ...i, type: 'action' }))
        ];
    }, [results]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % flatResults.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + flatResults.length) % flatResults.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const selected = flatResults[selectedIndex];
                if (selected) {
                    handleSelect(selected);
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, flatResults, selectedIndex]);

    const handleSelect = (item: any) => {
        if (item.type === 'page') {
            navigate(item.path);
        } else if (item.type === 'patient') {
            navigate('/patients'); // In a real app, this would go to /patients/:id
        }
        // Actions would likely trigger other modals, for now just close
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col animate-in zoom-in-95 ease-out duration-200">

                {/* Search Input */}
                <div className="flex items-center px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                        autoFocus
                        className="flex-1 bg-transparent border-none outline-none text-lg text-gray-800 dark:text-gray-100 placeholder-gray-400"
                        placeholder="Search patients, pages, or commands..."
                        value={query}
                        onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                    />
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">ESC</span>
                    </div>
                </div>

                {/* Results List */}
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {flatResults.length === 0 ? (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            <p>No results found.</p>
                        </div>
                    ) : (
                        <div className="space-y-1">

                            {/* Patients Group */}
                            {results.patients.length > 0 && (
                                <div className="mb-2">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2">Patients</h4>
                                    {results.patients.map((patient, i) => {
                                        const isSelected = flatResults.findIndex(r => r === patient && r.type === 'patient') === selectedIndex;
                                        return (
                                            <div
                                                key={patient.id}
                                                onClick={() => handleSelect({ ...patient, type: 'patient' })}
                                                className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 text-primary dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500">
                                                    {patient.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">{patient.name}</span>
                                                        <span className="text-[10px] font-mono text-gray-400">{patient.id}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-400">{patient.age} yrs • {patient.condition}</span>
                                                    </div>
                                                </div>
                                                {isSelected && <ArrowRight size={14} className="opacity-50" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Pages Group */}
                            {results.pages.length > 0 && (
                                <div className="mb-2">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2">Navigation</h4>
                                    {results.pages.map((page, i) => {
                                        const isSelected = flatResults.findIndex(r => r === page && r.type === 'page') === selectedIndex;
                                        return (
                                            <div
                                                key={page.id}
                                                onClick={() => handleSelect({ ...page, type: 'page' })}
                                                className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 text-primary dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                <page.icon size={18} className={isSelected ? 'text-primary' : 'text-gray-400'} />
                                                <span className="flex-1 text-sm font-medium">{page.title}</span>
                                                {isSelected && <ArrowRight size={14} className="opacity-50" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Actions Group */}
                            {results.actions.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2">Actions</h4>
                                    {results.actions.map(action => {
                                        const isSelected = flatResults.findIndex(r => r === action && r.type === 'action') === selectedIndex;
                                        return (
                                            <div
                                                key={action.id}
                                                onClick={() => handleSelect({ ...action, type: 'action' })}
                                                className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 text-primary dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                <action.icon size={18} className={isSelected ? 'text-primary' : 'text-gray-400'} />
                                                <span className="flex-1 text-sm font-medium">{action.title}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-white/5 px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><Command size={10} /> <span>to select</span></span>
                        <span className="flex items-center gap-1"><span>↑↓</span> <span>to navigate</span></span>
                        <span className="flex items-center gap-1"><span>ESC</span> <span>to close</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Powered by Dr7.ai MedGemma</span>
                        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                    </div>
                </div>

            </div>
        </div>
    );
}
