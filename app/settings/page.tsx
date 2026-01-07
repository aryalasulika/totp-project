'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { useRouter } from 'next/navigation';
import { Server, Shield, Database, Layout, Smartphone, QrCode, CheckCircle, ChevronRight, Lock, Unlock } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // Wizard State
  const [step, setStep] = useState(1);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/login');
    } else {
      setCurrentUser(JSON.parse(stored));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const generate2FA = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/2fa/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      const data = await res.json();
      if (data.qrCode) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setStep(2);
      }
    } catch (e) {
      console.error(e);
      setMsg('Failed to generate 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const verify2FA = async () => {
    setIsLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, token: otp }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedUser = { ...currentUser, totp_enabled: true };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local session
        setStep(3); // Success Step
      } else {
        setMsg('Invalid Code. Please try again.');
      }
    } catch (e) {
      setMsg('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        <Header 
          username={currentUser.username} 
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        
        <main className="flex-1 p-4 sm:p-6 space-y-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">System & Security Settings</h1>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Column: Security Wizard */}
            <div className="xl:col-span-2 space-y-6">
               {/* 2FA Setup Panel */}
               <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                    <Shield className="w-5 h-5 mr-3 text-blue-600" />
                    Two-Factor Authentication
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${currentUser.totp_enabled ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {currentUser.totp_enabled ? 'ENABLED' : 'NOT CONFIGURED'}
                  </span>
                </div>

                <div className="p-6">
                  {currentUser.totp_enabled ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">Your account is secure</h3>
                      <p className="text-slate-500 max-w-md">
                        2FA is verified and active.
                      </p>
                      
                      <div className="pt-4">
                         <button 
                           onClick={async () => {
                             if(!confirm('Are you sure you want to disable 2FA? This will reduce your account security.')) return;
                             try {
                               const res = await fetch('/api/auth/2fa/disable', {
                                 method: 'POST',
                                 headers: { 'Content-Type': 'application/json' },
                                 body: JSON.stringify({ userId: currentUser.id }),
                               });
                               if (res.ok) {
                                  const updated = { ...currentUser, totp_enabled: false };
                                  setCurrentUser(updated);
                                  localStorage.setItem('user', JSON.stringify(updated));
                                  setStep(1); // Reset wizard
                                  setQrCode('');
                                  setSecret('');
                                  setOtp('');
                               }
                             } catch(e) { alert('Failed to disable'); }
                           }}
                           className="text-red-500 hover:text-red-600 text-sm font-medium underline"
                         >
                           Disable Two-Factor Authentication
                         </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Step Indicator */}
                      <div className="flex items-center justify-center">
                         <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'} font-bold`}>1</div>
                            <span className="ml-2 font-medium text-sm hidden sm:block">App</span>
                         </div>
                         <div className={`w-12 h-0.5 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                         <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'} font-bold`}>2</div>
                            <span className="ml-2 font-medium text-sm hidden sm:block">Scan</span>
                         </div>
                         <div className={`w-12 h-0.5 mx-4 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                         <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'} font-bold`}>3</div>
                            <span className="ml-2 font-medium text-sm hidden sm:block">Verify</span>
                         </div>
                      </div>

                      {/* Step Content */}
                      <div className="min-h-[300px] flex flex-col items-center justify-center relative">
                        {step === 1 && (
                          <div className="text-center space-y-6 max-w-lg mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                             <div className="bg-blue-50 p-4 rounded-full inline-block dark:bg-blue-900/30">
                               <Smartphone className="w-12 h-12 text-blue-600" />
                             </div>
                             <h3 className="text-xl font-bold text-slate-900 dark:text-white">Get Authenticator App</h3>
                             <p className="text-slate-600 dark:text-slate-400">
                               Download <span className="font-semibold">Google Authenticator</span> or any TOTP-compatible app on your mobile device.
                             </p>
                             <button 
                               onClick={generate2FA}
                               disabled={isLoading}
                               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm flex items-center mx-auto transition-transform active:scale-95"
                             >
                               I have the app <ChevronRight className="w-4 h-4 ml-2" />
                             </button>
                          </div>
                        )}

                        {step === 2 && (
                          <div className="w-full text-center space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                             <h3 className="text-xl font-bold text-slate-900 dark:text-white">Scan QR Code</h3>
                             <p className="text-slate-600 dark:text-slate-400">
                               Open your app and scan the code below.
                             </p>
                             
                             <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                                <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                                  {qrCode && <Image src={qrCode} alt="QR" width={180} height={180} />}
                                </div>
                                
                                <div className="space-y-4 text-left max-w-xs">
                                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                     <p className="text-xs font-bold text-yellow-800 uppercase mb-1">Secret Key</p>
                                     <code className="text-xs font-mono text-yellow-900 break-all">{secret}</code>
                                  </div>
                                  <div className="text-sm">
                                    <p className="font-medium text-slate-700 dark:text-slate-300 mb-2">Enter the 6-digit code:</p>
                                    <div className="flex gap-2">
                                      <input 
                                        type="text" 
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-32 p-2 border rounded text-center tracking-widest font-mono text-lg dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                        placeholder="000000"
                                        maxLength={6}
                                      />
                                      <button 
                                        onClick={verify2FA}
                                        disabled={isLoading || otp.length < 6}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition"
                                      >
                                        Verify
                                      </button>
                                    </div>
                                    {msg && <p className="text-red-500 text-sm mt-2">{msg}</p>}
                                  </div>
                                </div>
                             </div>
                          </div>
                        )}

                        {step === 3 && ( // Should technically be handled by 'currentUser.totp_enabled' check, but safe fallback
                           <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Success!</h3>
                              <p className="text-slate-600">2FA is now enabled on your account.</p>
                           </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: System Info */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-gray-100 dark:border-slate-700">
                <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white flex items-center">
                  <Server className="w-5 h-5 mr-2 text-blue-500" />
                  System Info
                </h2>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">App Name</dt>
                    <dd className="text-sm font-medium dark:text-white">TOTP Simulator</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Env</dt>
                    <dd className="text-sm font-medium dark:text-white">Localhost</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Version</dt>
                    <dd className="text-sm font-medium dark:text-white">1.0.0</dd>
                  </div>
                </dl>
              </div>

               <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/50 p-6 rounded-lg">
                <h3 className="text-md font-bold text-yellow-800 dark:text-yellow-500 mb-2 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Research Mode
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-600">
                  Forensic artifacts (secrets) are visible for educational analysis.
                </p>
              </div>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}
