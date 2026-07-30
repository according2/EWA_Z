import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Globe, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AuthViewProps {
  onLoginSuccess: () => void;
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function AuthView({ onLoginSuccess, addToast }: AuthViewProps) {
  const [viewState, setViewState] = useState<'login' | 'mfa' | 'wizard'>('login');
  
  // Login states
  const [email, setEmail] = useState('admin@zylker.com');
  const [password, setPassword] = useState('password');

  // OTP states
  const [otpValue, setOtpValue] = useState<string[]>(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(59);
  const [otpVerified, setOtpVerified] = useState<boolean | null>(null);

  // Setup Wizard States
  const [setupStep, setSetupStep] = useState(1);
  const [setupData, setSetupData] = useState({
    orgName: 'Zylker Tech Myanmar',
    industry: 'Software & Technology',
    currency: 'MMK (Ks)',
    timezone: 'Asia/Yangon (MMT)',
    pfReg: 'SSB-YGN-0029384',
    esiReg: 'TIN-839482910'
  });

  // Timer for OTP countdown
  useEffect(() => {
    let timer: any;
    if (viewState === 'mfa' && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer(t => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpTimer, viewState]);

  // Handler for OTP inputs
  const handleOtpInput = (val: string, index: number) => {
    const updated = [...otpValue];
    updated[index] = val.slice(-1);
    setOtpValue(updated);
    
    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`mfa-otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const verifyOTPCode = () => {
    const fullCode = otpValue.join('');
    if (fullCode === '123456') {
      setOtpVerified(true);
      addToast('MFA verification successful! Access granted.', 'success');
      setTimeout(() => {
        onLoginSuccess();
      }, 800);
    } else {
      setOtpVerified(false);
      addToast('Incorrect OTP. Try clicking "Inject Demo Code" (123456) for simulation!', 'error');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast('Please provide email and password credentials.', 'error');
      return;
    }
    addToast('Credentials accepted. Dispatched Two-Factor Authentication OTP!', 'info');
    setViewState('mfa');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 relative overflow-hidden" id="auth-module-root">
      {/* Background Decorative Blurs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-900/15 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative z-10 transition-all duration-300">
        
        {/* Top Header */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-800/80 text-center bg-slate-950/40">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl mx-auto shadow-lg shadow-blue-600/20 mb-3">
            Z
          </div>
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Enterprise Payroll Suite</span>
          <h2 className="text-xl font-extrabold text-white mt-1">Zoho Payroll Portal</h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium leading-relaxed">
            Configure, manage and disburse statutory compliance and payroll.
          </p>
        </div>

        {/* View Switchers based on active state */}
        <div className="p-8">
          
          {/* LOGIN INTERFACE (Screen 1.02) */}
          {viewState === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5" id="login-interface-form">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Corporate Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="e.g. admin@zylker.com"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Security Password</label>
                    <button 
                      type="button"
                      onClick={() => addToast('Password reset link sent to registered domain administrator.', 'info')} 
                      className="text-[10px] font-bold text-blue-400 hover:underline cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input id="remember-me-check" type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0" />
                <label htmlFor="remember-me-check" className="ml-2 text-xs font-semibold text-slate-400 select-none">
                  Enforce domain-remember cookies (30 days)
                </label>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-lg shadow-blue-600/10 flex items-center justify-center space-x-2"
              >
                <span>Authenticate Credentials</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[9px] text-slate-500 font-bold uppercase tracking-wider">Or Quick Onboard</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  onClick={() => { setViewState('wizard'); addToast('Initializing first-time company builder...', 'info'); }}
                  className="py-2.5 border border-slate-800 hover:bg-slate-800/40 text-slate-300 font-bold text-[11px] rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Setup Tenant</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    addToast('Bypassing credentials for visual preview.', 'success');
                    onLoginSuccess();
                  }}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700/80 text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                >
                  Bypass Login
                </button>
              </div>
            </form>
          )}

          {/* MFA TWO-FACTOR INTERACTIVE KEYPAD (Screen 1.05) */}
          {viewState === 'mfa' && (
            <div className="space-y-6" id="mfa-verification-view">
              <div className="text-center space-y-1.5">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Multi-Factor verification</h4>
                <p className="text-[11px] text-slate-400 px-4 leading-relaxed">
                  We have dispatched a security token code to your primary email address. Input the 6-digit key below.
                </p>
              </div>

              <div className="flex justify-center space-x-2">
                {otpValue.map((char, idx) => (
                  <input
                    key={idx}
                    id={`mfa-otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={char}
                    onChange={(e) => handleOtpInput(e.target.value, idx)}
                    className="w-11 h-11 text-center text-sm font-black bg-slate-950 border border-slate-800 text-white rounded-lg focus:outline-none focus:border-blue-500"
                  />
                ))}
              </div>

              {otpVerified === null ? (
                <div className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Resend token code in <span className="text-slate-300 font-bold font-mono">{otpTimer}s</span>
                </div>
              ) : otpVerified ? (
                <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-lg p-3 text-center flex items-center justify-center space-x-2 text-[11px] text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Access Granted! Loading payroll workspace...</span>
                </div>
              ) : (
                <div className="bg-rose-950/40 border border-rose-800/40 rounded-lg p-3 text-center flex items-center justify-center space-x-2 text-[11px] text-rose-300 font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Code verification failed. Use demo trigger code "123456"</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => { setOtpValue(['1','2','3','4','5','6']); addToast('Injected sandbox credentials "123456"', 'info'); }}
                  className="py-2.5 border border-slate-800 hover:bg-slate-800/40 text-[11px] font-bold text-slate-400 rounded-lg transition-colors cursor-pointer"
                >
                  Inject Demo Code
                </button>
                <button 
                  onClick={verifyOTPCode}
                  className="py-2.5 bg-blue-600 hover:bg-blue-500 text-[11px] font-bold text-white rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Verify Token
                </button>
              </div>

              <div className="text-center pt-2">
                <button 
                  onClick={() => { setViewState('login'); setOtpVerified(null); }}
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300"
                >
                  ← Back to Login Credentials
                </button>
              </div>
            </div>
          )}

          {/* FIRST-TIME TENANT SETUP WIZARD (Screen 1.08) */}
          {viewState === 'wizard' && (
            <div className="space-y-6" id="tenant-setup-wizard-view">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-xs font-bold text-white">Tenant Setup Wizard</h4>
                  <span className="text-[10px] text-slate-500">Configuring branch regulations</span>
                </div>
                <div className="flex items-center space-x-1 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  <span className={setupStep >= 1 ? 'text-blue-400' : ''}>General</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className={setupStep >= 2 ? 'text-blue-400' : ''}>Locality</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className={setupStep >= 3 ? 'text-blue-400' : ''}>Statutory</span>
                </div>
              </div>

              {setupStep === 1 && (
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-400 leading-relaxed">Establish the primary registered identity for legal pay cycles:</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company Legal Name</label>
                      <input 
                        type="text" 
                        value={setupData.orgName} 
                        onChange={(e) => setSetupData({...setupData, orgName: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Industry Vertical</label>
                      <input 
                        type="text" 
                        value={setupData.industry} 
                        onChange={(e) => setSetupData({...setupData, industry: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {setupStep === 2 && (
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-400 leading-relaxed">Choose primary currency and default attendance timezone:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Default Currency</label>
                      <select 
                        value={setupData.currency}
                        onChange={(e) => setSetupData({...setupData, currency: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none"
                      >
                        <option>MMK (Ks)</option>
                        <option>USD ($)</option>
                        <option>THB (฿)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Timezone</label>
                      <input 
                        type="text" 
                        value={setupData.timezone} 
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-500 cursor-not-allowed" 
                        readOnly 
                      />
                    </div>
                  </div>
                </div>
              )}

              {setupStep === 3 && (
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-400 leading-relaxed">Input SSB and tax identification registration keys:</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">SSB Employer Number</label>
                      <input 
                        type="text" 
                        value={setupData.pfReg} 
                        onChange={(e) => setSetupData({...setupData, pfReg: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Taxpayer Identification Number (TIN)</label>
                      <input 
                        type="text" 
                        value={setupData.esiReg} 
                        onChange={(e) => setSetupData({...setupData, esiReg: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none font-mono" 
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                <button 
                  disabled={setupStep === 1}
                  onClick={() => setSetupStep(s => s - 1)}
                  className="px-3 py-1.5 border border-slate-800 hover:bg-slate-800 rounded text-xs text-slate-400 font-bold hover:text-slate-200 disabled:opacity-50"
                >
                  Previous
                </button>
                {setupStep < 3 ? (
                  <button 
                    onClick={() => setSetupStep(s => s + 1)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                  >
                    Next Step
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      addToast(`First-time wizard completed! Corporate identity "${setupData.orgName}" built.`, 'success');
                      onLoginSuccess();
                    }}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                  >
                    Complete Setup
                  </button>
                )}
              </div>

              <div className="text-center pt-1">
                <button 
                  onClick={() => { setViewState('login'); setSetupStep(1); }}
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300"
                >
                  ← Return to Member Login
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
      
      {/* Sandbox Access Footer */}
      <div className="mt-8 text-center text-[11px] text-slate-600 font-medium">
        <span>Zoho Payroll Enterprise Interactive Workspace • Yangon, Myanmar</span>
      </div>
    </div>
  );
}
