import React from 'react';
import { RefreshCcw, Upload, Download } from 'lucide-react';

interface ActionButtonsProps {
  imageSrc: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownload: () => void;
  onReset: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  imageSrc,
  onUpload,
  onDownload,
  onReset,
}) => {
  return (
    <div className="w-full max-w-[340px] md:max-w-[320px] flex flex-col gap-2 pb-2 md:pb-0 z-10 font-sans pointer-events-auto">
      <div className="flex gap-2 w-full">
        <button
          onClick={onReset}
          className="group relative flex-1 h-10 flex items-center justify-center overflow-hidden bg-white dark:bg-[#1E1E1E] border-2 border-stone-800 dark:border-white/20 text-stone-800 dark:text-white text-sm font-bold shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(28,25,23,1)] active:translate-y-[2px] active:shadow-none rounded-lg"
        >
          <div className="absolute inset-0 bg-stone-800 dark:bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out will-change-transform" />
          <div className="relative flex items-center gap-2 z-10 group-hover:text-white dark:group-hover:text-black transition-colors duration-200">
            <RefreshCcw
              size={14}
              strokeWidth={2.5}
              className="group-hover:-rotate-180 transition-transform duration-500"
            />
            Reset
          </div>
        </button>

        <label className="flex-1 h-10 flex items-center justify-center gap-2 bg-stone-800 dark:bg-white border-2 border-stone-800 dark:border-white text-white dark:text-black text-sm font-bold shadow-[2px_2px_0px_0px_rgba(28,25,23,0.25)] hover:translate-y-[1px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer rounded-lg">
          <Upload size={14} strokeWidth={2.5} />
          Upload
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
        </label>
      </div>

      <button
        onClick={onDownload}
        disabled={!imageSrc}
        className={`w-full h-10 flex items-center justify-center gap-2 bg-stone-800 dark:bg-white text-white dark:text-black border-2 border-stone-800 dark:border-white text-sm font-bold shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[1px] active:translate-y-[2px] active:shadow-none transition-all rounded-lg ${
          !imageSrc ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Download size={16} strokeWidth={2.5} />
        Download
      </button>
    </div>
  );
};

