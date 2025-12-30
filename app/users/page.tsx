'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  totp_enabled: boolean;
  created_at: string;
}

export default function UsersPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/login');
    } else {
      setCurrentUser(JSON.parse(stored));
      // Mock data
      setUsers([
        { id: 1, username: 'admin', totp_enabled: true, created_at: new Date().toISOString() },
        { id: 2, username: 'user_test', totp_enabled: false, created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: 3, username: 'researcher', totp_enabled: true, created_at: new Date(Date.now() - 172800000).toISOString() },
      ]);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">User Management</h1>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden border border-gray-100 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">2FA Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.totp_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.totp_enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
