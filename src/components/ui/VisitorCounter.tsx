import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

interface VisitorCounterProps {
  className?: string;
}

export const VisitorCounter: React.FC<VisitorCounterProps> = ({ className = '' }) => {
  const [count, setCount] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate loading and animate in
    const timer = setTimeout(() => {
      // For now, using localStorage to simulate a basic counter
      // Replace this with actual Vercel KV or API call later
      const storedCount = localStorage.getItem('chronoid_visitor_count');
      const currentCount = storedCount ? parseInt(storedCount, 10) : 0;
      const newCount = currentCount + 1;
      localStorage.setItem('chronoid_visitor_count', newCount.toString());
      setCount(newCount);
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (count === null) return null;

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50
        hidden md:flex items-center gap-2
        px-3 py-2 rounded-full
        bg-white/80 dark:bg-neutral-900/80
        backdrop-blur-md
        border border-stone-200/50 dark:border-neutral-700/50
        shadow-lg shadow-stone-900/5 dark:shadow-black/20
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${className}
      `}
    >
      <Eye className="w-4 h-4 text-stone-500 dark:text-neutral-400" />
      <span className="text-sm font-medium text-stone-600 dark:text-neutral-300 tabular-nums">
        {count.toLocaleString()}
      </span>
      <span className="text-xs text-stone-400 dark:text-neutral-500">
        views
      </span>
    </div>
  );
};

