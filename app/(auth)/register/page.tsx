'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, User, UserPlus, Loader2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/login');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 transform -rotate-3 hover:rotate-0 transition-all duration-300">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-slate-400 mt-2">Join the Admin Dashboard</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
          
          <div className="p-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <UserPlus className="w-5 h-5 mr-3 text-blue-400" />
              New User Registration
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start animate-in slide-in-from-top-2">
                <div className="w-5 h-5 mr-3 flex-shrink-0 text-red-400 mt-0.5">⚠️</div>
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="Choose a username"
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
                    placeholder="Create a password"
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
                    Register
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="p-4 bg-slate-900/30 border-t border-slate-700/50 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
