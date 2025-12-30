import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export const VisitorCount: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await fetch('/api/visitors');
        const data = await response.json();
        
        if (!response.ok) {
          console.error('API Error:', data);
          setError(data.error || 'Failed to fetch');
          return;
        }
        
        if (typeof data.visitors === 'number') {
          setCount(data.visitors);
        } else {
          console.error('Invalid response:', data);
          setError('Invalid response');
        }
      } catch (err) {
        console.error('Error fetching visitor count:', err);
        setError('Network error');
      }
    };

    fetchVisitors();
  }, []);

  // Don't show anything if there's an error or still loading
  if (error || count === null) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-200/50 dark:bg-white/5 rounded-full border border-stone-300 dark:border-white/10 transition-all hover:bg-stone-200 dark:hover:bg-white/10">
      <Users size={12} className="text-stone-500 dark:text-stone-400" />
      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 tabular-nums">
        {count.toLocaleString()} visitors
      </span>
    </div>
  );
};
