import React, { useState, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────
type AuthView = 'login' | 'register' | 'forgot' | 'forgot-success';

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

// ─── Password Strength Helper ────────────────────────────────────────
const getPasswordStrength = (pw: string): { label: string; color: string; width: string; score: number } => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (pw.length >= 12) score++;

    if (score <= 1) return { label: 'Weak', color: '#EF4444', width: '20%', score };
    if (score <= 2) return { label: 'Fair', color: '#F59E0B', width: '40%', score };
    if (score <= 3) return { label: 'Good', color: '#54E097', width: '65%', score };
    return { label: 'Strong', color: '#14F5D6', width: '100%', score };
};

// ─── Main Component ──────────────────────────────────────────────────
export default function AuthPage() {
    const [view, setView] = useState<AuthView>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [biometricModal, setBiometricModal] = useState<'touch' | 'face' | null>(null);
    const [fadeKey, setFadeKey] = useState(0);

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [forgotError, setForgotError] = useState('');

    // Trigger fade animation on view change
    useEffect(() => {
        setFadeKey(k => k + 1);
        setErrors({});
        setForgotError('');
    }, [view]);

    // ─── Validation ──────────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateLogin = (): boolean => {
        const errs: FormErrors = {};
        if (!email.trim()) errs.email = 'Email or Medical ID is required';
        if (!password) errs.password = 'Password is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateRegister = (): boolean => {
        const errs: FormErrors = {};
        if (!name.trim()) errs.name = 'Full name is required';
        if (!email.trim()) errs.email = 'Email is required';
        else if (!emailRegex.test(email)) errs.email = 'Please enter a valid email address';
        if (!password) errs.password = 'Password is required';
        else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
        if (!confirmPassword) errs.confirmPassword = 'Please confirm your password';
        else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // Check for existing session
    useEffect(() => {
        if (localStorage.getItem('aura_auth') === 'true') {
            window.location.href = '/';
        }
    }, []);

    // ─── Handlers ────────────────────────────────────────
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateLogin()) return;
        setIsLoading(true);
        setTimeout(() => {
            localStorage.setItem('aura_auth', 'true');
            setIsLoading(false);
            window.location.href = '/';
        }, 1800);
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateRegister()) return;
        setIsLoading(true);
        setTimeout(() => {
            localStorage.setItem('aura_auth', 'true');
            setIsLoading(false);
            window.location.href = '/';
        }, 2000);
    };

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!forgotEmail.trim()) {
            setForgotError('Please enter your email address');
            return;
        }
        if (!emailRegex.test(forgotEmail)) {
            setForgotError('Please enter a valid email address');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setView('forgot-success');
        }, 1500);
    };

    const handleBiometric = (type: 'touch' | 'face') => {
        setBiometricModal(type);
        setTimeout(() => {
            localStorage.setItem('aura_auth', 'true');
            setBiometricModal(null);
            window.location.href = '/';
        }, 2500);
    };

    const switchView = (target: AuthView) => {
        setErrors({});
        setForgotError('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        setView(target);
    };

    // ─── Password strength for registration ─────────────
    const pwStrength = getPasswordStrength(password);

    // ─── Render helpers ──────────────────────────────────
    const ErrorMsg = ({ msg }: { msg?: string }) =>
        msg ? <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{msg}</p> : null;

    // ─── Render ──────────────────────────────────────────
    return (
        <div className="h-screen w-full overflow-hidden flex items-center justify-center bg-[#F3F5F7]">
            <div className="w-full h-full flex flex-col md:flex-row overflow-hidden bg-white shadow-2xl relative">

                {/* ═══════════════ LEFT PANEL ═══════════════ */}
                <div className="w-full md:w-1/2 lg:w-5/12 relative flex flex-col justify-between p-8 md:p-12 lg:p-16 overflow-hidden"
                    style={{ background: 'radial-gradient(circle at top left, #2a0b45 0%, #160527 100%)' }}>

                    {/* Background effects */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full animate-pulse"
                            style={{ background: 'radial-gradient(circle, rgba(20,245,214,0.4) 0%, rgba(84,224,151,0.1) 50%, transparent 70%)' }} />
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#160527] mix-blend-multiply blur-[48px] opacity-50" />
                        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#FE5796] mix-blend-screen blur-[100px] opacity-20" />
                        <div className="absolute inset-0 opacity-5"
                            style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />

                        {/* 3D Medical Graphic */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-[400px] h-[400px]">
                                <img
                                    alt="3D Medical Abstract"
                                    className="w-full h-full object-contain opacity-80 mix-blend-screen drop-shadow-2xl brightness-110 contrast-125"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuArojtWRWgm4z-P5s8eDZOE4htglMuQ_6G5uFDcw-6RbaKVRcwzvZ-qI0rrVwm_mG1jurfgLh5vzJ2DOGvJB1HjlcI2XBw_UAvzUcFf_PaDrwMTAWIfqWXVuLqjVh2ezgLca8g2mdPJRY7Wg5dWbep3UPdjVfptQAlMKp9qj5qnzJ-d_3hPLlgA9HlRgBPmIzUKodBtCmw5Z3Swl9IOn0e7mTTn2f0PpRyifwswPXBTsfibCKwAe6meiH9zljo2HvVmBm7ERW0yS2I"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Logo */}
                    <div className="relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#160527] font-bold"
                                style={{ background: 'linear-gradient(135deg, #54E097, #14F5D6)', boxShadow: '0 0 20px rgba(20, 245, 214, 0.4)' }}>
                                <span className="material-symbols-outlined text-xl">local_hospital</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">AuraHealth</h1>
                        </div>
                    </div>

                    {/* Bottom text */}
                    <div className="relative z-10 mt-auto">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            AI-Driven <br />
                            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #14F5D6, #54E097)' }}>
                                Clinical Excellence
                            </span>
                        </h2>
                        <p className="text-gray-300 text-lg max-w-md leading-relaxed">
                            Secure access to MedGemma and HAI-DEF models for next-generation diagnostics and workflow optimization.
                        </p>
                        <div className="flex items-center gap-4 mt-8">
                            <div className="flex -space-x-3">
                                <img alt="User 1" className="w-10 h-10 rounded-full border-2 border-[#160527] object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwzxqUGVQh23dmlT3ZtgFBgvmw9M4S0wM28PHtVi6i6VLehmxw8zC1UFdZNLwq7oXgPSOUVxCTofUiZev4We1aLF6QACB0x8OQouQF1jUgcIyvLFrUsaSH3IdEZQa3OJM8Mb90psPWEKAq-esKWtfroLDWIf4NuWi0mJGftuzWtLQXLifH3pVRHsKWlDxrdG2xvXNxWCvsczCxJXHEDPAYCLUCDuHW5oVEMp0kx3ncbYJZrsaBMIAchTHu-765HjJWNyT0jW4DjII" />
                                <img alt="User 2" className="w-10 h-10 rounded-full border-2 border-[#160527] object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCACD5gJw1ykGr1nzGXGEsHLTC-PGN67rJ4gyyAyi-tC_M861OW9LYWAQGnSg5Y7C7JkmWJq9WrcJpNX_hYhcPDxR3JMosyMWHtyZY3cZ3CWMXQXl7R2mUe7iv-jiWj03e3tlhli-bjELZeJsxntZPN3urWLP1-aDS8_LC4w9V4KE3a-kVk-TD3KlhgPyA9gS-AIKt3t2Ce9fb-_a-GF8qPZwqTtdlRmb-ZLtZCpkzSaczSs5iIrHiq_Zrnuz99gfBivL4BT0_vbf8" />
                                <img alt="User 3" className="w-10 h-10 rounded-full border-2 border-[#160527] object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqRxoTKUFRAD0sxmgftEVUqBpg3Jcrq5lov9VuVyZGo65nEu-t1jhtKZph7BJK0bd5aSmtypS55YIcp8TfGHM4xxmySytklGcSz2OtCfoOTGSNXpxehNzfPQv0dNM8v-cfpv6NjUmnFqqBeCPFrchTbhRTvLvhWwJnKdh9AJleS9HLSOummTZXZ6TFnUqBT6lraV1AcVAErso_TAgpVvDDwrIkoywAhfjNORfcDh2DvVpLzom8HCeRHhvHWt7fZPMP0Ci9vdEKZ90" />
                            </div>
                            <div className="text-sm text-gray-400">
                                <strong className="text-white block">2k+ Medical Professionals</strong>
                                Trust AuraHealth daily.
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════ RIGHT PANEL ═══════════════ */}
                <div className="w-full md:w-1/2 lg:w-7/12 bg-[#F3F5F7] relative flex items-center justify-center p-6 md:p-12">

                    {/* Contact support */}
                    <div className="absolute top-8 right-8 flex items-center gap-2 text-sm font-medium text-gray-500">
                        Need help? <a className="text-[#160527] hover:text-[#FE5796] transition-colors" href="#">Contact Support</a>
                    </div>

                    <div className="w-full max-w-md">
                        {/* Glass card */}
                        <div className="rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden"
                            style={{
                                background: 'rgba(255, 255, 255, 0.85)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.6)',
                            }}>

                            {/* Decorative blurs */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#54E097]/10 rounded-full blur-[48px] pointer-events-none" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#FE5796]/5 rounded-full blur-[48px] pointer-events-none" />

                            <div className="relative z-10" key={fadeKey} style={{ animation: 'fadeIn 0.35s ease' }}>

                                {/* ─── LOGIN VIEW ─────────────────────── */}
                                {view === 'login' && (
                                    <>
                                        <div className="text-center mb-8">
                                            <h3 className="text-2xl font-bold text-[#160527] mb-2">Welcome Back</h3>
                                            <p className="text-gray-500 text-sm">Please enter your credentials to access the dashboard.</p>
                                        </div>

                                        {/* Tabs */}
                                        <div className="bg-gray-100 p-1 rounded-full flex mb-8 w-full">
                                            <button className="flex-1 py-2.5 rounded-full text-sm font-semibold bg-white text-[#160527] shadow-sm transition-all duration-300">Login</button>
                                            <button onClick={() => switchView('register')} className="flex-1 py-2.5 rounded-full text-sm font-semibold text-gray-500 hover:text-[#160527] transition-colors">Create Account</button>
                                        </div>

                                        <form onSubmit={handleLogin} className="space-y-5" noValidate>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-600 ml-1" htmlFor="login-email">Email or Medical ID</label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">badge</span>
                                                    <input
                                                        id="login-email"
                                                        type="text"
                                                        placeholder="dr.name@hospital.com"
                                                        value={email}
                                                        onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: undefined })); }}
                                                        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-2xl text-sm focus:ring-2 focus:ring-[#14F5D6] focus:border-[#14F5D6] transition-all outline-none text-gray-700 placeholder-gray-400 ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                                                    />
                                                </div>
                                                <ErrorMsg msg={errors.email} />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-600 ml-1" htmlFor="login-password">Password</label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">lock</span>
                                                    <input
                                                        id="login-password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="••••••••"
                                                        value={password}
                                                        onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: undefined })); }}
                                                        className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 border rounded-2xl text-sm focus:ring-2 focus:ring-[#14F5D6] focus:border-[#14F5D6] transition-all outline-none text-gray-700 placeholder-gray-400 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#160527] transition-colors">
                                                        <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
                                                    </button>
                                                </div>
                                                <ErrorMsg msg={errors.password} />
                                                <div className="flex justify-end mt-1">
                                                    <button type="button" onClick={() => switchView('forgot')} className="text-xs font-medium text-[#160527] hover:text-[#FE5796] transition-colors">Forgot Password?</button>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full py-4 mt-4 font-bold rounded-full text-sm uppercase tracking-wide text-[#160527] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                style={{ background: 'linear-gradient(to right, #14F5D6, #54E097)', boxShadow: '0 0 15px rgba(84, 224, 151, 0.3)' }}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                        Authenticating...
                                                    </>
                                                ) : 'Access Dashboard'}
                                            </button>
                                        </form>

                                        {/* Divider */}
                                        <div className="relative my-8">
                                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                                            <div className="relative flex justify-center text-xs">
                                                <span className="px-4 bg-white text-gray-400 uppercase tracking-widest font-semibold">Secure Login</span>
                                            </div>
                                        </div>

                                        {/* Biometric */}
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <button onClick={() => handleBiometric('touch')} className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-[#14F5D6]/50 transition-all group">
                                                <span className="material-symbols-outlined text-[#54E097] group-hover:scale-110 transition-transform">fingerprint</span>
                                                <span className="text-sm font-medium text-gray-600 group-hover:text-[#160527]">Touch ID</span>
                                            </button>
                                            <button onClick={() => handleBiometric('face')} className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-[#FE5796]/50 transition-all group">
                                                <span className="material-symbols-outlined text-[#FE5796] group-hover:scale-110 transition-transform">face</span>
                                                <span className="text-sm font-medium text-gray-600 group-hover:text-[#160527]">Face ID</span>
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* ─── REGISTER VIEW ─────────────────── */}
                                {view === 'register' && (
                                    <>
                                        <div className="text-center mb-8">
                                            <h3 className="text-2xl font-bold text-[#160527] mb-2">Create Account</h3>
                                            <p className="text-gray-500 text-sm">Join thousands of medical professionals on AuraHealth.</p>
                                        </div>

                                        {/* Tabs */}
                                        <div className="bg-gray-100 p-1 rounded-full flex mb-8 w-full">
                                            <button onClick={() => switchView('login')} className="flex-1 py-2.5 rounded-full text-sm font-semibold text-gray-500 hover:text-[#160527] transition-colors">Login</button>
                                            <button className="flex-1 py-2.5 rounded-full text-sm font-semibold bg-white text-[#160527] shadow-sm transition-all duration-300">Create Account</button>
                                        </div>

                                        <form onSubmit={handleRegister} className="space-y-4" noValidate>
                                            {/* Full Name */}
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-600 ml-1" htmlFor="reg-name">Full Name</label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">person</span>
                                                    <input
                                                        id="reg-name"
                                                        type="text"
                                                        placeholder="Dr. Jane Smith"
                                                        value={name}
                                                        onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: undefined })); }}
                                                        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-2xl text-sm focus:ring-2 focus:ring-[#14F5D6] focus:border-[#14F5D6] transition-all outline-none text-gray-700 placeholder-gray-400 ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                                                    />
                                                </div>
                                                <ErrorMsg msg={errors.name} />
                                            </div>

                                            {/* Email */}
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-600 ml-1" htmlFor="reg-email">Email Address</label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">mail</span>
                                                    <input
                                                        id="reg-email"
                                                        type="email"
                                                        placeholder="dr.name@hospital.com"
                                                        value={email}
                                                        onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: undefined })); }}
                                                        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-2xl text-sm focus:ring-2 focus:ring-[#14F5D6] focus:border-[#14F5D6] transition-all outline-none text-gray-700 placeholder-gray-400 ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                                                    />
                                                </div>
                                                <ErrorMsg msg={errors.email} />
                                            </div>

                                            {/* Password */}
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-600 ml-1" htmlFor="reg-password">Password</label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">lock</span>
                                                    <input
                                                        id="reg-password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="Min. 8 characters"
                                                        value={password}
                                                        onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: undefined })); }}
                                                        className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 border rounded-2xl text-sm focus:ring-2 focus:ring-[#14F5D6] focus:border-[#14F5D6] transition-all outline-none text-gray-700 placeholder-gray-400 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#160527] transition-colors">
                                                        <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
                                                    </button>
                                                </div>
                                                <ErrorMsg msg={errors.password} />
                                                {/* Strength bar */}
                                                {password && (
                                                    <div className="mt-2 flex items-center gap-3 ml-1">
                                                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                            <div className="h-full rounded-full transition-all duration-500" style={{ width: pwStrength.width, background: pwStrength.color }} />
                                                        </div>
                                                        <span className="text-[11px] font-semibold" style={{ color: pwStrength.color }}>{pwStrength.label}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Confirm Password */}
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-600 ml-1" htmlFor="reg-confirm">Confirm Password</label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">lock</span>
                                                    <input
                                                        id="reg-confirm"
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        placeholder="••••••••"
                                                        value={confirmPassword}
                                                        onChange={e => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(p => ({ ...p, confirmPassword: undefined })); }}
                                                        className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 border rounded-2xl text-sm focus:ring-2 focus:ring-[#14F5D6] focus:border-[#14F5D6] transition-all outline-none text-gray-700 placeholder-gray-400 ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200'}`}
                                                    />
                                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#160527] transition-colors">
                                                        <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility' : 'visibility_off'}</span>
                                                    </button>
                                                </div>
                                                <ErrorMsg msg={errors.confirmPassword} />
                                            </div>

                                            {/* Terms */}
                                            <div className="flex items-start gap-2 pt-1">
                                                <input id="terms" type="checkbox" className="mt-1 accent-[#54E097] w-4 h-4 rounded" />
                                                <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                                                    I agree to the <a href="#" className="text-[#160527] font-medium hover:text-[#FE5796]">Terms of Service</a> and <a href="#" className="text-[#160527] font-medium hover:text-[#FE5796]">Privacy Policy</a>
                                                </label>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full py-4 mt-2 font-bold rounded-full text-sm uppercase tracking-wide text-[#160527] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                style={{ background: 'linear-gradient(to right, #14F5D6, #54E097)', boxShadow: '0 0 15px rgba(84, 224, 151, 0.3)' }}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                        Creating Account...
                                                    </>
                                                ) : 'Create Account'}
                                            </button>
                                        </form>

                                        <p className="text-center text-xs text-gray-500 mt-6">
                                            Already have an account? <button onClick={() => switchView('login')} className="text-[#160527] font-semibold hover:text-[#FE5796] transition-colors">Sign In</button>
                                        </p>
                                    </>
                                )}

                                {/* ─── FORGOT PASSWORD VIEW ──────────── */}
                                {view === 'forgot' && (
                                    <>
                                        <div className="text-center mb-8">
                                            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                                                style={{ background: 'linear-gradient(135deg, rgba(20,245,214,0.15), rgba(84,224,151,0.15))' }}>
                                                <span className="material-symbols-outlined text-[32px] text-[#14F5D6]">lock_reset</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-[#160527] mb-2">Reset Password</h3>
                                            <p className="text-gray-500 text-sm">Enter your email address and we'll send you a secure link to reset your password.</p>
                                        </div>

                                        <form onSubmit={handleForgotPassword} className="space-y-5" noValidate>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-600 ml-1" htmlFor="forgot-email">Email Address</label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">mail</span>
                                                    <input
                                                        id="forgot-email"
                                                        type="email"
                                                        placeholder="dr.name@hospital.com"
                                                        value={forgotEmail}
                                                        onChange={e => { setForgotEmail(e.target.value); setForgotError(''); }}
                                                        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-2xl text-sm focus:ring-2 focus:ring-[#14F5D6] focus:border-[#14F5D6] transition-all outline-none text-gray-700 placeholder-gray-400 ${forgotError ? 'border-red-400' : 'border-gray-200'}`}
                                                    />
                                                </div>
                                                {forgotError && <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{forgotError}</p>}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full py-4 mt-4 font-bold rounded-full text-sm uppercase tracking-wide text-[#160527] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                style={{ background: 'linear-gradient(to right, #14F5D6, #54E097)', boxShadow: '0 0 15px rgba(84, 224, 151, 0.3)' }}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                        Sending...
                                                    </>
                                                ) : 'Send Reset Link'}
                                            </button>
                                        </form>

                                        <button onClick={() => switchView('login')} className="w-full text-center text-sm text-gray-500 mt-6 hover:text-[#160527] transition-colors flex items-center justify-center gap-1">
                                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                            Back to Login
                                        </button>
                                    </>
                                )}

                                {/* ─── FORGOT PASSWORD SUCCESS ───────── */}
                                {view === 'forgot-success' && (
                                    <>
                                        <div className="text-center py-6">
                                            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                                                style={{ background: 'linear-gradient(135deg, rgba(84,224,151,0.2), rgba(20,245,214,0.2))', animation: 'pulseGlow 2s infinite' }}>
                                                <span className="material-symbols-outlined text-[40px] text-[#54E097]" style={{ animation: 'checkPop 0.5s ease-out' }}>check_circle</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-[#160527] mb-3">Check Your Inbox</h3>
                                            <p className="text-gray-500 text-sm mb-2">We've sent a password reset link to:</p>
                                            <p className="text-[#160527] font-semibold text-sm mb-6">{forgotEmail}</p>
                                            <p className="text-gray-400 text-xs leading-relaxed max-w-xs mx-auto">
                                                Didn't receive the email? Check your spam folder or <button onClick={() => { setView('forgot'); }} className="text-[#160527] font-medium hover:text-[#FE5796]">try again</button>.
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => switchView('login')}
                                            className="w-full py-4 mt-4 font-bold rounded-full text-sm uppercase tracking-wide text-[#160527] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                                            style={{ background: 'linear-gradient(to right, #14F5D6, #54E097)', boxShadow: '0 0 15px rgba(84, 224, 151, 0.3)' }}
                                        >
                                            Return to Login
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">lock</span>
                                Protected by 256-bit SSL Encryption. HIPAA Compliant.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════ BIOMETRIC MODAL ═══════════════ */}
            {biometricModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" style={{ backdropFilter: 'blur(4px)' }}>
                    <div className="bg-white rounded-3xl p-10 shadow-2xl text-center max-w-sm mx-4" style={{ animation: 'fadeIn 0.25s ease' }}>
                        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                            style={{
                                background: biometricModal === 'touch'
                                    ? 'linear-gradient(135deg, rgba(84,224,151,0.2), rgba(20,245,214,0.2))'
                                    : 'linear-gradient(135deg, rgba(254,87,150,0.2), rgba(254,87,150,0.1))',
                                animation: 'pulseGlow 1.5s infinite'
                            }}>
                            <span className="material-symbols-outlined text-[40px]"
                                style={{ color: biometricModal === 'touch' ? '#54E097' : '#FE5796', animation: 'bioPulse 1s infinite' }}>
                                {biometricModal === 'touch' ? 'fingerprint' : 'face'}
                            </span>
                        </div>
                        <h4 className="text-lg font-bold text-[#160527] mb-2">
                            {biometricModal === 'touch' ? 'Touch ID Authentication' : 'Face ID Authentication'}
                        </h4>
                        <p className="text-gray-500 text-sm mb-4">
                            {biometricModal === 'touch' ? 'Place your finger on the sensor to verify your identity...' : 'Look at the camera to verify your identity...'}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#54E097] animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 rounded-full bg-[#14F5D6] animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 rounded-full bg-[#54E097] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════ GLOBAL ANIMATIONS ═══════════════ */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(84,224,151,0.3); }
          50% { box-shadow: 0 0 25px 5px rgba(84,224,151,0.15); }
        }
        @keyframes checkPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bioPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
        </div>
    );
}
