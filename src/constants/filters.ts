import type { FilterOption } from '../types';

/**
 * Image filter presets
 */
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

