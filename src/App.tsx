import React, { useState, useRef, useCallback } from 'react';
import * as htmlToImage from 'html-to-image';

import { useTheme } from './hooks';
import { DEFAULT_CONFIG } from './constants';
import type { PolaroidConfig } from './types';

import { HeaderActions, MobileHeader } from './components/layout';
import { Sidebar } from './components/sidebar';
import { PreviewArea } from './components/preview';
import { VisitorCounter } from './components/ui';

const App: React.FC = () => {
  const [config, setConfig] = useState<PolaroidConfig>(DEFAULT_CONFIG);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [previewFilter, setPreviewFilter] = useState<string | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  const { isDarkMode, toggleTheme } = useTheme();

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
        style: { transform: 'none' },
      });
      const link = document.createElement('a');
      link.download = `chronoid-memory-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('Failed to generate image. Please try again.');
    }
  }, []);

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setImageSrc(null);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-stone-50 dark:bg-[#0a0a0a] font-sans transition-colors duration-200">
      {/* Mobile Header */}
      <MobileHeader isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="flex flex-col md:flex-row flex-1 w-full">
        {/* Sidebar */}
        <div className="order-2 md:order-1 w-full md:w-auto z-10">
          <Sidebar
            config={config}
            setConfig={setConfig}
            onPreviewFilter={setPreviewFilter}
            imageSrc={imageSrc}
          />
        </div>

        {/* Preview Area */}
        <div className="order-1 md:order-2 flex-1 relative flex flex-col min-h-0 bg-sand dark:bg-[#0a0a0a]">
          {/* Desktop Header Actions */}
          <div className="absolute top-6 right-6 z-30 hidden md:flex">
            <HeaderActions isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </div>

          {/* Mobile Spacer */}
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

      {/* Visitor Counter - Desktop only */}
      <VisitorCounter />
    </div>
  );
};

export default App;
