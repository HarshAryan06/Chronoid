import React from 'react';
import { Github, Moon, Sun } from 'lucide-react';

interface HeaderActionsProps {
  isDarkMode: boolean;
  toggleTheme: (e: React.MouseEvent) => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ isDarkMode, toggleTheme }) => (
  <div className="flex items-center gap-2 md:gap-3">
    <button
      onClick={toggleTheme}
      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 md:bg-transparent md:border-2 md:border-transparent md:hover:border-stone-800 md:dark:hover:border-white backdrop-blur-md transition-all text-stone-800 dark:text-gray-200 md:text-stone-500 md:dark:text-stone-400 md:hover:text-stone-800 md:dark:hover:text-white border border-stone-800/10 dark:border-white/10 md:border-none"
      title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
    >
      {isDarkMode ? (
        <Sun size={18} className="md:w-5 md:h-5" />
      ) : (
        <Moon size={18} className="md:w-5 md:h-5" />
      )}
    </button>

    <a
      href="https://github.com/HarshAryan06"
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 md:bg-transparent md:border-2 md:border-transparent md:hover:border-stone-800 md:dark:hover:border-white backdrop-blur-md transition-all text-stone-800 dark:text-gray-200 md:text-stone-400 md:hover:text-stone-800 md:dark:hover:text-white border border-stone-800/10 dark:border-white/10 md:border-none"
      title="View GitHub Profile"
    >
      <Github size={18} className="md:w-5 md:h-5" />
    </a>

    <a
      href="https://x.com/HarshAryan06"
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 md:bg-transparent md:border-2 md:border-transparent md:hover:border-stone-800 md:dark:hover:border-white backdrop-blur-md transition-all text-stone-800 dark:text-gray-200 md:text-stone-400 md:hover:text-stone-800 md:dark:hover:text-white border border-stone-800/10 dark:border-white/10 md:border-none"
      title="Follow on X"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 md:w-5 md:h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
      </svg>
    </a>
  </div>
);

