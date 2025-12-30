export interface PolaroidConfig {
  title: string;
  date: string;
  textColor: string;
  backgroundColor: string;
  frameColor: string;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  cornerRadius: number;
  filter: string;
}

export interface FilterOption {
  name: string;
  value: string;
  previewColor: string;
}

export interface FontOption {
  name: string;
  value: string;
}

export interface TextStyleOption {
  label: string;
  key: keyof PolaroidConfig;
  class: string;
}

