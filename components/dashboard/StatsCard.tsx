import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  color: string;
}

export default function StatsCard({ title, value, change, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
          {change && (
            <p className="mt-1 flex items-center text-sm font-medium text-green-600">
              {change}
            </p>
          )}
        </div>
        <div className={`rounded-full p-3 ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );
}
