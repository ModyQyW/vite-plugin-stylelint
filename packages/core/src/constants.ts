import type { Colors } from 'picocolors/types';
import type { TextType } from './types';

export const STYLELINT_SEVERITY = {
  ERROR: 'error',
  WARNING: 'warning',
} as const;

export const CWD = process.cwd();

export const PLUGIN_NAME = 'vite:stylelint';

export const COLOR_MAPPING: Record<TextType, keyof Omit<Colors, 'isColorSupported'>> = {
  error: 'red',
  warning: 'yellow',
  plugin: 'magenta',
};
