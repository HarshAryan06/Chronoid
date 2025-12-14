import React, { useState, useRef, useCallback, useEffect } from 'react';
import { flushSync } from 'react-dom';
import Sidebar from './components/Sidebar';
import PreviewArea from './components/PreviewArea';
import { PolaroidConfig } from './types';
import { DEFAULT_CONFIG } from './constants';
import * as htmlToImage from 'html-to-image';
import { Github, Moon, Sun } from 'lucide-react';

// --- Header Actions Component (Theme & Socials) ---
const HeaderActions: React.FC<{ isDarkMode: boolean; toggleTheme: (e: React.MouseEvent) => void }> = ({ isDarkMode, toggleTheme }) => (
  <div className="flex items-center gap-2 md:gap-3">
    <button 
      onClick={toggleTheme}
      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 md:bg-transparent md:border-2 md:border-transparent md:hover:border-stone-800 md:dark:hover:border-white backdrop-blur-md transition-all text-stone-800 dark:text-gray-200 md:text-stone-500 md:dark:text-stone-400 md:hover:text-stone-800 md:dark:hover:text-white border border-stone-800/10 dark:border-white/10 md:border-none"
      title={isDarkMode ? "Light Mode" : "Dark Mode"}
    >
      {isDarkMode ? <Sun size={18} className="md:w-5 md:h-5" /> : <Moon size={18} className="md:w-5 md:h-5" />}
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
      href="https://x.com/HarshAryan06?t=P0-lo-9cVPeB33Yad3gfuw&s=09" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 md:bg-transparent md:border-2 md:border-transparent md:hover:border-stone-800 md:dark:hover:border-white backdrop-blur-md transition-all text-stone-800 dark:text-gray-200 md:text-stone-400 md:hover:text-stone-800 md:dark:hover:text-white border border-stone-800/10 dark:border-white/10 md:border-none"
      title="Follow on X"
    >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 md:w-5 md:h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
    </a>
  </div>
);

// --- Main App Component ---
const App: React.FC = () => {
  const [config, setConfig] = useState<PolaroidConfig>(DEFAULT_CONFIG);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [previewFilter, setPreviewFilter] = useState<string | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  // Sync Dark Mode Class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // View Transition Theme Toggle
  const toggleTheme = async (event: React.MouseEvent) => {
    // @ts-ignore - View Transitions API support
    if (!document.startViewTransition) {
      setIsDarkMode(!isDarkMode);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      flushSync(() => setIsDarkMode((prev) => !prev));
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
        { duration: 500, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }
      );
    });
  };

  // Handlers
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => e.target?.result && setImageSrc(e.target.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = useCallback(async () => {
    if (captureRef.current === null) return;
    try {
      const dataUrl = await htmlToImage.toPng(captureRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        skipAutoScale: true,
        backgroundColor: 'transparent',
        style: { transform: 'none' }
      });
      const link = document.createElement('a');
      link.download = `chronoid-memory-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('Failed to generate image. Please try again.');
    }
  }, [captureRef]);

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setImageSrc(null);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-stone-50 dark:bg-[#0a0a0a] font-sans transition-colors duration-0">
      
      {/* Mobile Header: Fixed Floating Pill with Enhanced Glassmorphism */}
      <div className="md:hidden fixed top-5 left-4 right-4 h-16 px-6 shrink-0 flex justify-between items-center z-[100] transition-all duration-300 bg-white/60 dark:bg-[#121212]/60 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-full shadow-xl shadow-stone-200/50 dark:shadow-black/20 ring-1 ring-white/40 dark:ring-white/5">
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-logo font-bold tracking-tight text-stone-800 dark:text-stone-100 leading-none drop-shadow-sm">Chronoid</h1>
            <span className="text-[10px] font-medium text-stone-600 dark:text-stone-400 leading-tight drop-shadow-sm">Design your memory.</span>
          </div>
          <HeaderActions isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>

      <div className="flex flex-col md:flex-row flex-1 w-full">
        {/* Sidebar */}
        <div className="order-2 md:order-1 w-full md:w-auto z-10">
           <Sidebar config={config} setConfig={setConfig} onPreviewFilter={setPreviewFilter} imageSrc={imageSrc} />
        </div>

        {/* Main Content Area */}
        <div className="order-1 md:order-2 flex-1 relative flex flex-col min-h-0 bg-sand dark:bg-[#0a0a0a]">
            {/* Desktop Top Right Tools */}
            <div className="absolute top-6 right-6 z-30 hidden md:flex">
                <HeaderActions isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            </div>

            {/* Spacer for Fixed Header on Mobile */}
            <div className="md:hidden h-24 w-full bg-transparent shrink-0" />

            <PreviewArea 
                config={{ ...config, filter: previewFilter ?? config.filter }}
                imageSrc={imageSrc}
                onUpload={handleUpload}
                onDownload={handleDownload}
                onReset={handleReset}
                captureRef={captureRef}
                isDarkMode={isDarkMode}
            />
        </div>
      </div>
    </div>
  );
};

export default App;