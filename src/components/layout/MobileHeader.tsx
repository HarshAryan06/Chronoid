import React from 'react';
import { HeaderActions } from './HeaderActions';

interface MobileHeaderProps {
  isDarkMode: boolean;
  toggleTheme: (e: React.MouseEvent) => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ isDarkMode, toggleTheme }) => (
  <div className="md:hidden fixed top-5 left-4 right-4 h-16 px-6 shrink-0 flex justify-between items-center z-[100] transition-all duration-300 bg-white/60 dark:bg-[#121212]/60 backdrop-blur-xl backdrop-saturate-150 border border-white/30 dark:border-white/10 rounded-full shadow-lg shadow-black/5 dark:shadow-black/30">
    <div className="flex flex-col justify-center">
      <h1 className="text-xl font-logo font-bold tracking-tight text-stone-800 dark:text-stone-100 leading-none drop-shadow-sm">
        Chronoid
      </h1>
      <span className="text-[10px] font-medium text-stone-600 dark:text-stone-400 leading-tight drop-shadow-sm">
        Design your memory.
      </span>
    </div>
    <HeaderActions isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
  </div>
);

