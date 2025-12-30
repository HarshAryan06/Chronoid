import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check, Plus } from 'lucide-react';
import { PolaroidConfig } from '../types';
import { COLORS, FRAME_COLORS, FONTS, FILTERS } from '../constants';
import { CustomCalendar } from './CustomCalendar';
import { CustomColorPicker } from './CustomColorPicker';

interface SidebarProps {
  config: PolaroidConfig;
  setConfig: React.Dispatch<React.SetStateAction<PolaroidConfig>>;
  onPreviewFilter?: (filter: string | null) => void;
  imageSrc: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ config, setConfig, onPreviewFilter, imageSrc }) => {
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Track which color picker is open
  const [activePicker, setActivePicker] = useState<'text' | 'frame' | null>(null);
  
  const fontDropdownRef = useRef<HTMLDivElement>(null);
  const calendarWrapperRef = useRef<HTMLDivElement>(null);
  const textPickerRef = useRef<HTMLDivElement>(null);
  const framePickerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target as Node)) {
        setIsFontDropdownOpen(false);
      }
      if (calendarWrapperRef.current && !calendarWrapperRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (activePicker === 'text' && textPickerRef.current && !textPickerRef.current.contains(event.target as Node)) {
          setActivePicker(null);
      }
      if (activePicker === 'frame' && framePickerRef.current && !framePickerRef.current.contains(event.target as Node)) {
          setActivePicker(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activePicker]);
  
  // Helper: Convert hex to RGB and calculate brightness
  const getBrightness = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 255; 
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  // Helper to determine best text color for a given frame color
  const getOptimalTextColor = (frameColor: string) => {
    const brightness = getBrightness(frameColor);
    return brightness < 140 ? '#FFFFFF' : '#292524';
  };

  const handleChange = (key: keyof PolaroidConfig, value: any) => {
    if (key === 'frameColor') {
        // Automatically set text color for contrast when frame changes
        const optimalTextColor = getOptimalTextColor(value);
        setConfig((prev) => ({ 
            ...prev, 
            [key]: value,
            textColor: optimalTextColor
        }));
    } else {
        setConfig((prev) => ({ ...prev, [key]: value }));
    }
    
    if (key === 'filter' && onPreviewFilter) {
       onPreviewFilter(value);
    }
  };

  const currentFont = FONTS.find(f => f.value === config.fontFamily);
  const containerClasses = "w-full border-2 border-stone-800 dark:border-stone-200 rounded-xl bg-white dark:bg-[#1E1E1E] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] transition-all";

  return (
    <div className="w-full md:w-[340px] h-auto md:h-screen bg-stone-100 dark:bg-[#121212] flex flex-col items-center select-none font-sans transition-colors duration-0 border-r border-stone-200 dark:border-white/5 rounded-t-3xl md:rounded-none -mt-6 md:mt-0 relative z-30 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] md:shadow-none md:overflow-hidden">
      
      {/* Scrollable Content Wrapper */}
      <div className="w-full max-w-[340px] p-6 md:p-8 flex flex-col gap-8 flex-1 md:overflow-y-auto pb-24 md:pb-20">
        
        {/* Header - Desktop Only */}
        <div className="hidden md:block -mb-2">
          <h1 className="text-4xl text-stone-800 dark:text-stone-100 font-logo font-extrabold tracking-wide">Chronoid</h1>
          <p className="text-sm font-semibold text-stone-500 dark:text-stone-400 mt-1">Design your memory.</p>
        </div>
        
        {/* Mobile Section Header */}
        <div className="md:hidden mb-1 pt-2">
           <div className="w-12 h-1.5 bg-stone-300 dark:bg-neutral-700 rounded-full mx-auto mb-4"></div>
           <h2 className="text-lg font-bold text-stone-800 dark:text-gray-100 flex items-center justify-center gap-2">
              Customize Photo
           </h2>
        </div>

        {/* Caption Input */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-stone-800 dark:text-stone-300">Caption</label>
          </div>
          <input
            type="text"
            value={config.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`${containerClasses} h-12 px-4 text-sm font-bold text-stone-800 dark:text-stone-100 focus:outline-none placeholder-stone-400 dark:placeholder-stone-600 focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_rgba(28,25,23,1)] dark:focus:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.2)]`}
            placeholder="Add a caption..."
          />
        </div>

        {/* Date Input */}
        <div className="space-y-3 relative" ref={calendarWrapperRef}>
          <label className="text-sm font-bold text-stone-800 dark:text-stone-300">Date</label>
          <div 
             className="relative group cursor-pointer"
             onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            <input
              type="text" 
              value={config.date}
              readOnly 
              className={`${containerClasses} h-12 pl-4 pr-12 text-sm font-bold text-stone-800 dark:text-stone-100 focus:outline-none placeholder-stone-400 dark:placeholder-stone-600 cursor-pointer pointer-events-none group-active:translate-y-[1px] group-active:shadow-[1px_1px_0px_0px_rgba(28,25,23,1)] dark:group-active:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.2)]`}
              placeholder="dd.mm.yyyy"
            />
             <div 
                className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center cursor-pointer transition-transform duration-200"
             >
              <Calendar className="w-5 h-5 text-stone-500 dark:text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200 transition-colors" strokeWidth={2.5} />
            </div>
          </div>
          
          {isCalendarOpen && (
              <div className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-3">
                  <CustomCalendar 
                      value={config.date} 
                      onChange={(date) => handleChange('date', date)} 
                      onClose={() => setIsCalendarOpen(false)}
                  />
              </div>
          )}
        </div>

        {/* Text Colors */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-stone-800 dark:text-stone-300">Text Color</label>
          <div className={`${containerClasses} p-4`}>
              <div className="grid grid-cols-5 gap-4 justify-items-center">
              {COLORS.map((color) => (
                  <button
                  key={color}
                  onClick={() => handleChange('textColor', color)}
                  className={`w-8 h-8 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 border-stone-800 dark:border-stone-200 transition-transform duration-200 hover:scale-110 active:scale-90 shadow-sm ${
                      config.textColor.toLowerCase() === color.toLowerCase() ? 'ring-2 ring-stone-800 dark:ring-white ring-offset-2 dark:ring-offset-[#1E1E1E]' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                  />
              ))}
                <div className="relative" ref={textPickerRef}>
                    <button
                        onClick={() => setActivePicker(activePicker === 'text' ? null : 'text')}
                        className={`w-8 h-8 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 border-stone-800 dark:border-stone-200 transition-transform duration-200 hover:scale-110 active:scale-90 shadow-sm overflow-hidden bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-red-500 via-purple-500 to-blue-500 ${
                            !COLORS.includes(config.textColor) ? 'ring-2 ring-stone-800 dark:ring-white ring-offset-2 dark:ring-offset-[#1E1E1E]' : ''
                        }`}
                    >
                        <Plus className="text-white drop-shadow-md" size={14} />
                    </button>
                    {activePicker === 'text' && (
                        <div className="absolute z-50 right-0 top-full mt-3 origin-top-right">
                             <CustomColorPicker 
                                color={config.textColor}
                                onChange={(c) => handleChange('textColor', c)}
                             />
                        </div>
                    )}
               </div>
              </div>
          </div>
        </div>

        {/* Font Style */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-stone-800 dark:text-stone-300">Font Style</label>
          
          <div className="relative mb-3" ref={fontDropdownRef}>
              <button
                  onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                  className={`${containerClasses} h-12 px-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-white/5 active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(28,25,23,1)] dark:active:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.2)]`}
              >
                  <span className="truncate text-stone-800 dark:text-stone-100 text-base font-bold" style={{ fontFamily: config.fontFamily }}>
                      {currentFont?.name || 'Select Font'}
                  </span>
                  <ChevronDown size={16} strokeWidth={2.5} className={`text-stone-800 dark:text-stone-100 transition-transform duration-200 ${isFontDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isFontDropdownOpen && (
                  <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white dark:bg-[#1E1E1E] border-2 border-stone-800 dark:border-stone-200 rounded-xl shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] max-h-64 overflow-y-auto w-full">
                      {FONTS.map((font) => (
                          <button
                              key={font.value}
                              onClick={() => {
                                  handleChange('fontFamily', font.value);
                                  setIsFontDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 text-base hover:bg-stone-100 dark:hover:bg-white/10 flex items-center justify-between group transition-all duration-200 hover:pl-6 ${
                                  config.fontFamily === font.value ? 'bg-stone-50 dark:bg-white/5 text-stone-800 dark:text-white' : 'text-stone-700 dark:text-stone-300'
                              }`}
                          >
                              <span style={{ fontFamily: font.value }}>{font.name}</span>
                              {config.fontFamily === font.value && (
                                  <Check size={14} className="text-stone-800 dark:text-white" />
                              )}
                          </button>
                      ))}
                  </div>
              )}
          </div>

          <div className="flex gap-3">
            {[
              { label: 'B', key: 'isBold', class: 'font-bold' },
              { label: 'I', key: 'isItalic', class: 'italic' },
              { label: 'U', key: 'isUnderline', class: 'underline underline-offset-4' },
              { label: 'S', key: 'isStrikethrough', class: 'line-through' },
            ].map((btn) => {
              const isActive = config[btn.key as keyof PolaroidConfig];
              return (
                <button
                  key={btn.key}
                  onClick={() => handleChange(btn.key as keyof PolaroidConfig, !isActive)}
                  className={`flex-1 h-11 flex items-center justify-center border-2 rounded-xl transition-all duration-200 text-sm shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] active:translate-y-[2px] active:shadow-none ${btn.class} ${
                    isActive 
                    ? 'bg-stone-800 dark:bg-stone-200 border-stone-800 dark:border-stone-200 text-white dark:text-stone-900' 
                    : 'bg-white dark:bg-[#1E1E1E] border-stone-800 dark:border-stone-200 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Frame Color */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-stone-800 dark:text-stone-300">Frame Color</label>
          <div className={`${containerClasses} p-4`}>
              <div className="grid grid-cols-5 gap-4 justify-items-center">
              {FRAME_COLORS.map((color) => (
                  <button
                  key={color}
                  onClick={() => handleChange('frameColor', color)}
                  className={`w-8 h-8 md:w-8 md:h-8 rounded-full border-2 border-stone-800 dark:border-stone-200 transition-transform duration-200 hover:scale-110 active:scale-90 shadow-sm ${
                      config.frameColor.toLowerCase() === color.toLowerCase() ? 'ring-2 ring-stone-800 dark:ring-white ring-offset-2 dark:ring-offset-[#1E1E1E]' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select frame color ${color}`}
                  />
              ))}
               <div className="relative" ref={framePickerRef}>
                    <button
                        onClick={() => setActivePicker(activePicker === 'frame' ? null : 'frame')}
                        className={`w-8 h-8 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 border-stone-800 dark:border-stone-200 transition-transform duration-200 hover:scale-110 active:scale-90 shadow-sm overflow-hidden bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-red-500 via-purple-500 to-blue-500 ${
                            !FRAME_COLORS.includes(config.frameColor) ? 'ring-2 ring-stone-800 dark:ring-white ring-offset-2 dark:ring-offset-[#1E1E1E]' : ''
                        }`}
                    >
                        <Plus className="text-white drop-shadow-md" size={14} />
                    </button>
                    {activePicker === 'frame' && (
                        <div className="absolute z-50 right-0 top-full mt-3 origin-top-right">
                             <CustomColorPicker 
                                color={config.frameColor}
                                onChange={(c) => handleChange('frameColor', c)}
                             />
                        </div>
                    )}
               </div>
              </div>
          </div>
        </div>

        {/* Corner Radius */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-stone-800 dark:text-stone-300">Corner Radius</label>
          
          <div className={`${containerClasses} p-4 flex items-center gap-4 h-12`}>
             <input
              type="range"
              min="0"
              max="30"
              value={config.cornerRadius}
              onChange={(e) => handleChange('cornerRadius', parseInt(e.target.value))}
              className="flex-1 h-1.5 bg-stone-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-stone-800 dark:accent-white transition-all duration-200"
             />
             <span className="text-xs font-bold text-stone-600 dark:text-stone-300 w-8 text-right font-mono">{config.cornerRadius}px</span>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-stone-800 dark:text-stone-300">Filters</label>
          <div className={`${containerClasses} p-4`}>
            <div className="grid grid-cols-4 gap-4 justify-items-center">
                {FILTERS.map((filter) => (
                <button
                    key={filter.name}
                    onClick={() => handleChange('filter', filter.value)}
                    className="flex flex-col items-center gap-2 group"
                    title={filter.name}
                >
                    <div
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ease-out overflow-hidden group-hover:scale-110 group-hover:shadow-lg group-active:scale-95 shadow-sm ${
                        config.filter === filter.value ? 'border-stone-800 dark:border-white scale-105' : 'border-stone-300 dark:border-stone-600'
                    }`}
                    >
                    <div className={`w-full h-full bg-cover bg-center ${filter.previewColor}`} style={{ 
                        filter: filter.value,
                        backgroundImage: 'url("https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW58ZW58MHx8MHx8fDA%3D")' 
                    }}></div>
                    </div>
                </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;