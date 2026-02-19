import React, { useState } from 'react';
import { Sparkles, Database, LayoutDashboard, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { db } from '../lib/db';
import { seedDatabase } from '../lib/seedData';

interface OnboardingModalProps {
    onComplete: () => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'welcome' | 'seeding' | 'success'>('welcome');

    const handleStartFresh = async () => {
        setLoading(true);
        try {
            // Ensure DB is clear
            await Promise.all([
                db.patients.clear(),
                db.diagnosticCases.clear(),
                db.workflowCards.clear(),
                db.notifications.clear()
            ]);
            await db.appSettings.put({ id: 'settings', onboardingComplete: true, theme: 'light' });
            onComplete();
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const handleImportSample = async () => {
        setLoading(true);
        setStep('seeding');
        try {
            // Artificial delay for "premium" feel and to show the animation
            await new Promise(r => setTimeout(r, 1500));
            await seedDatabase();
            await db.appSettings.put({ id: 'settings', onboardingComplete: true, theme: 'light' });
            setStep('success');
            setTimeout(onComplete, 1000);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0F12]/90 backdrop-blur-md">
            <div className="relative w-full max-w-4xl h-[600px] bg-[#160527] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex">

                {/* Left Side - Visual */}
                <div className="w-1/3 bg-gradient-to-br from-secondary/20 via-[#160527] to-[#160527] relative hidden md:flex flex-col items-center justify-center p-8 text-center border-r border-white/5">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-secondary to-cyan mb-8 flex items-center justify-center shadow-[0_0_40px_rgba(20,245,214,0.3)] animate-pulse">
                        <Sparkles className="text-[#160527] w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">AuraHealth</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Next-generation clinical dashboard powered by MedGemma AI. Experience the future of patient management.
                    </p>
                </div>

                {/* Right Side - Content */}
                <div className="flex-1 p-12 flex flex-col justify-center relative">

                    {step === 'welcome' && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <h1 className="text-3xl font-bold text-white mb-2">Welcome, Dr. Williamson</h1>
                            <p className="text-gray-400 mb-10">How would you like to set up your workspace today?</p>

                            <div className="grid gap-6">
                                {/* Option 1: Sample Data */}
                                <button
                                    onClick={handleImportSample}
                                    disabled={loading}
                                    className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan/50 transition-all text-left flex items-start gap-5 hover:shadow-[0_0_20px_rgba(20,245,214,0.1)]"
                                >
                                    <div className="w-12 h-12 rounded-full bg-cyan/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                        <Database className="text-cyan w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan transition-colors">Import Sample Data</h3>
                                        <p className="text-sm text-gray-500 group-hover:text-gray-400">
                                            Import 20 sample patient records only. Diagnostics, workflow, and AI modules stay empty until you run them.
                                        </p>
                                    </div>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                                        <ArrowRight className="text-cyan" />
                                    </div>
                                </button>

                                {/* Option 2: Empty State */}
                                <button
                                    onClick={handleStartFresh}
                                    disabled={loading}
                                    className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-secondary/50 transition-all text-left flex items-start gap-5"
                                >
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                        <LayoutDashboard className="text-secondary w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-secondary transition-colors">Start from Scratch</h3>
                                        <p className="text-sm text-gray-500 group-hover:text-gray-400">
                                            Begin with an empty workspace. Perfect for connecting your own data sources.
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'seeding' && (
                        <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                            <div className="relative mb-8">
                                <div className="w-20 h-20 rounded-full border-4 border-white/10 border-t-cyan animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Database className="text-cyan w-8 h-8 animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Generating Clinical Data...</h3>
                            <p className="text-gray-400 text-sm max-w-xs mx-auto">
                                Importing patient records and preparing an empty workspace for diagnostics, workflow, and AI analysis.
                            </p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                                <CheckCircle2 className="text-green-500 w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Workspace Ready</h3>
                            <p className="text-gray-400 text-sm mb-8">
                                Your dashboard has been successfully configured.
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
