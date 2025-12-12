import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check, Plus, ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
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
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Track which color picker is open ('text' | 'frame' | null)
  const [activePicker, setActivePicker] = useState<'text' | 'frame' | null>(null);
  
  const fontDropdownRef = useRef<HTMLDivElement>(null);
  const calendarWrapperRef = useRef<HTMLDivElement>(null);
  const textPickerRef = useRef<HTMLDivElement>(null);
  const framePickerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Font Dropdown
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target as Node)) {
        setIsFontDropdownOpen(false);
      }
      // Calendar
      if (calendarWrapperRef.current && !calendarWrapperRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
      // Text Color Picker
      if (activePicker === 'text' && textPickerRef.current && !textPickerRef.current.contains(event.target as Node)) {
          setActivePicker(null);
      }
      // Frame Color Picker
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
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 255; // Default to light if invalid

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    // Formula for brightness
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  // Helper to determine best text color for a given frame color
  const getOptimalTextColor = (frameColor: string) => {
    const brightness = getBrightness(frameColor);
    // If brightness is low (dark color), return white. Else return black/dark stone.
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
  };

  const handleMagicCaption = async () => {
    if (!imageSrc || isGenerating) return;

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Extract base64 and mimeType
      const match = imageSrc.match(/^data:(.+);base64,(.+)$/);
      if (!match) throw new Error("Invalid image format");
      
      const mimeType = match[1];
      const base64Data = match[2];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            { inlineData: { mimeType, data: base64Data } },
            { text: "Analyze this image and provide a short, aesthetic, vintage-style caption (max 5-6 words) suitable for a polaroid photo bottom text. Also estimate the date or season/year if possible in dd.mm.yyyy format. If date is not clear, return today's date." }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              caption: { type: Type.STRING },
              date: { type: Type.STRING }
            },
            required: ["caption", "date"]
          }
        }
      });

      const json = JSON.parse(response.text || '{}');
      if (json.caption) handleChange('title', json.caption);
      if (json.date) handleChange('date', json.date);

    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Could not generate caption. Please ensure your API key is configured and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Find current font name
  const currentFont = FONTS.find(f => f.value === config.fontFamily);

  // Common container classes: Bold border, hard shadow, Neo-Brutalist look
  const containerClasses = "w-full border-2 border-stone-800 dark:border-stone-200 rounded-xl bg-white dark:bg-[#1E1E1E] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] transition-all";

  return (
    <div className="w-full md:w-[340px] h-auto md:h-screen bg-stone-100 dark:bg-[#121212] flex flex-col items-center select-none font-sans transition-colors duration-0 border-r border-stone-200 dark:border-white/5 rounded-t-3xl md:rounded-none -mt-6 md:mt-0 relative z-30 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] md:shadow-none md:overflow-hidden">
      
      {/* Scrollable Content Wrapper */}
      <div className="w-full max-w-[340px] p-6 md:p-8 flex flex-col gap-8 flex-1 md:overflow-y-auto">
        
        {/* Header - Desktop Only */}
        <div className="hidden md:block -mb-2">
          {/* Changed font-sans to font-logo (Sniglet) */}
          <h1 className="text-4xl text-stone-800 dark:text-stone-100 font-logo font-extrabold tracking-wide">Chronoid</h1>
          <p className="text-sm font-semibold text-stone-500 dark:text-stone-400 mt-1">Design your memory.</p>
        </div>
        
        {/* Mobile Section Header */}
        <div className="md:hidden mb-1 pt-2">
            {/* Small handle bar for the sheet look */}
           <div className="w-12 h-1.5 bg-stone-300 dark:bg-neutral-700 rounded-full mx-auto mb-4"></div>
           <h2 className="text-lg font-bold text-stone-800 dark:text-gray-100 flex items-center justify-center gap-2">
              Customize Photo
           </h2>
        </div>

        {/* Caption Input */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-stone-800 dark:text-stone-300">Caption</label>
            <button 
              onClick={handleMagicCaption}
              disabled={!imageSrc || isGenerating}
