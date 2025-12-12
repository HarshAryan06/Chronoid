import { PolaroidConfig, FilterOption, FontOption } from './types';

export const DEFAULT_CONFIG: PolaroidConfig = {
  title: '',
  date: '',
  textColor: '#292524', // Default to Stone 800
  backgroundColor: '#ffffff',
  frameColor: '#ffffff',
  fontFamily: '"Nunito", sans-serif',
  isBold: true,
  isItalic: false,
  isUnderline: false,
  isStrikethrough: false,
  cornerRadius: 10,
  filter: 'none',
};

export const COLORS = [
  '#000000', '#292524', '#57534E', '#FFFFFF', '#172554', 
  '#422006', '#7F1D1D', '#064E3B', '#4C1D95'
];

export const FRAME_COLORS = [
  '#ffffff', '#fafaf9', '#f5f5f4', '#d6d3d1', '#000000', 
  '#fee2e2', '#ffedd5', '#dcfce7', '#dbeafe'
];

export const FONTS: FontOption[] = [
  { name: 'Nunito', value: '"Nunito", sans-serif' },
  { name: 'Roboto Mono', value: '"Roboto Mono", monospace' },
  { name: 'Inter', value: '"Inter", sans-serif' },
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
  { name: 'Dancing Script', value: '"Dancing Script", cursive' },
  { name: 'Pacifico', value: '"Pacifico", cursive' },
  { name: 'Caveat', value: '"Caveat", cursive' },
  { name: 'Shadows Into Light', value: '"Shadows Into Light", cursive' },
  { name: 'Indie Flower', value: '"Indie Flower", cursive' },
  { name: 'Permanent Marker', value: '"Permanent Marker", cursive' },
  { name: 'Amatic SC', value: '"Amatic SC", cursive' },
  { name: 'Satisfy', value: '"Satisfy", cursive' },
  { name: 'Lucida Console', value: '"Lucida Console", Monaco, monospace' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { name: 'Courier New', value: '"Courier New", Courier, monospace' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Impact', value: 'Impact, Charcoal, sans-serif' },
];

export const FILTERS: FilterOption[] = [
  { name: 'Normal', value: 'none', previewColor: 'bg-gray-200' },
  { name: 'Sepia', value: 'sepia(0.6) contrast(1.1)', previewColor: 'bg-amber-700' },
  { name: 'B&W', value: 'grayscale(1)', previewColor: 'bg-gray-700' },
  { name: 'Vintage', value: 'contrast(1.1) brightness(1.1) saturate(1.3) sepia(0.3)', previewColor: 'bg-orange-300' },
  { name: 'Cool', value: 'hue-rotate(180deg) saturate(0.8)', previewColor: 'bg-blue-400' },
  { name: 'Warm', value: 'sepia(0.3) saturate(1.4)', previewColor: 'bg-red-400' },
  { name: 'Dramatic', value: 'contrast(1.2) saturate(1.1) brightness(0.9)', previewColor: 'bg-indigo-900' },
  { name: 'Fade', value: 'opacity(0.7) brightness(1.1)', previewColor: 'bg-gray-300' },
];