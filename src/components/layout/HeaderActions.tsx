import React from 'react';
import { Github, Moon, Sun } from 'lucide-react';

interface HeaderActionsProps {
  isDarkMode: boolean;
  toggleTheme: (e: React.MouseEvent) => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ isDarkMode, toggleTheme }) => (
  <div className="flex items-center gap-3">
    <a
      href="https://github.com/HarshAryan06/Chronoid"
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-stone-300 dark:border-stone-600 hover:border-stone-800 dark:hover:border-white transition-all text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-white"
      title="GitHub"
    >
      <Github size={20} />
    </a>

    <a
      href="https://x.com/HarshAryan06"
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-stone-300 dark:border-stone-600 hover:border-stone-800 dark:hover:border-white transition-all text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-white"
      title="Follow on X"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
      </svg>
    </a>

    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-stone-300 dark:border-stone-600 hover:border-stone-800 dark:hover:border-white transition-all text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-white"
      title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  </div>
);
