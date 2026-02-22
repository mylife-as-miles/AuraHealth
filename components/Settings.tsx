import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import {
    Shield,
    BrainCircuit,
    AlertTriangle,
    Save,
    Sparkles,
    ScanEye,
    IdCard,
    HelpCircle,
    Camera,
    UserCircle,
    Dna,
    FileText,
    MessageSquare,
    Image,
    Brain,
    Stethoscope,
    Microscope,
    X,
    Check,
    Eye,
    EyeOff,
    Lock,
    CheckCircle
} from 'lucide-react';

// --- Toggle ---
const Toggle = ({ checked, onChange, disabled = false }: { checked: boolean, onChange: () => void, disabled?: boolean }) => (
    <div
        onClick={!disabled ? onChange : undefined}
        className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${disabled ? 'cursor-not-allowed opacity-50 bg-gray-200 dark:bg-gray-700' : 'cursor-pointer'} ${checked && !disabled ? 'bg-secondary' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
        <div
            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-5' : ''}`}
        ></div>
    </div>
);

// --- Types ---
interface ModelConfig {
    id: string;
    name: string;
    description: string;
    status: 'available' | 'coming_soon' | 'always_active';
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
}

const AVAILABLE_MODELS: ModelConfig[] = [
    { id: 'medgemma-4b-it', name: 'MedGemma 27B', description: 'Advanced large-scale medical reasoning model providing high-accuracy clinical analysis.', status: 'available', icon: Sparkles, iconColor: 'text-secondary', iconBg: 'bg-secondary/10' },
    { id: 'biomedclip', name: 'BiomedCLIP', description: 'Contrastive vision-language model for retrieving medical images.', status: 'always_active', icon: ScanEye, iconColor: 'text-accent', iconBg: 'bg-accent/10' },
    { id: 'med-palm-2', name: 'Med-PaLM 2', description: 'Expert-level medical question answering and clinical reasoning capabilities.', status: 'coming_soon', icon: Brain, iconColor: 'text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'biogpt', name: 'BioGPT', description: 'Specialized transformer for biomedical literature mining and research analysis.', status: 'coming_soon', icon: FileText, iconColor: 'text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'chexagent', name: 'CheXagent', description: 'Specialized vision model for interpretation and reporting of Chest X-rays.', status: 'coming_soon', icon: ScanEye, iconColor: 'text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'llava-med', name: 'LLaVA-Med', description: 'Multimodal assistant capable of discussing and analyzing medical imagery.', status: 'coming_soon', icon: Image, iconColor: 'text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'meditron', name: 'Meditron', description: 'Open-source medical LLM adapted for clinical guidelines and decision support.', status: 'coming_soon', icon: MessageSquare, iconColor: 'text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'pmc-llama', name: 'PMC-LLaMA', description: 'Fine-tuned on biomedical academic papers for evidence-based responses.', status: 'coming_soon', icon: Stethoscope, iconColor: 'text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'med-flamingo', name: 'Med-Flamingo', description: 'Few-shot learner for medical visual question answering.', status: 'coming_soon', icon: Image, iconColor: 'text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'biomedlm', name: 'BioMedLM', description: 'Compact biomedical language model optimized for scientific text processing.', status: 'coming_soon', icon: BrainCircuit, iconColor: 'text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'clinical-camel', name: 'Clinical Camel', description: 'Fine-tuned model for simulating patient-doctor clinical dialogues.', status: 'coming_soon', icon: MessageSquare, iconColor: 'text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'medsiglip-v1', name: 'MedSigLIP', description: 'High-fidelity medical image encoder for various diagnostic modalities.', status: 'coming_soon', icon: ScanEye, iconColor: 'text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'alphagenome', name: 'AlphaGenome', description: 'Deep learning system for genomic sequence analysis and variant interpretation.', status: 'coming_soon', icon: Dna, iconColor: 'text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'baichuan-m3', name: 'Baichuan-M3', description: 'Multilingual model with strong performance on general health benchmarks.', status: 'coming_soon', icon: Microscope, iconColor: 'text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-800' },
];

const REASONING_MODULES = ['Oncology Cross-Ref', 'Drug Interaction API', 'Genetic Marker DB', 'Pediatric Dosage'];

// --- Initial state snapshots ---
const INITIAL_PROFILE = { name: '', title: '', email: '' };
const INITIAL_MODELS: Record<string, boolean> = { 'medgemma-4b-it': true };
const INITIAL_MODULES: Record<string, boolean> = { 'Oncology Cross-Ref': true, 'Drug Interaction API': true, 'Genetic Marker DB': false, 'Pediatric Dosage': false };
const INITIAL_MFA = false;


const USER_SETTINGS_ID = 'user-settings';

const DEFAULT_USER_SETTINGS = {
    profileName: INITIAL_PROFILE.name,
    profileTitle: INITIAL_PROFILE.title,
    profileEmail: INITIAL_PROFILE.email,
    mfa: INITIAL_MFA,
    activeModels: INITIAL_MODELS,
    reasoningModules: INITIAL_MODULES,
};

export default function Settings() {
    const userSettingsRows = useLiveQuery(() => db.userSettings.toArray(), []);
    const persistedSettings = userSettingsRows?.find((row) => row.id === USER_SETTINGS_ID);

    const userEmail = localStorage.getItem('aura_auth_email');
    const authUser = useLiveQuery(() => userEmail ? db.authUsers.where('email').equals(userEmail).first() : undefined, [userEmail]);

    const [isHydrated, setIsHydrated] = useState(false);

    // --- Profile state ---
    const [profileName, setProfileName] = useState(DEFAULT_USER_SETTINGS.profileName);
    const [profileTitle, setProfileTitle] = useState(DEFAULT_USER_SETTINGS.profileTitle);
    const [profileEmail, setProfileEmail] = useState(DEFAULT_USER_SETTINGS.profileEmail);
    const [mfa, setMfa] = useState(DEFAULT_USER_SETTINGS.mfa);

    // --- Model state ---
    const [activeModels, setActiveModels] = useState<Record<string, boolean>>({ ...DEFAULT_USER_SETTINGS.activeModels });
    const [reasoningModules, setReasoningModules] = useState<Record<string, boolean>>({ ...DEFAULT_USER_SETTINGS.reasoningModules });
    const [apiModels, setApiModels] = useState<ModelConfig[]>(AVAILABLE_MODELS);

    // --- UI state ---
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);
    const [photoFeedback, setPhotoFeedback] = useState(false);
    const [saveFeedback, setSaveFeedback] = useState(false);
    const [saving, setSaving] = useState(false);

    // --- Saved snapshots for dirty tracking ---
    const [savedProfile, setSavedProfile] = useState({
        name: DEFAULT_USER_SETTINGS.profileName,
        title: DEFAULT_USER_SETTINGS.profileTitle,
        email: DEFAULT_USER_SETTINGS.profileEmail,
    });
    const [savedMfa, setSavedMfa] = useState(DEFAULT_USER_SETTINGS.mfa);
    const [savedModels, setSavedModels] = useState<Record<string, boolean>>({ ...DEFAULT_USER_SETTINGS.activeModels });
    const [savedModules, setSavedModules] = useState<Record<string, boolean>>({ ...DEFAULT_USER_SETTINGS.reasoningModules });

    useEffect(() => {
        if (!persistedSettings || authUser === undefined) return;

        const nextProfile = {
            name: authUser?.name || persistedSettings.profileName,
            title: persistedSettings.profileTitle,
            email: authUser?.email || persistedSettings.profileEmail,
        };

        const nextModels = { ...DEFAULT_USER_SETTINGS.activeModels, ...persistedSettings.activeModels };
        const nextModules = { ...DEFAULT_USER_SETTINGS.reasoningModules, ...persistedSettings.reasoningModules };

        setProfileName(nextProfile.name);
        setProfileTitle(nextProfile.title);
        setProfileEmail(nextProfile.email);
        setMfa(persistedSettings.mfa);
        setActiveModels(nextModels);
        setReasoningModules(nextModules);

        setSavedProfile(nextProfile);
        setSavedMfa(persistedSettings.mfa);
        setSavedModels(nextModels);
        setSavedModules(nextModules);
        setIsHydrated(true);
    }, [persistedSettings, authUser]);

    useEffect(() => {
        if (userSettingsRows === undefined) return;
        if (persistedSettings) return;

        db.userSettings.put({
            id: USER_SETTINGS_ID,
            ...DEFAULT_USER_SETTINGS,
            activeModels: { ...DEFAULT_USER_SETTINGS.activeModels },
            reasoningModules: { ...DEFAULT_USER_SETTINGS.reasoningModules },
            updatedAt: Date.now(),
        }).then(() => setIsHydrated(true));
    }, [userSettingsRows, persistedSettings]);

    // Fetch models from Dr7.ai Medical API
    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await fetch('/api/v1/models', {
                    headers: { 'Authorization': 'Bearer sk-dr7-your-api-key' }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.data && Array.isArray(data.data)) {
                        const fetchedModels = data.data;
                        // Merge fetched models with our local config to preserve icons/colors
                        const mergedModels = AVAILABLE_MODELS.map(localModel => {
                            const apiModel = fetchedModels.find((m: any) => m.id === localModel.id);
                            if (apiModel) {
                                return {
                                    ...localModel,
                                    description: apiModel.description || localModel.description,
                                    status: 'available' as const
                                };
                            }
                            return localModel;
                        });
                        setApiModels(mergedModels);
                    }
                }
            } catch (error) {
                console.warn('Failed to fetch from Dr7.ai API, falling back to local models.', error);
            }
        };
        fetchModels();
    }, []);

    // --- Dirty detection ---
    const isDirty = useMemo(() => {
        if (profileName !== savedProfile.name || profileTitle !== savedProfile.title || profileEmail !== savedProfile.email) return true;
        if (mfa !== savedMfa) return true;
        const modelKeys = new Set([...Object.keys(activeModels), ...Object.keys(savedModels)]);
        for (const k of modelKeys) { if (!!activeModels[k] !== !!savedModels[k]) return true; }
        for (const m of REASONING_MODULES) { if (!!reasoningModules[m] !== !!savedModules[m]) return true; }
        return false;
    }, [profileName, profileTitle, profileEmail, mfa, activeModels, reasoningModules, savedProfile, savedMfa, savedModels, savedModules]);

    const activeModelCount = useMemo(() => Object.values(activeModels).filter(Boolean).length, [activeModels]);

    // --- Handlers ---
    const toggleModel = useCallback((id: string) => {
        setActiveModels(prev => (prev[id] ? {} : { [id]: true }));
    }, []);

    const toggleModule = useCallback((label: string) => {
        setReasoningModules(prev => ({ ...prev, [label]: !prev[label] }));
    }, []);

    const handleSave = useCallback(async () => {
        if (!isDirty || saving || !isHydrated) return;

        setSaving(true);

        const nextProfile = { name: profileName, title: profileTitle, email: profileEmail };
        const nextModels = { ...activeModels };
        const nextModules = { ...reasoningModules };

        await db.userSettings.put({
            id: USER_SETTINGS_ID,
            profileName,
            profileTitle,
            profileEmail,
            mfa,
            activeModels: nextModels,
            reasoningModules: nextModules,
            updatedAt: Date.now(),
        });

        if (authUser?.id) {
            await db.authUsers.update(authUser.id, {
                name: profileName,
                email: profileEmail,
                updatedAt: Date.now()
            });
            if (profileEmail !== userEmail) {
                localStorage.setItem('aura_auth_email', profileEmail);
            }
        }

        setSavedProfile(nextProfile);
        setSavedMfa(mfa);
        setSavedModels(nextModels);
        setSavedModules(nextModules);
        setSaving(false);
        setSaveFeedback(true);
        setTimeout(() => setSaveFeedback(false), 3000);
    }, [isDirty, saving, isHydrated, profileName, profileTitle, profileEmail, mfa, activeModels, reasoningModules, authUser, userEmail]);

    const handleChangePassword = useCallback(() => {
        if (!currentPassword || !newPassword || newPassword !== confirmPassword) return;
        if (newPassword.length < 8) return;
        setPasswordFeedback('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
            setPasswordFeedback(null);
            setShowPasswordModal(false);
        }, 2000);
    }, [currentPassword, newPassword, confirmPassword]);

    const handleChangePhoto = useCallback(() => {
        setPhotoFeedback(true);
        setTimeout(() => setPhotoFeedback(false), 2500);
    }, []);

    const passwordValid = newPassword.length >= 8;
    const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
    const canSave = isHydrated && isDirty && !saving;

    return (
        <div className="h-full overflow-y-auto custom-scrollbar pb-24 relative">
            {/* Floating Documentation Link */}
            <div className="absolute top-0 right-0 -mt-16 hidden lg:flex items-center gap-2 text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer mr-56 z-20">
                <HelpCircle size={16} />
                <span>Documentation</span>
            </div>

            {/* Save Toast */}
            {saveFeedback && (
                <div className="fixed top-6 right-6 z-50 bg-secondary text-white px-5 py-3 rounded-2xl shadow-xl shadow-secondary/30 flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                    <CheckCircle size={18} />
                    <span className="text-sm font-bold">Settings saved successfully</span>
                </div>
            )}

            {/* Settings Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Profile & Security Section */}
                <div className="lg:col-span-12 bg-white dark:bg-card-dark rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-border-dark">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary dark:text-white">
                            <IdCard size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-primary dark:text-white">Profile & Security</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Manage personal details and multi-factor authentication.</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center space-y-3">
                            <div className="relative group cursor-pointer" onClick={handleChangePhoto}>
                                <img
                                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&h=200"
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg group-hover:brightness-90 transition-all"
                                />
                                <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                    <Camera className="text-white drop-shadow-md" size={24} />
                                </div>
                                <div className="absolute bottom-0 right-0 bg-secondary border-2 border-white dark:border-card-dark w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <button onClick={handleChangePhoto} className="text-xs font-bold text-secondary hover:text-secondary/80 transition-colors">
                                {photoFeedback ? (
                                    <span className="flex items-center gap-1 text-secondary"><Check size={12} /> Photo Upload Ready</span>
                                ) : 'Change Photo'}
                            </button>
                        </div>

                        {/* Inputs */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Full Name</label>
                                    <div className="relative">
                                        <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            value={profileName}
                                            onChange={e => setProfileName(e.target.value)}
                                            className="w-full bg-background-light dark:bg-black/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-primary dark:text-white font-bold outline-none border-2 border-transparent focus:border-secondary transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Profession / Title</label>
                                    <input
                                        type="text"
                                        value={profileTitle}
                                        onChange={e => setProfileTitle(e.target.value)}
                                        className="w-full bg-background-light dark:bg-black/20 rounded-xl px-4 py-2.5 text-sm text-primary dark:text-white font-bold outline-none border-2 border-transparent focus:border-secondary transition-all"
                                        placeholder="e.g. Cardiologist"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Email Address</label>
                                    <input
                                        type="email"
                                        value={profileEmail}
                                        onChange={e => setProfileEmail(e.target.value)}
                                        className="w-full bg-background-light dark:bg-black/20 rounded-xl px-4 py-2.5 text-sm text-primary dark:text-white font-bold outline-none border-2 border-transparent focus:border-secondary transition-all"
                                    />
                                </div>

                                <div className="bg-background-light dark:bg-black/20 p-3 rounded-xl border border-transparent dark:border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-primary dark:text-white">Two-Factor Auth</span>
                                        <Toggle checked={mfa} onChange={() => setMfa(!mfa)} />
                                    </div>
                                    <p className="text-[10px] text-gray-500">
                                        {mfa ? '✓ Your account is secured with 2FA.' : 'Secure your account with 2FA.'}
                                    </p>
                                </div>

                                <div className="flex justify-end pt-1">
                                    <button onClick={() => setShowPasswordModal(true)} className="text-xs text-accent font-bold hover:underline flex items-center gap-1">
                                        <Lock size={12} /> Change Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Model Configuration */}
                <div className="lg:col-span-12 xl:col-span-7 bg-white dark:bg-card-dark rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-border-dark">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                <BrainCircuit size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-primary dark:text-white">HAI-DEF Model Configuration</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Configure AI diagnostic parameters. <span className="font-bold text-secondary">{activeModelCount} active</span></p>
                            </div>
                        </div>
                        <span className="px-2 py-1 bg-cyan/10 text-cyan text-[10px] font-bold rounded-lg border border-cyan/20">v2.4.1 Stable</span>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                        {apiModels.map((model) => (
                            <div
                                key={model.id}
                                className={`flex items-center justify-between p-4 border rounded-2xl transition-all duration-200 ${model.status === 'coming_soon'
                                    ? 'border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20'
                                    : model.status === 'always_active'
                                        ? 'border-cyan/30 bg-cyan/5 dark:bg-cyan/5'
                                        : activeModels[model.id]
                                            ? 'border-secondary/30 bg-secondary/5 dark:bg-secondary/5'
                                            : 'border-gray-100 dark:border-gray-700/50 hover:border-secondary/30 bg-white dark:bg-transparent'
                                    }`}
                            >
                                <div className="flex gap-4 items-center">
                                    <div className={`p-2 rounded-lg h-fit ${model.iconBg} ${model.iconColor} ${model.status === 'coming_soon' ? 'opacity-50 grayscale' : ''}`}>
                                        <model.icon size={18} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className={`text-sm font-bold ${model.status === 'coming_soon' ? 'text-gray-400 dark:text-gray-500' : 'text-primary dark:text-white'}`}>
                                                {model.name}
                                            </h4>
                                            {model.status === 'coming_soon' && (
                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700">
                                                    COMING SOON
                                                </span>
                                            )}
                                            {model.status === 'always_active' && (
                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan/10 text-cyan border border-cyan/20">
                                                    ALWAYS ACTIVE
                                                </span>
                                            )}
                                            {activeModels[model.id] && model.status === 'available' && (
                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-secondary/10 text-secondary border border-secondary/20">
                                                    ACTIVE
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-xs mt-1 max-w-xs leading-relaxed ${model.status === 'coming_soon' ? 'text-gray-400 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {model.description}
                                        </p>
                                    </div>
                                </div>
                                {model.status === 'always_active' ? (
                                    <div className="px-3 py-1.5 rounded-full bg-cyan/10 text-cyan text-[10px] font-bold border border-cyan/20 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></span>
                                        ON
                                    </div>
                                ) : (
                                    <Toggle
                                        checked={!!activeModels[model.id]}
                                        onChange={() => toggleModel(model.id)}
                                        disabled={model.status === 'coming_soon'}
                                    />
                                )}
                            </div>
                        ))}

                        {/* Reasoning Modules */}
                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Reasoning Modules</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {REASONING_MODULES.map((label) => (
                                    <label key={label} className="flex items-center gap-3 p-3 bg-background-light dark:bg-black/20 rounded-xl cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={!!reasoningModules[label]}
                                                onChange={() => toggleModule(label)}
                                                className="peer appearance-none w-5 h-5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 checked:bg-secondary checked:border-secondary transition-colors"
                                            />
                                            <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span className="text-xs font-bold text-primary dark:text-white select-none">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Medical Disclaimer */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                    <div className="bg-red-50 dark:bg-red-900/10 rounded-3xl p-6 shadow-sm border border-red-100 dark:border-red-900/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full pointer-events-none"></div>
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-red-700 dark:text-red-400">Medical Disclaimer</h3>
                                <p className="text-xs text-red-600/80 dark:text-red-400/70">Important usage guidelines.</p>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="p-4 bg-white dark:bg-black/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                                <h4 className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <Shield size={12} /> Not Medical Advice
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                    The information provided on this website about MedGemma is for educational and informational purposes only. It is not intended as medical advice, diagnosis, or treatment.
                                </p>
                            </div>

                            <div className="p-4 bg-white dark:bg-black/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                                <h4 className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <Microscope size={12} /> Research Purpose Only
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                    MedGemma models are designed for research and development purposes. They are not clinical-grade tools and should not be used for actual patient care without proper validation and regulatory approval.
                                </p>
                            </div>

                            <div className="space-y-3 pt-2">
                                {[
                                    { title: 'Consult Healthcare Professionals', text: 'Always consult with qualified healthcare professionals for medical decisions. Do not rely solely on AI models for health-related conclusions.' },
                                    { title: 'Use at Your Own Risk', text: 'Users assume full responsibility for any application of MedGemma models. The developers and this website disclaim any liability for medical decisions made based on AI model outputs.' },
                                    { title: 'Validation Required', text: 'Any clinical application requires thorough validation, regulatory compliance, and expert medical oversight before deployment in healthcare settings.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <div className="mt-0.5 min-w-[4px] h-4 rounded-full bg-red-400"></div>
                                        <div>
                                            <strong className="text-xs text-gray-700 dark:text-gray-200 block mb-0.5">{item.title}</strong>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Save Button */}
            <div className="fixed bottom-6 right-8 md:bottom-12 md:right-16 z-30">
                <button
                    onClick={handleSave}
                    disabled={!canSave}
                    className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all transform hover:-translate-y-1 ${saveFeedback
                        ? 'bg-secondary text-white shadow-xl shadow-secondary/30'
                        : canSave
                            ? 'bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30'
                            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-none hover:translate-y-0'
                        }`}
                >
                    {saving ? (
                        <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
                    ) : saveFeedback ? (
                        <><CheckCircle size={20} /> Saved!</>
                    ) : (
                        <><Save size={20} /> Save Changes</>
                    )}
                </button>
                {canSave && !saveFeedback && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full animate-pulse border-2 border-white dark:border-card-dark" />
                )}
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-card-dark rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-white/10 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                                <Lock size={20} className="text-accent" />
                                Change Password
                            </h3>
                            <button onClick={() => { setShowPasswordModal(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setPasswordFeedback(null); }} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        {passwordFeedback ? (
                            <div className="text-center py-6">
                                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle size={28} className="text-secondary" />
                                </div>
                                <p className="text-sm font-bold text-primary dark:text-white">{passwordFeedback}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Password</label>
                                    <div className="relative mt-1.5">
                                        <input
                                            type={showCurrent ? 'text' : 'password'}
                                            value={currentPassword}
                                            onChange={e => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                            className="w-full p-3 pr-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent outline-none text-sm dark:text-white"
                                        />
                                        <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">New Password</label>
                                    <div className="relative mt-1.5">
                                        <input
                                            type={showNew ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            placeholder="Min. 8 characters"
                                            className="w-full p-3 pr-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent outline-none text-sm dark:text-white"
                                        />
                                        <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {newPassword.length > 0 && (
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <div className={`h-1 flex-1 rounded-full ${newPassword.length >= 12 ? 'bg-secondary' : newPassword.length >= 8 ? 'bg-yellow-400' : 'bg-accent'}`} />
                                            <span className={`text-[10px] font-bold ${newPassword.length >= 12 ? 'text-secondary' : newPassword.length >= 8 ? 'text-yellow-500' : 'text-accent'}`}>
                                                {newPassword.length >= 12 ? 'Strong' : newPassword.length >= 8 ? 'Good' : 'Too short'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat new password"
                                        className={`w-full mt-1.5 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border outline-none text-sm dark:text-white ${confirmPassword.length > 0 ? (passwordsMatch ? 'border-secondary' : 'border-accent') : 'border-transparent focus:border-accent'}`}
                                    />
                                    {confirmPassword.length > 0 && !passwordsMatch && (
                                        <p className="text-[10px] text-accent font-bold mt-1">Passwords do not match</p>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => { setShowPasswordModal(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }} className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleChangePassword}
                                        disabled={!currentPassword || !passwordValid || !passwordsMatch}
                                        className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <Lock size={16} /> Update
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}