'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users, Activity, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import StatsCard from '@/components/dashboard/StatsCard';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/login');
    } else {
      setUser(JSON.parse(stored));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">Loading Security Environment...</div>;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        <Header 
          username={user.username} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Total Users" 
              value="12,345" 
              change="+12% this month" 
              icon={Users} 
              color="bg-blue-500" 
            />
            <StatsCard 
              title="Active Sessions" 
              value="423" 
              icon={Activity} 
              color="bg-green-500" 
            />
            <StatsCard 
              title="2FA Enforced" 
              value="89%" 
              change="+5% from last week" 
              icon={Shield} 
              color="bg-purple-500" 
            />
            <StatsCard 
              title="Failed Attempts" 
              value="23" 
              icon={Lock} 
              color="bg-red-500" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Security Status Panel */}
            <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Security Overview</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${user.totp_enabled ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {user.totp_enabled ? 'SECURE' : 'ATTENTION NEEDED'}
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 dark:bg-slate-900 dark:border-slate-700 flex flex-col sm:flex-row items-start gap-4">
                  <div className={`p-2 rounded-lg ${user.totp_enabled ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {user.totp_enabled ? 'Two-Factor Authentication is Active' : 'Two-Factor Authentication is Disabled'}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
                      {user.totp_enabled 
                        ? 'Your account is currently protected with TOTP-based 2FA. No action required.' 
                        : 'Your account is vulnerable. Please enable 2FA in the settings menu to secure your account.'
                      }
                    </p>
                  </div>
                </div>

                {!user.totp_enabled && (
                  <div className="flex justify-end">
                    <Link 
                      href="/settings"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Configure 2FA <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Users List Panel (Static for Design) */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 mb-4 dark:text-white">Recent Users</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors dark:hover:bg-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                        U{i}
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">User {i}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">user{i}@example.com</p>
                      </div>
                      <div className="sm:hidden">
                         <p className="text-sm font-medium text-slate-900 dark:text-white">User {i}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${i % 2 === 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {i % 2 === 0 ? ' Active' : 'Offline'}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium py-2">
                View All Users
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
