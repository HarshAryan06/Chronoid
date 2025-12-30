import type { PolaroidConfig, TextStyleOption } from '../types';
import { formatDate } from '../utils/date';

export const DEFAULT_CONFIG: PolaroidConfig = {
  title: '',
  date: formatDate(new Date()),
  textColor: '#292524',
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

export const TEXT_STYLE_OPTIONS: TextStyleOption[] = [
  { label: 'B', key: 'isBold', class: 'font-bold' },
  { label: 'I', key: 'isItalic', class: 'italic' },
  { label: 'U', key: 'isUnderline', class: 'underline' },
  { label: 'S', key: 'isStrikethrough', class: 'line-through' },
];

export const CORNER_RADIUS_PRESETS = [
  { value: 0, label: 'Sharp' },
  { value: 8, label: 'Soft' },
  { value: 16, label: 'Round' },
  { value: 24, label: 'Max' },
] as const;

