'use client';
import { vars } from 'nativewind';
import { getDesignTokens } from '@/constants/designTokens';

// Re-export vars for dynamic usage
export { vars };

/**
 * Build NativeWind CSS variables from the new semantic design tokens.
 * Called by GluestackUIProvider on theme/colorMode change.
 */
export function buildDesignVars(themeId: string, isDark: boolean) {
  const tokens = getDesignTokens(themeId, isDark);
  return vars(tokens as unknown as Record<string, string>);
}

// ─── Legacy exports (kept for gradual migration) ────────────────────────────

export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '128 128 128';
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
}

function adjustColor(rgb: string, amount: number): string {
  const [r, g, b] = rgb.split(' ').map(Number);
  const adjust = (c: number) => Math.max(0, Math.min(255, Math.round(c + amount)));
  return `${adjust(r)} ${adjust(g)} ${adjust(b)}`;
}

export function generateSecondaryColors(hexColor: string, isDark: boolean) {
  const base = hexToRgb(hexColor);

  if (isDark) {
    return {
      '--color-secondary-0': adjustColor(base, -120),
      '--color-secondary-50': adjustColor(base, -100),
      '--color-secondary-100': adjustColor(base, -80),
      '--color-secondary-200': adjustColor(base, -60),
      '--color-secondary-300': adjustColor(base, -40),
      '--color-secondary-400': adjustColor(base, -20),
      '--color-secondary-500': base,
      '--color-secondary-600': adjustColor(base, 20),
      '--color-secondary-700': adjustColor(base, 40),
      '--color-secondary-800': adjustColor(base, 60),
      '--color-secondary-900': adjustColor(base, 80),
      '--color-secondary-950': adjustColor(base, 100),
    };
  }

  return {
    '--color-secondary-0': adjustColor(base, 100),
    '--color-secondary-50': adjustColor(base, 80),
    '--color-secondary-100': adjustColor(base, 60),
    '--color-secondary-200': adjustColor(base, 40),
    '--color-secondary-300': adjustColor(base, 20),
    '--color-secondary-400': adjustColor(base, 10),
    '--color-secondary-500': base,
    '--color-secondary-600': adjustColor(base, -20),
    '--color-secondary-700': adjustColor(base, -40),
    '--color-secondary-800': adjustColor(base, -60),
    '--color-secondary-900': adjustColor(base, -80),
    '--color-secondary-950': adjustColor(base, -100),
  };
}

// Legacy raw config — kept so existing Gluestack components don't break immediately
export const rawConfig = {
  light: {} as Record<string, string>,
  dark: {} as Record<string, string>,
};

export const config = {
  light: vars(rawConfig.light),
  dark: vars(rawConfig.dark),
};
