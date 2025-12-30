'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'LOGIN' | '2FA'>('LOGIN');
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.user.totp_enabled) {
          setUserId(data.user.id);
          setStep('2FA');
        } else {
          // Store user simple session in localStorage for demo
          localStorage.setItem('user', JSON.stringify(data.user));
          router.push('/dashboard');
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token: otp }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify({ id: userId, username, totp_enabled: true }));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Invalid OTP Code');
      }
    } catch (err) {
      setError('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 transform rotate-3 hover:rotate-6 transition-all duration-300">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Login</h1>
          <p className="text-slate-400 mt-2">Input your username and password</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Progress Bar (Visual decorative) */}
          <div className="h-1 w-full bg-slate-700/50">
            <div className={`h-full bg-blue-500 transition-all duration-500 ${step === 'LOGIN' ? 'w-1/2' : 'w-full'}`} />
          </div>

          <div className="p-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              {step === 'LOGIN' ? (
                <>
                  <User className="w-5 h-5 mr-3 text-blue-400" />
                  Sign In
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-3 text-green-400" />
                  Security Verification
                </>
              )}
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start animate-in slide-in-from-top-2">
                <div className="w-5 h-5 mr-3 flex-shrink-0 text-red-400 mt-0.5">⚠️</div>
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}
            
            {step === 'LOGIN' ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center group"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                <div className="text-center mb-6">
                  <p className="text-slate-400 text-sm mb-4">
                    Enter the 6-digit code from your authenticator app
                  </p>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-4 text-center text-2xl font-mono tracking-[0.5em] text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                    placeholder="000000"
                    maxLength={6}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Verify Identity
                      <Shield className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
                
                <button 
                  type="button"
                  onClick={() => { setStep('LOGIN'); setOtp(''); setError(''); }}
                  className="w-full text-slate-500 hover:text-slate-300 text-sm transition-colors"
                >
                  Cancel and return to login
                </button>
              </form>
            )}
          </div>

          {step === 'LOGIN' && (
             <div className="p-4 bg-slate-900/30 border-t border-slate-700/50 text-center">
               <p className="text-slate-400 text-sm">
                 Don't have an account?{' '}
                 <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                   Create User
                 </Link>
               </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
