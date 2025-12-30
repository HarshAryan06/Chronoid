import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pipette } from 'lucide-react';
import { hexToHsv, hsvToHex } from '../../utils/color';

declare global {
  interface Window {
    EyeDropper?: new () => {
      open(options?: { signal?: AbortSignal }): Promise<{ sRGBHex: string }>;
    };
  }
}

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onClose?: () => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [hsv, setHsv] = useState(() => hexToHsv(color));
  const [isDragging, setIsDragging] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging) {
      const newHsv = hexToHsv(color);
      if (newHsv.s === 0) {
        setHsv((prev) => ({ ...newHsv, h: prev.h }));
      } else {
        setHsv(newHsv);
      }
    }
  }, [color, isDragging]);

  const handleAreaChange = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!areaRef.current) return;
      const rect = areaRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

      const newS = x * 100;
      const newV = (1 - y) * 100;

      setHsv((prev) => {
        const next = { ...prev, s: newS, v: newV };
        onChange(hsvToHex(next.h, next.s / 100, next.v / 100));
        return next;
      });
    },
    [onChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleAreaChange(e);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleAreaChange(e);
      }
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleAreaChange]);

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newH = parseInt(e.target.value);
    setHsv((prev) => {
      const next = { ...prev, h: newH };
      onChange(hsvToHex(next.h, next.s / 100, next.v / 100));
      return next;
    });
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^#[0-9A-F]{0,6}$/i.test(val)) {
      if (val.length === 7) {
        onChange(val);
      }
    }
  };

  const handleEyeDropper = async () => {
    if (!window.EyeDropper) return;
    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      onChange(result.sRGBHex);
    } catch {
      console.log('EyeDropper failed or cancelled');
    }
  };

  return (
    <div
      className="p-3 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl border border-stone-200 dark:border-white/10 w-[260px] flex flex-col gap-3 font-sans animate-in fade-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Color Area */}
      <div
        ref={areaRef}
        className="w-full h-32 rounded-lg relative cursor-crosshair overflow-hidden shadow-inner ring-1 ring-black/5"
        style={{
          backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
          backgroundImage: `linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)`,
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${hsv.s}%`,
            top: `${100 - hsv.v}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Hue Slider */}
      <div className="flex items-center gap-3">
        {'EyeDropper' in window && (
          <button
            onClick={handleEyeDropper}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-white/20 transition-colors"
            title="Pick Color from Screen"
          >
            <Pipette size={16} />
          </button>
        )}

        <div className="flex-1 h-4 relative rounded-full overflow-hidden shadow-inner ring-1 ring-black/5">
          <input
            type="range"
            min="0"
            max="360"
            value={hsv.h}
            onChange={handleHueChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div
            className="w-full h-full"
            style={{
              background:
                'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
            }}
          />
          <div
            className="absolute top-0 bottom-0 w-2 bg-white border border-stone-300 shadow-sm rounded-full pointer-events-none"
            style={{ left: `calc(${(hsv.h / 360) * 100}% - 4px)` }}
          />
        </div>
      </div>

      {/* Hex Input */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 flex items-center gap-2 bg-stone-50 dark:bg-black/30 border border-stone-200 dark:border-white/10 rounded-lg px-2 h-9">
          <span className="text-xs font-bold text-stone-400 dark:text-stone-500">HEX</span>
          <input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleHexChange}
            className="flex-1 min-w-0 bg-transparent text-sm font-mono text-stone-700 dark:text-stone-200 focus:outline-none uppercase"
          />
        </div>
        <div
          className="w-9 h-9 rounded-lg border border-stone-200 dark:border-white/10 shadow-sm"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

