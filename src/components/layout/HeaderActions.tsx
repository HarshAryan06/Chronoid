import React from 'react';
import { Github, Moon, Sun } from 'lucide-react';

interface HeaderActionsProps {
  isDarkMode: boolean;
  toggleTheme: (e: React.MouseEvent) => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ isDarkMode, toggleTheme }) => (
  <div className="flex items-center gap-2 md:gap-3">
    <a
      href="https://github.com/HarshAryan06/Chronoid"
      target="_blank"
      rel="noopener noreferrer"
      className="h-8 md:h-10 px-3 md:px-4 flex items-center gap-1.5 md:gap-2 rounded-full bg-stone-800 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-100 transition-all text-xs md:text-sm font-semibold shadow-sm"
      title="Star on GitHub"
    >
      <Github size={14} className="md:w-4 md:h-4" />
      <span>Star on GitHub</span>
    </a>

    <a
      href="https://x.com/HarshAryan06"
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border-2 border-stone-300 dark:border-stone-600 hover:border-stone-800 dark:hover:border-white transition-all text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-white"
      title="Follow on X"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 md:w-5 md:h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
      </svg>
    </a>

    <button
      onClick={toggleTheme}
      className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border-2 border-stone-300 dark:border-stone-600 hover:border-stone-800 dark:hover:border-white transition-all text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-white"
      title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
    >
      {isDarkMode ? <Sun size={16} className="md:w-5 md:h-5" /> : <Moon size={16} className="md:w-5 md:h-5" />}
    </button>
  </div>
);
