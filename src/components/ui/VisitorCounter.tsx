import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

interface VisitorCounterProps {
  className?: string;
}

// API endpoint - uses relative path in production, full URL in development
const API_URL = import.meta.env.DEV 
  ? '/api/visitors' 
  : '/api/visitors';

export const VisitorCounter: React.FC<VisitorCounterProps> = ({ className = '' }) => {
  const [count, setCount] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Check if we've already tracked this session
        const hasTracked = sessionStorage.getItem('chronoid_tracked');

        if (!hasTracked) {
          // POST to register this visitor (only once per session)
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
          const data = await response.json();
          
          if (data.success) {
            sessionStorage.setItem('chronoid_tracked', 'true');
            setCount(data.count);
          } else {
            throw new Error('API returned unsuccessful');
          }
        } else {
          // GET to just fetch the current count
          const response = await fetch(API_URL);
          const data = await response.json();
          setCount(data.count);
        }

        setIsVisible(true);
      } catch (error) {
        console.error('Failed to track visitor:', error);
        // Fallback for local development or API failure
        const fallbackCount = localStorage.getItem('chronoid_fallback_count');
        const currentCount = fallbackCount ? parseInt(fallbackCount, 10) : 1;
        
        if (!sessionStorage.getItem('chronoid_tracked')) {
          localStorage.setItem('chronoid_fallback_count', (currentCount + 1).toString());
          sessionStorage.setItem('chronoid_tracked', 'true');
        }
        
        setCount(currentCount);
        setIsVisible(true);
      }
    };

    const timer = setTimeout(trackVisitor, 500);
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
        visitors
      </span>
    </div>
  );
};

