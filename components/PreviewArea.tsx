import React, { useRef, useState, useEffect, MouseEvent } from 'react';
import { PolaroidConfig } from '../types';
import { RefreshCcw, Upload, Download } from 'lucide-react';

interface PreviewAreaProps {
  config: PolaroidConfig;
  imageSrc: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownload: () => void;
  onReset: () => void;
  captureRef: React.RefObject<HTMLDivElement>;
  isDarkMode: boolean;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({
  config,
  imageSrc,
  onUpload,
  onDownload,
  onReset,
  captureRef,
  isDarkMode
}) => {
  const [isMobile, setIsMobile] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const deepShadowRef = useRef<HTMLDivElement>(null);
  const midShadowRef = useRef<HTMLDivElement>(null);
  const glossRef = useRef<HTMLDivElement>(null);
  const reflectionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isMobile || !containerRef.current) return;

    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    
    const rotateX = (centerY - y) / 25; 
    const rotateY = (x - centerX) / 25;

    requestAnimationFrame(() => {
        if (containerRef.current) {
            containerRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        }
        if (deepShadowRef.current) {
            deepShadowRef.current.style.transform = `translateZ(-60px) translateX(${rotateY * -1.5}px) translateY(${rotateX * -1.5}px)`;
        }
        if (midShadowRef.current) {
             midShadowRef.current.style.transform = `translateZ(-30px) translateX(${rotateY * -0.8}px) translateY(${rotateX * -0.8}px)`;
        }
        if (glossRef.current) {
            glossRef.current.style.transform = `translateX(${rotateY * 6}px) translateY(${rotateX * 6}px)`;
            glossRef.current.style.opacity = '1';
        }
        if (reflectionRef.current) {
             reflectionRef.current.style.transform = `translateX(${rotateY * 4}px) translateY(${rotateX * 4}px)`;
             reflectionRef.current.style.opacity = '1';
        }
    });
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    const elements = [containerRef.current, deepShadowRef.current, midShadowRef.current, glossRef.current, reflectionRef.current];
    elements.forEach(el => {
        if (el) el.style.transition = 'transform 0.1s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease';
    });
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    const slowTransition = 'transform 0.8s cubic-bezier(0.445, 0.05, 0.55, 0.95), opacity 0.3s ease';
    
    if (containerRef.current) {
        containerRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        containerRef.current.style.transition = slowTransition;
    }
    if (deepShadowRef.current) {
        deepShadowRef.current.style.transform = 'translateZ(-60px) translateX(0px) translateY(0px)';
        deepShadowRef.current.style.transition = slowTransition;
    }
    if (midShadowRef.current) {
        midShadowRef.current.style.transform = 'translateZ(-30px) translateX(0px) translateY(0px)';
        midShadowRef.current.style.transition = slowTransition;
    }
    if (glossRef.current) {
        glossRef.current.style.opacity = '0';
        glossRef.current.style.transform = 'translateX(0px) translateY(0px)';
        glossRef.current.style.transition = slowTransition;
    }
    if (reflectionRef.current) {
        reflectionRef.current.style.opacity = '0';
        reflectionRef.current.style.transform = 'translateX(0px) translateY(0px)';
        reflectionRef.current.style.transition = slowTransition;
    }
  };

  const shadowColor = isDarkMode ? config.frameColor : '#000000';
  const shadowMixBlendMode = isDarkMode ? 'normal' : 'multiply'; 
  const deepShadowOpacity = isDarkMode ? 0.06 : 0.08; 
  const midShadowOpacity = isDarkMode ? 0.02 : 0.03;

  return (
    <div className="flex-1 w-full relative font-mono isolate h-auto md:h-full">
      <div 
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1] pointer-events-none -z-10 transition-opacity"
        style={{
            backgroundImage: `radial-gradient(${isDarkMode ? 'rgba(255,255,255,0.8)' : '#d6d3d1'} 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
        }}
      ></div>

      <div className="relative w-full h-auto md:absolute md:inset-0 md:overflow-y-auto md:overflow-x-hidden">
        <div className="min-h-[500px] md:min-h-full flex flex-col items-center justify-center p-6 md:p-8 gap-6 md:gap-8">
            
            <div 
                className="relative w-full flex justify-center max-w-[400px] perspective-[1000px] select-none pointer-events-none"
                style={{ perspective: '1200px' }}
            >
                <div 
                    ref={containerRef}
                    className="relative w-full will-change-transform pointer-events-auto"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{ transformStyle: 'preserve-3d', transform: 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' }}
                >
                    <div 
                        ref={deepShadowRef}
                        className="absolute w-full h-full will-change-transform"
                        style={{ 
                            top: '25px', left: '15px',
                            borderRadius: `${config.cornerRadius}px`, 
                            filter: 'blur(24px)', backgroundColor: shadowColor,
                            opacity: deepShadowOpacity, transform: 'translateZ(-60px)',
                            mixBlendMode: shadowMixBlendMode as any,
                        }}
                    ></div>
                    <div 
                        ref={midShadowRef}
                        className="absolute w-full h-full will-change-transform"
                        style={{ 
                            top: '10px', left: '5px',
                            borderRadius: `${config.cornerRadius}px`,
                            filter: 'blur(12px)', backgroundColor: shadowColor,
                            opacity: midShadowOpacity, transform: 'translateZ(-30px)',
                            mixBlendMode: shadowMixBlendMode as any,
                        }}
                    ></div>
                    
                    <div ref={captureRef} style={{ width: '100%', padding: '30px' }}>
                        <div
                            ref={frameRef}
                            className="relative overflow-hidden"
                            style={{
                                backgroundColor: config.frameColor,
                                padding: '16px 16px 16px 16px',
                                width: '100%',
                                boxShadow: isDarkMode 
                                    ? `0 0 0 1px ${config.frameColor}20, 0 15px 30px -10px rgba(0, 0, 0, 0.5)`
                                    : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.05)',
                                border: isDarkMode ? 'none' : '1px solid rgba(0,0,0,0.02)',
                                borderRadius: `${config.cornerRadius}px`,
                                display: 'flex', flexDirection: 'column',
                                transition: 'background-color 0.3s ease',
                            }}
                        >
                            <div 
                                className="w-full aspect-square overflow-hidden relative bg-stone-100 dark:bg-black/20"
                                style={{ borderRadius: `${Math.max(0, config.cornerRadius - 2)}px` }}
                            >
                                {imageSrc && (
                                <>
                                    <img
                                        src={imageSrc}
                                        alt="Polaroid Memory"
                                        className="w-full h-full object-cover transition-all duration-300"
                                        style={{ filter: config.filter }}
                                    />
                                    <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay z-10"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                                    ></div>
                                    <div 
                                        ref={glossRef}
                                        className="absolute -inset-[100%] pointer-events-none z-20 mix-blend-soft-light will-change-transform"
                                        style={{
                                            background: `linear-gradient(115deg, transparent 40%, rgba(255,255,255,${isDarkMode ? 0.1 : 0.2}) 48%, rgba(255,255,255,${isDarkMode ? 0.03 : 0.08}) 52%, transparent 60%)`,
                                            opacity: 0,
                                        }}
                                    />
                                </>
                                )}
                            </div>

                            <div className="relative mt-4 min-h-[60px] flex flex-col pointer-events-none">
                                {config.title && (
                                    <div 
                                        className={`text-left leading-tight break-words ${config.isBold ? 'font-bold' : ''} ${config.isItalic ? 'italic' : ''} ${config.isUnderline ? 'underline' : ''} ${config.isStrikethrough ? 'line-through' : ''}`}
                                        style={{ 
                                            color: config.textColor, fontSize: '1rem', 
                                            fontFamily: config.fontFamily, width: '100%',
                                            maxHeight: '48px', overflow: 'hidden',
                                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {config.title}
                                    </div>
                                )}
                                {config.date && (
                                    <div 
                                        className="absolute bottom-0 right-0 text-[10px] font-medium tracking-[0.1em] uppercase z-10"
                                        style={{ color: config.textColor, fontFamily: '"Roboto Mono", monospace', opacity: 0.85 }}
                                    >
                                        {config.date}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div 
                        ref={reflectionRef}
                        className="absolute inset-0 pointer-events-none z-50 mix-blend-soft-light will-change-transform"
                        style={{
                            borderRadius: `${config.cornerRadius}px`,
                            background: `linear-gradient(125deg, transparent 30%, rgba(255,255,255,${isDarkMode ? 0.1 : 0.2}) 45%, rgba(255,255,255,${isDarkMode ? 0.03 : 0.08}) 50%, transparent 70%)`,
                            opacity: 0,
                        }}
                    ></div>
                </div>
            </div>

            <div className="w-full max-w-[400px] flex flex-col gap-2 pb-2 md:pb-0 z-10 font-sans pointer-events-auto">
                <div className="flex gap-2 w-full">
                    <button
                        onClick={onReset}
                        className="group relative flex-1 h-12 flex items-center justify-center overflow-hidden bg-white dark:bg-[#1E1E1E] border-2 border-stone-800 dark:border-white/20 text-stone-800 dark:text-white text-sm font-bold shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] active:translate-y-[3px] active:shadow-none rounded-xl"
                    >
                        <div className="absolute inset-0 bg-stone-800 dark:bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out will-change-transform" />
                        <div className="relative flex items-center gap-2 z-10 group-hover:text-white dark:group-hover:text-black transition-colors duration-200">
                            <RefreshCcw size={14} strokeWidth={2.5} className="group-hover:-rotate-180 transition-transform duration-500" />
                            Reset
                        </div>
                    </button>

                    <label className="flex-1 h-12 flex items-center justify-center gap-2 bg-stone-800 dark:bg-white border-2 border-stone-800 dark:border-white text-white dark:text-black text-sm font-bold shadow-[3px_3px_0px_0px_rgba(28,25,23,0.25)] hover:translate-y-[1px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer rounded-xl">
                        <Upload size={14} strokeWidth={2.5} />
                        Upload
                        <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
                    </label>
                </div>

                <button
                    onClick={onDownload}
                    disabled={!imageSrc}
                    className={`w-full h-12 flex items-center justify-center gap-2 bg-stone-800 dark:bg-white text-white dark:text-black border-2 border-stone-800 dark:border-white text-sm font-bold shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[1px] active:translate-y-[3px] active:shadow-none transition-all rounded-xl ${!imageSrc ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Download size={16} strokeWidth={2.5} />
                    Download
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewArea;