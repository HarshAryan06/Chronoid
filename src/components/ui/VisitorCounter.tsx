import React from 'react';
import { Eye } from 'lucide-react';

interface VisitorCounterProps {
  className?: string;
}

export const VisitorCounter: React.FC<VisitorCounterProps> = ({ className = '' }) => {
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border border-stone-200 dark:border-neutral-700 shadow-sm ${className}`}
    >
      <Eye className="w-3.5 h-3.5 text-stone-500 dark:text-neutral-400" />
      <span className="text-xs font-medium text-stone-600 dark:text-neutral-300 tracking-wide">
        Tracking visitors
      </span>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
    </div>
  );
};

