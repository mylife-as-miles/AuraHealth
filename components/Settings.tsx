import React, { useState } from 'react';
import {
    Shield,
    BrainCircuit,
    Server,
    BellRing,
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
    Microscope
} from 'lucide-react';

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

interface ModelConfig {
    id: string;
    name: string;
    description: string;
    status: 'available' | 'coming_soon';
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
}

const AVAILABLE_MODELS: ModelConfig[] = [
    { id: 'medgemma-27b', name: 'MedGemma 27B', description: 'Larger Google medical reasoning', status: 'available', icon: Sparkles, iconColor: 'text-secondary', iconBg: 'bg-secondary/10' },
    { id: 'med-palm-2', name: 'Med-PaLM 2', description: 'Medical Q&A & core clinical reasoning', status: 'available', icon: Brain, iconColor: 'text-secondary', iconBg: 'bg-secondary/10' },
    { id: 'biogpt', name: 'BioGPT', description: 'Biomedical text & research analysis', status: 'available', icon: FileText, iconColor: 'text-accent', iconBg: 'bg-accent/10' },
    { id: 'chexagent', name: 'CheXagent', description: 'Chest X-ray specialist', status: 'coming_soon', icon: ScanEye, iconColor: 'text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'llava-med', name: 'LLaVA-Med', description: 'Multimodal medical image+text', status: 'coming_soon', icon: Image, iconColor: 'text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'meditron', name: 'Meditron', description: 'Medical language model', status: 'available', icon: MessageSquare, iconColor: 'text-cyan', iconBg: 'bg-cyan/10' },
    { id: 'pmc-llama', name: 'PMC-LLaMA', description: 'Medical literature/USMLE focused', status: 'available', icon: Stethoscope, iconColor: 'text-purple-500', iconBg: 'bg-purple-500/10' },
    { id: 'med-flamingo', name: 'Med-Flamingo', description: 'Med visual Q&A', status: 'coming_soon', icon: Image, iconColor: 'text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'biomedlm', name: 'BioMedLM', description: 'Biomedical LLM from Stanford CRFM', status: 'available', icon: BrainCircuit, iconColor: 'text-cyan', iconBg: 'bg-cyan/10' },
    { id: 'biomedclip', name: 'BiomedCLIP', description: 'Medical image–text embeddings', status: 'available', icon: ScanEye, iconColor: 'text-accent', iconBg: 'bg-accent/10' },
    { id: 'clinical-camel', name: 'Clinical Camel', description: 'Clinical dialogue model', status: 'available', icon: MessageSquare, iconColor: 'text-orange-500', iconBg: 'bg-orange-500/10' },
    { id: 'medgemma-4b', name: 'MedGemma 4B', description: 'Google medical reasoning (4B)', status: 'available', icon: Sparkles, iconColor: 'text-secondary', iconBg: 'bg-secondary/10' },
    { id: 'medsiglip', name: 'MedSigLIP', description: 'Medical image encoder', status: 'coming_soon', icon: ScanEye, iconColor: 'text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'alphagenome', name: 'AlphaGenome', description: 'DNA/genomics analysis', status: 'coming_soon', icon: Dna, iconColor: 'text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'baichuan-m3', name: 'Baichuan-M3', description: 'General health-bench LLM', status: 'available', icon: Microscope, iconColor: 'text-blue-500', iconBg: 'bg-blue-500/10' },
];

export default function Settings() {
    const [mfa, setMfa] = useState(false);
    const [activeModels, setActiveModels] = useState<Record<string, boolean>>({
        'medgemma-27b': true,
        'med-palm-2': true,
        'medgemma-4b': true
    });
    const [infra, setInfra] = useState('local');
    const [alerts, setAlerts] = useState({ critical: true, confidence: true, system: false });

    const toggleModel = (id: string) => {
        setActiveModels(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="h-full overflow-y-auto custom-scrollbar pb-24 relative">
            {/* Floating Documentation Link (Visual adjustment to match design) */}
            <div className="absolute top-0 right-0 -mt-16 hidden lg:flex items-center gap-2 text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer mr-56 z-20">
                <HelpCircle size={16} />
                <span>Documentation</span>
            </div>

            {/* Settings Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Profile & Security Section */}
                <div className="lg:col-span-12 bg-white dark:bg-card-dark rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-border-dark">
                    {/* Header */}
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
                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center space-y-3">
                            <div className="relative group cursor-pointer">
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
                            <button className="text-xs font-bold text-secondary hover:text-secondary/80 transition-colors">
                                Change Photo
                            </button>
                        </div>

                        {/* Inputs Section */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Full Name</label>
                                    <div className="relative">
                                        <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            defaultValue="Alex Williamson"
                                            className="w-full bg-background-light dark:bg-black/20 border-transparent focus:border-secondary focus:ring-0 rounded-xl pl-10 pr-4 py-2.5 text-sm text-primary dark:text-white font-bold outline-none border-2 border-transparent focus:border-secondary transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Profession / Title</label>
                                    <input
                                        type="text"
                                        defaultValue="Chief Resident"
                                        className="w-full bg-background-light dark:bg-black/20 border-transparent focus:border-secondary focus:ring-0 rounded-xl px-4 py-2.5 text-sm text-primary dark:text-white font-bold outline-none border-2 border-transparent focus:border-secondary transition-all"
                                        placeholder="e.g. Cardiologist"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Email Address</label>
                                    <input
                                        type="email"
                                        defaultValue="alex.w@aurahealth.med"
                                        className="w-full bg-background-light dark:bg-black/20 border-transparent focus:border-secondary focus:ring-0 rounded-xl px-4 py-2.5 text-sm text-primary dark:text-white font-bold outline-none border-2 border-transparent focus:border-secondary transition-all"
                                    />
                                </div>

                                <div className="bg-background-light dark:bg-black/20 p-3 rounded-xl border border-transparent dark:border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-primary dark:text-white">Two-Factor Auth</span>
                                        <Toggle checked={mfa} onChange={() => setMfa(!mfa)} />
                                    </div>
                                    <p className="text-[10px] text-gray-500">Secure your account with 2FA.</p>
                                </div>

                                <div className="flex justify-end pt-1">
                                    <button className="text-xs text-accent font-bold hover:underline">Change Password</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Left Column: Model Config */}
                <div className="lg:col-span-12 xl:col-span-7 bg-white dark:bg-card-dark rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-border-dark">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                <BrainCircuit size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-primary dark:text-white">HAI-DEF Model Configuration</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Configure AI diagnostic parameters.</p>
                            </div>
                        </div>
                        <span className="px-2 py-1 bg-cyan/10 text-cyan text-[10px] font-bold rounded-lg border border-cyan/20">v2.4.1 Stable</span>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                        {AVAILABLE_MODELS.map((model) => (
                            <div
                                key={model.id}
                                className={`flex items-center justify-between p-4 border rounded-2xl transition-all duration-200 ${model.status === 'coming_soon' ? 'border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20' : 'border-gray-100 dark:border-gray-700/50 hover:border-secondary/30 bg-white dark:bg-transparent'}`}
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
                                        </div>
                                        <p className={`text-xs mt-1 max-w-xs leading-relaxed ${model.status === 'coming_soon' ? 'text-gray-400 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {model.description}
                                        </p>
                                    </div>
                                </div>
                                <Toggle
                                    checked={!!activeModels[model.id]}
                                    onChange={() => toggleModel(model.id)}
                                    disabled={model.status === 'coming_soon'}
                                />
                            </div>
                        ))}

                        {/* Checkboxes */}
                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Reasoning Modules</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {['Oncology Cross-Ref', 'Drug Interaction API', 'Genetic Marker DB', 'Pediatric Dosage'].map((label, i) => (
                                    <label key={i} className="flex items-center gap-3 p-3 bg-background-light dark:bg-black/20 rounded-xl cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                                        <div className="relative flex items-center">
                                            <input type="checkbox" defaultChecked={i < 2} className="peer appearance-none w-5 h-5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 checked:bg-secondary checked:border-secondary transition-colors" />
                                            <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span className="text-xs font-bold text-primary dark:text-white select-none">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Infrastructure & Alerts */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                    {/* Infrastructure */}
                    <div className="bg-white dark:bg-card-dark rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-border-dark relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/5 rounded-bl-full pointer-events-none"></div>
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary dark:text-white">
                                <Server size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-primary dark:text-white">Infrastructure</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Data processing environment.</p>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div
                                onClick={() => setInfra('local')}
                                className={`p-3 border-2 rounded-xl flex items-start gap-3 cursor-pointer transition-all ${infra === 'local' ? 'border-secondary bg-secondary/5' : 'border-transparent bg-background-light dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${infra === 'local' ? 'border-secondary' : 'border-gray-400'}`}>
                                    {infra === 'local' && <div className="w-2 h-2 rounded-full bg-secondary"></div>}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-primary dark:text-white">Local Processing</span>
                                        <span className="text-[9px] bg-secondary text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Recommended</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">Data remains on-premise. HIPAA Compliant.</p>
                                </div>
                            </div>

                            <div
                                onClick={() => setInfra('cloud')}
                                className={`p-3 border-2 rounded-xl flex items-start gap-3 cursor-pointer transition-all ${infra === 'cloud' ? 'border-secondary bg-secondary/5' : 'border-transparent bg-background-light dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${infra === 'cloud' ? 'border-secondary' : 'border-gray-400'}`}>
                                    {infra === 'cloud' && <div className="w-2 h-2 rounded-full bg-secondary"></div>}
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-primary dark:text-white">Aura Cloud Secure</span>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">Encrypted cloud processing for heavy loads.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-medium">Encryption Level</span>
                            <span className="font-mono font-bold text-primary dark:text-white bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">AES-256-GCM</span>
                        </div>
                    </div>

                    {/* Alert Preferences */}
                    <div className="bg-white dark:bg-card-dark rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-border-dark">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                <BellRing size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-primary dark:text-white">Alert Preferences</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Critical findings & AI updates.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Critical Patient Alerts</span>
                                <Toggle checked={alerts.critical} onChange={() => setAlerts({ ...alerts, critical: !alerts.critical })} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">AI Confidence Drops &lt;80%</span>
                                <Toggle checked={alerts.confidence} onChange={() => setAlerts({ ...alerts, confidence: !alerts.confidence })} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">System Updates</span>
                                <Toggle checked={alerts.system} onChange={() => setAlerts({ ...alerts, system: !alerts.system })} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Save Button */}
            <div className="fixed bottom-6 right-8 md:bottom-12 md:right-16 z-30">
                <button className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-transform transform hover:-translate-y-1">
                    <Save size={20} />
                    Save Changes
                </button>
            </div>
        </div>
    );
}