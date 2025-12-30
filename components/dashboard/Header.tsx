import { Bell, Search, Menu } from 'lucide-react';

interface HeaderProps {
  username: string;
  onMenuClick?: () => void;
}

export default function Header({ username, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
      
      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md dark:text-gray-400 dark:hover:bg-slate-800"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input
            type="search"
            placeholder="Search artifacts..."
            className="h-9 w-64 rounded-md border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
        </div>
      </div>
      
      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {username.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">{username}</span>
        </div>
      </div>
    </header>
  );
}
