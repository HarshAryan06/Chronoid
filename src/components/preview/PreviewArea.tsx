import React from 'react';
import type { PolaroidConfig } from '../../types';
import { PolaroidCard } from './PolaroidCard';
import { ActionButtons } from './ActionButtons';

interface PreviewAreaProps {
  config: PolaroidConfig;
  imageSrc: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownload: () => void;
  onReset: () => void;
  captureRef: React.RefObject<HTMLDivElement>;
  isDarkMode: boolean;
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({
  config,
  imageSrc,
  onUpload,
  onDownload,
  onReset,
  captureRef,
  isDarkMode,
}) => {
  return (
    <div className="flex-1 w-full relative font-mono isolate h-auto md:h-full">
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1] pointer-events-none -z-10 transition-opacity"
        style={{
          backgroundImage: `radial-gradient(${isDarkMode ? 'rgba(255,255,255,0.8)' : '#d6d3d1'} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      ></div>

      <div className="relative w-full h-auto md:absolute md:inset-0 md:overflow-y-auto md:overflow-x-hidden">
        <div className="min-h-[500px] md:min-h-full flex flex-col items-center justify-center p-6 md:p-8 gap-6 md:gap-8">
          <PolaroidCard
            config={config}
            imageSrc={imageSrc}
            captureRef={captureRef}
            isDarkMode={isDarkMode}
          />

          <ActionButtons
            imageSrc={imageSrc}
            onUpload={onUpload}
            onDownload={onDownload}
            onReset={onReset}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewArea;

