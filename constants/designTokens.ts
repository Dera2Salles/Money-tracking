/**
 * Premium Design Tokens
 *
 * Each theme defines a complete set of semantic CSS variables.
 * Colors are hand-crafted RGB strings (not algorithmically generated).
 *
 * Naming: bg-base (darkest bg) → bg-surface (cards) → bg-raised (inputs, elevated)
 * One brand color per theme — used sparingly on CTA + active states only.
 */

export interface DesignTokens {
  // Background hierarchy — depth through tone
  '--color-bg-base': string;
  '--color-bg-surface': string;
  '--color-bg-raised': string;
  '--color-bg-overlay': string;
  '--color-bg-muted': string;
  // Brand — ONE accent color
  '--color-brand': string;
  '--color-brand-soft': string;
  '--color-brand-hover': string;
  '--color-brand-on': string;
  // Content hierarchy — 4 levels
  '--color-content-primary': string;
  '--color-content-secondary': string;
  '--color-content-tertiary': string;
  '--color-content-disabled': string;
  '--color-content-inverse': string;
  // Semantic states
  '--color-success': string;
  '--color-success-soft': string;
  '--color-warning': string;
  '--color-warning-soft': string;
  '--color-error': string;
  '--color-error-soft': string;
  '--color-info': string;
  '--color-info-soft': string;
  // Transaction types
  '--color-expense': string;
  '--color-expense-soft': string;
  '--color-income': string;
  '--color-income-soft': string;
  // Borders
  '--color-border-input': string;
  '--color-border-divider': string;
}

// ─── Light Mode Tokens ──────────────────────────────────────────────────────

const lightBase: Omit<DesignTokens,
  '--color-brand' | '--color-brand-soft' | '--color-brand-hover' | '--color-brand-on'
> = {
  // Backgrounds — warm off-whites, no pure white
  '--color-bg-base':    '248 248 250',   // #F8F8FA
  '--color-bg-surface': '255 255 255',   // #FFFFFF
  '--color-bg-raised':  '243 243 247',   // #F3F3F7
  '--color-bg-overlay': '255 255 255',   // #FFFFFF
  '--color-bg-muted':   '247 247 249',   // #F7F7F9
  // Content — neutral grays
  '--color-content-primary':   '20 20 25',     // #14141A
  '--color-content-secondary': '107 107 120',  // #6B6B78
  '--color-content-tertiary':  '156 156 168',  // #9C9CA8
  '--color-content-disabled':  '200 200 208',  // #C8C8D0
  '--color-content-inverse':   '255 255 255',  // #FFFFFF
  // Semantic
  '--color-success':      '34 197 94',    // #22C55E
  '--color-success-soft': '240 253 244',  // #F0FDF4
  '--color-warning':      '245 158 11',   // #F59E0B
  '--color-warning-soft': '255 251 235',  // #FFFBEB
  '--color-error':        '239 68 68',    // #EF4444
  '--color-error-soft':   '254 242 242',  // #FEF2F2
  '--color-info':         '59 130 246',   // #3B82F6
  '--color-info-soft':    '239 246 255',  // #EFF6FF
  // Transactions
  '--color-expense':      '239 68 68',    // #EF4444
  '--color-expense-soft': '254 242 242',  // #FEF2F2
  '--color-income':       '34 197 94',    // #22C55E
  '--color-income-soft':  '240 253 244',  // #F0FDF4
  // Borders
  '--color-border-input':   '228 228 234',  // #E4E4EA
  '--color-border-divider': '240 240 244',  // #F0F0F4
};

const darkBase: Omit<DesignTokens,
  '--color-brand' | '--color-brand-soft' | '--color-brand-hover' | '--color-brand-on'
> = {
  // Backgrounds — deep, layered surfaces (wider tonal spread for clarity)
  '--color-bg-base':    '18 18 22',     // #121216
  '--color-bg-surface': '26 26 32',     // #1A1A20
  '--color-bg-raised':  '42 42 52',     // #2A2A34
  '--color-bg-overlay': '36 36 44',     // #24242C
  '--color-bg-muted':   '22 22 28',     // #16161C
  // Content — brighter for better readability
  '--color-content-primary':   '240 240 245',  // #F0F0F5
  '--color-content-secondary': '160 160 178',  // #A0A0B2
  '--color-content-tertiary':  '110 110 125',  // #6E6E7D
  '--color-content-disabled':  '60 60 72',     // #3C3C48
  '--color-content-inverse':   '18 18 22',     // #121216
  // Semantic — brighter for dark mode readability
  '--color-success':      '72 187 120',   // #48BB78
  '--color-success-soft': '28 48 36',     // #1C3024
  '--color-warning':      '218 175 70',   // #DAAF46
  '--color-warning-soft': '50 42 24',     // #322A18
  '--color-error':        '235 87 87',    // #EB5757
  '--color-error-soft':   '50 32 32',     // #322020
  '--color-info':         '75 155 220',   // #4B9BDC
  '--color-info-soft':    '28 42 56',     // #1C2A38
  // Transactions
  '--color-expense':      '235 87 87',    // #EB5757
  '--color-expense-soft': '50 32 32',     // #322020
  '--color-income':       '72 187 120',   // #48BB78
  '--color-income-soft':  '28 48 36',     // #1C3024
  // Borders
  '--color-border-input':   '62 62 74',   // #3E3E4A
  '--color-border-divider': '42 42 52',   // #2A2A34
};

// ─── Theme Brand Colors ─────────────────────────────────────────────────────

interface BrandTokens {
  '--color-brand': string;
  '--color-brand-soft': string;
  '--color-brand-hover': string;
  '--color-brand-on': string;
}

interface ThemeBrand {
  light: BrandTokens;
  dark: BrandTokens;
  chartColors: string[];
}

const themeBrands: Record<string, ThemeBrand> = {
  turquoise: {
    light: {
      '--color-brand':       '56 189 178',    // #38BDB2
      '--color-brand-soft':  '56 189 178',    // used at /8 opacity in className
      '--color-brand-hover': '44 168 158',    // #2CA89E
      '--color-brand-on':    '255 255 255',
    },
    dark: {
      '--color-brand':       '78 205 196',    // #4ECDC4
      '--color-brand-soft':  '78 205 196',
      '--color-brand-hover': '100 215 208',   // #64D7D0
      '--color-brand-on':    '255 255 255',
    },
    chartColors: [
      '#4ECDC4', '#FF6B6B', '#45B7D1', '#96CEB4',
      '#FFEAA7', '#DDA0DD', '#F39C12', '#3498DB',
    ],
  },
  blue: {
    light: {
      '--color-brand':       '52 120 246',    // #3478F6
      '--color-brand-soft':  '52 120 246',
      '--color-brand-hover': '40 100 220',    // #2864DC
      '--color-brand-on':    '255 255 255',
    },
    dark: {
      '--color-brand':       '70 140 255',    // #468CFF
      '--color-brand-soft':  '70 140 255',
      '--color-brand-hover': '90 155 255',    // #5A9BFF
      '--color-brand-on':    '255 255 255',
    },
    chartColors: [
      '#3478F6', '#F1C40F', '#9B59B6', '#1ABC9C',
      '#E74C3C', '#E67E22', '#34495E', '#2ECC71',
    ],
  },
  purple: {
    light: {
      '--color-brand':       '139 76 200',    // #8B4CC8
      '--color-brand-soft':  '139 76 200',
      '--color-brand-hover': '120 60 180',    // #783CB4
      '--color-brand-on':    '255 255 255',
    },
    dark: {
      '--color-brand':       '160 100 220',   // #A064DC
      '--color-brand-soft':  '160 100 220',
      '--color-brand-hover': '175 120 235',   // #AF78EB
      '--color-brand-on':    '255 255 255',
    },
    chartColors: [
      '#8B4CC8', '#2ECC71', '#3498DB', '#1ABC9C',
      '#F39C12', '#E91E63', '#00BCD4', '#8BC34A',
    ],
  },
  orange: {
    light: {
      '--color-brand':       '235 140 50',    // #EB8C32
      '--color-brand-soft':  '235 140 50',
      '--color-brand-hover': '215 120 35',    // #D77823
      '--color-brand-on':    '255 255 255',
    },
    dark: {
      '--color-brand':       '245 158 75',    // #F59E4B
      '--color-brand-soft':  '245 158 75',
      '--color-brand-hover': '250 175 100',   // #FAAF64
      '--color-brand-on':    '255 255 255',
    },
    chartColors: [
      '#F59E4B', '#1ABC9C', '#3498DB', '#27AE60',
      '#9B59B6', '#E74C3C', '#E91E63', '#00BCD4',
    ],
  },
};

// ─── Public API ─────────────────────────────────────────────────────────────

export function getDesignTokens(themeId: string, isDark: boolean): DesignTokens {
  const base = isDark ? darkBase : lightBase;
  const brand = themeBrands[themeId]?.[isDark ? 'dark' : 'light']
    ?? themeBrands.turquoise[isDark ? 'dark' : 'light'];

  return { ...base, ...brand };
}

export function getChartColors(themeId: string): string[] {
  return themeBrands[themeId]?.chartColors ?? themeBrands.turquoise.chartColors;
}

export function getBgBaseHex(isDark: boolean): string {
  return isDark ? '#121216' : '#F8F8FA';
}

export const THEME_IDS = ['turquoise', 'blue', 'purple', 'orange'] as const;
export type ThemeId = typeof THEME_IDS[number];
