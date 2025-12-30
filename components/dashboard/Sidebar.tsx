'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Settings, LogOut, X } from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ onLogout, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white';
  };

  const iconColor = (path: string) => {
    return pathname === path ? 'text-blue-400' : 'text-slate-400 group-hover:text-white';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col border-r border-slate-800
      `}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          {/* Close button for mobile */}
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 space-y-1 px-3 py-4">
          <Link 
            href="/dashboard" 
            onClick={onClose}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-colors ${isActive('/dashboard')}`}
          >
            <Home className={`mr-3 h-5 w-5 ${iconColor('/dashboard')}`} />
            Dashboard
          </Link>
          <Link 
            href="/users" 
            onClick={onClose}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-colors ${isActive('/users')}`}
          >
            <Users className={`mr-3 h-5 w-5 ${iconColor('/users')}`} />
            Users
          </Link>
          <Link 
            href="/settings" 
            onClick={onClose}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-colors ${isActive('/settings')}`}
          >
            <Settings className={`mr-3 h-5 w-5 ${iconColor('/settings')}`} />
            Settings
          </Link>
        </nav>

        <div className="border-t border-slate-800 p-4">
          <button 
            onClick={onLogout}
            className="flex w-full items-center px-4 py-2 text-sm font-medium text-red-400 rounded-md hover:bg-slate-800 hover:text-red-300 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
