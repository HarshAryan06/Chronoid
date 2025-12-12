import React, { useState, useRef, useCallback, useEffect } from 'react';
import { flushSync } from 'react-dom';
import Sidebar from './components/Sidebar';
import PreviewArea from './components/PreviewArea';
import { PolaroidConfig } from './types';
import { DEFAULT_CONFIG } from './constants';
import * as htmlToImage from 'html-to-image';
import { Github, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<PolaroidConfig>(DEFAULT_CONFIG);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [previewFilter, setPreviewFilter] = useState<string | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  // Sync dark mode class with state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = async (event: React.MouseEvent) => {
    // @ts-ignore - View Transitions API might not be in TS types yet
    if (!document.startViewTransition) {
      setIsDarkMode(!isDarkMode);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setIsDarkMode((prev) => !prev);
      });
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  // Handle File Upload
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImageSrc(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Download using html-to-image
  const handleDownload = useCallback(async () => {
    if (captureRef.current === null) {
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(captureRef.current, {
        cacheBust: true,
        pixelRatio: 3, // Very High resolution for print quality
        skipAutoScale: true, // Prevents scaling issues with fonts
        backgroundColor: 'transparent',
        style: {
          // Removed backgroundColor override to prevent square corners from showing behind rounded frames
          transform: 'none', // Ensure no transforms are applied
        }
      });
      
      const link = document.createElement('a');
      link.download = `chronoid-memory-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Oops, something went wrong!', err);
      alert('Failed to generate image. Please try again.');
    }
  }, [captureRef, config.frameColor]);

  // Handle Reset
  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setImageSrc(null);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-white dark:bg-[#0a0a0a] font-sans transition-colors duration-0">
        
      {/* Mobile Header - Transparent to remove "white bar" look */}
      <div className="md:hidden sticky top-2 mx-2 mt-2 h-16 px-5 shrink-0 flex justify-between items-center z-50 transition-all duration-300">
          <div className="flex flex-col">
            <h1 className="text-xl font-logo font-bold tracking-tight text-stone-800 dark:text-stone-100 leading-none drop-shadow-sm">Chronoid</h1>
            <span className="text-[10px] font-medium text-stone-600 dark:text-stone-400 leading-tight drop-shadow-sm">Design your memory.</span>
          </div>
          
          <div className="flex items-center gap-1">
               <a 
                  href="https://github.com/HarshAryan06" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-colors text-stone-800 dark:text-gray-200 border border-stone-800/10 dark:border-white/10"
                >
                    <Github size={18} />
                </a>
                
                <a 
                  href="https://x.com/HarshAryan06?t=P0-lo-9cVPeB33Yad3gfuw&s=09" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-colors text-stone-800 dark:text-gray-200 border border-stone-800/10 dark:border-white/10"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </a>

               <button 
                  onClick={toggleTheme}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-colors text-stone-800 dark:text-gray-200 border border-stone-800/10 dark:border-white/10"
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
          </div>
      </div>

      {/* Main Content Wrapper - Controls Order */}
      <div className="flex flex-col md:flex-row flex-1 w-full">
        
        {/* Sidebar (Editing Panel) 
            - Mobile: Order 2 (Bottom), Full Width, Auto Height
            - Desktop: Order 1 (Left), Fixed Width, Full Height
        */}
        <div className="order-2 md:order-1 w-full md:w-auto z-10">
           <Sidebar 
            config={config} 
            setConfig={setConfig} 
            onPreviewFilter={setPreviewFilter}
           />
        </div>

        {/* Preview Area (Hero)
            - Mobile: Order 1 (Top), Full Width
            - Desktop: Order 2 (Right), Flex Grow
        */}
        <div className="order-1 md:order-2 flex-1 relative flex flex-col min-h-0 bg-sand dark:bg-[#0a0a0a]">
            {/* Top Right Tools (Desktop Only) */}
            <div className="absolute top-6 right-6 z-30 hidden md:flex gap-3">
                 <button 
                  onClick={toggleTheme}
                  className="w-10 h-10 flex items-center justify-center border-2 border-transparent hover:border-stone-800 dark:hover:border-white rounded-full transition-all text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-white"
                  title={isDarkMode ? "Light Mode" : "Dark Mode"}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <a 
                  href="https://github.com/HarshAryan06" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 flex items-center justify-center border-2 border-transparent hover:border-stone-800 dark:hover:border-white rounded-full transition-all text-stone-400 hover:text-stone-800 dark:hover:text-white" 
                  title="View GitHub Profile"
                >
                    <Github size={20} />
                </a>
                
                <a 
                  href="https://x.com/HarshAryan06?t=P0-lo-9cVPeB33Yad3gfuw&s=09" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 flex items-center justify-center border-2 border-transparent hover:border-stone-800 dark:hover:border-white rounded-full transition-all text-stone-400 hover:text-stone-800 dark:hover:text-white" 
                  title="Follow on X"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </a>
            </div>

            <PreviewArea 
                config={{
                    ...config,
                    filter: previewFilter ?? config.filter
                }}
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