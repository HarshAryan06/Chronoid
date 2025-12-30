import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { parseDate } from '../../utils/date';

interface CalendarProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const Calendar: React.FC<CalendarProps> = ({ value, onChange, onClose }) => {
  const [viewDate, setViewDate] = useState(() => parseDate(value));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 121 }, (_, i) => currentYear - 100 + i);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setViewDate(new Date(newYear, viewDate.getMonth(), 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    setViewDate(new Date(viewDate.getFullYear(), newMonth, 1));
  };

  const handleDayClick = (day: number) => {
    const d = String(day).padStart(2, '0');
    const m = String(viewDate.getMonth() + 1).padStart(2, '0');
    const y = viewDate.getFullYear();
    const dateString = `${d}.${m}.${y}`;

    onChange(dateString);
    onClose();
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      let isActive = false;
      const parts = value.split('.');
      if (parts.length === 3) {
        const [d, m, y] = parts.map(Number);
        if (d === i && m - 1 === viewDate.getMonth() && y === viewDate.getFullYear()) {
          isActive = true;
        }
      }

      days.push(
        <button
          key={i}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDayClick(i);
          }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200
            ${
              isActive
                ? 'bg-stone-800 dark:bg-white text-white dark:text-black shadow-md'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10'
            }
          `}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  return (
    <div
      className="p-4 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl border border-stone-200 dark:border-white/10 w-[280px] select-none animate-in fade-in zoom-in-95 duration-200 font-sans"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Year & Month Selectors */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-[0.8]">
          <select
            value={viewDate.getFullYear()}
            onChange={handleYearChange}
            className="w-full h-9 appearance-none pl-2 pr-6 bg-stone-50 dark:bg-black/30 border border-stone-200 dark:border-white/10 rounded-lg text-xs font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-400/20 dark:focus:ring-white/20 focus:border-stone-500 dark:focus:border-white/30 cursor-pointer transition-colors"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 dark:text-stone-400 pointer-events-none"
          />
        </div>
        <div className="relative flex-[1.2]">
          <select
            value={viewDate.getMonth()}
            onChange={handleMonthChange}
            className="w-full h-9 appearance-none pl-2 pr-6 bg-stone-50 dark:bg-black/30 border border-stone-200 dark:border-white/10 rounded-lg text-xs font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-400/20 dark:focus:ring-white/20 focus:border-stone-500 dark:focus:border-white/30 cursor-pointer transition-colors"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 dark:text-stone-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrevMonth();
          }}
          className="w-7 h-7 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-white/10 rounded-full text-stone-600 dark:text-stone-400 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="font-extrabold text-stone-800 dark:text-stone-100 text-sm">
          {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNextMonth();
          }}
          className="w-7 h-7 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-white/10 rounded-full text-stone-600 dark:text-stone-400 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-extrabold text-stone-400 dark:text-stone-500 uppercase tracking-wide"
          >
            {d.slice(0, 3)}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 justify-items-center">{renderDays()}</div>
    </div>
  );
};

