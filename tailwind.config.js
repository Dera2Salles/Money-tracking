/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: process.env.DARK_MODE ? process.env.DARK_MODE : 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './utils/**/*.{ts,tsx}',
    './*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  important: 'html',
  theme: {
    extend: {
      // ─── Semantic Colors ─────────────────────────────────────────────
      // All colors use CSS variables for dynamic theming (4 theme presets)
      // Depth comes from tonal layering (base → surface → raised), not borders
      colors: {
        // Background hierarchy — depth through tone
        bg: {
          base:    'rgb(var(--color-bg-base) / <alpha-value>)',
          surface: 'rgb(var(--color-bg-surface) / <alpha-value>)',
          raised:  'rgb(var(--color-bg-raised) / <alpha-value>)',
          overlay: 'rgb(var(--color-bg-overlay) / <alpha-value>)',
          muted:   'rgb(var(--color-bg-muted) / <alpha-value>)',
        },
        // Brand — ONE accent color per theme, used sparingly
        brand: {
          DEFAULT: 'rgb(var(--color-brand) / <alpha-value>)',
          soft:    'rgb(var(--color-brand-soft) / <alpha-value>)',
          hover:   'rgb(var(--color-brand-hover) / <alpha-value>)',
          on:      'rgb(var(--color-brand-on) / <alpha-value>)',
        },
        // Text hierarchy — 4 levels, all neutral
        content: {
          primary:   'rgb(var(--color-content-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-content-secondary) / <alpha-value>)',
          tertiary:  'rgb(var(--color-content-tertiary) / <alpha-value>)',
          disabled:  'rgb(var(--color-content-disabled) / <alpha-value>)',
          inverse:   'rgb(var(--color-content-inverse) / <alpha-value>)',
        },
        // Semantic states — muted, not vivid
        success: {
          DEFAULT: 'rgb(var(--color-success) / <alpha-value>)',
          soft:    'rgb(var(--color-success-soft) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--color-warning) / <alpha-value>)',
          soft:    'rgb(var(--color-warning-soft) / <alpha-value>)',
        },
        error: {
          DEFAULT: 'rgb(var(--color-error) / <alpha-value>)',
          soft:    'rgb(var(--color-error-soft) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'rgb(var(--color-info) / <alpha-value>)',
          soft:    'rgb(var(--color-info-soft) / <alpha-value>)',
        },
        // Transaction types
        expense: {
          DEFAULT: 'rgb(var(--color-expense) / <alpha-value>)',
          soft:    'rgb(var(--color-expense-soft) / <alpha-value>)',
        },
        income: {
          DEFAULT: 'rgb(var(--color-income) / <alpha-value>)',
          soft:    'rgb(var(--color-income-soft) / <alpha-value>)',
        },
        // Borders — ONLY for inputs and explicit dividers, never for cards
        border: {
          input:   'rgb(var(--color-border-input) / <alpha-value>)',
          focus:   'rgb(var(--color-brand) / <alpha-value>)',
          divider: 'rgb(var(--color-border-divider) / <alpha-value>)',
        },

        // ─── Legacy Gluestack tokens (kept for gradual migration) ──────
        // These map to the new semantic tokens so existing components still work
        primary: {
          0:   'rgb(var(--color-bg-base) / <alpha-value>)',
          50:  'rgb(var(--color-bg-surface) / <alpha-value>)',
          100: 'rgb(var(--color-content-disabled) / <alpha-value>)',
          200: 'rgb(var(--color-content-tertiary) / <alpha-value>)',
          300: 'rgb(var(--color-content-tertiary) / <alpha-value>)',
          400: 'rgb(var(--color-content-secondary) / <alpha-value>)',
          500: 'rgb(var(--color-content-primary) / <alpha-value>)',
          600: 'rgb(var(--color-content-primary) / <alpha-value>)',
          700: 'rgb(var(--color-content-primary) / <alpha-value>)',
          800: 'rgb(var(--color-content-primary) / <alpha-value>)',
          900: 'rgb(var(--color-content-primary) / <alpha-value>)',
          950: 'rgb(var(--color-content-primary) / <alpha-value>)',
        },
        secondary: {
          0:   'rgb(var(--color-bg-base) / <alpha-value>)',
          50:  'rgb(var(--color-bg-surface) / <alpha-value>)',
          100: 'rgb(var(--color-bg-raised) / <alpha-value>)',
          200: 'rgb(var(--color-bg-overlay) / <alpha-value>)',
          300: 'rgb(var(--color-content-disabled) / <alpha-value>)',
          400: 'rgb(var(--color-content-tertiary) / <alpha-value>)',
          500: 'rgb(var(--color-content-secondary) / <alpha-value>)',
          600: 'rgb(var(--color-content-secondary) / <alpha-value>)',
          700: 'rgb(var(--color-content-primary) / <alpha-value>)',
          800: 'rgb(var(--color-content-primary) / <alpha-value>)',
          900: 'rgb(var(--color-content-primary) / <alpha-value>)',
          950: 'rgb(var(--color-content-primary) / <alpha-value>)',
        },
        typography: {
          0:     '#FFFFFF',  // always white — used for text on colored buttons
          50:    'rgb(var(--color-bg-surface) / <alpha-value>)',
          100:   'rgb(var(--color-content-disabled) / <alpha-value>)',
          200:   'rgb(var(--color-content-disabled) / <alpha-value>)',
          300:   'rgb(var(--color-content-tertiary) / <alpha-value>)',
          400:   'rgb(var(--color-content-tertiary) / <alpha-value>)',
          500:   'rgb(var(--color-content-secondary) / <alpha-value>)',
          600:   'rgb(var(--color-content-secondary) / <alpha-value>)',
          700:   'rgb(var(--color-content-primary) / <alpha-value>)',
          800:   'rgb(var(--color-content-primary) / <alpha-value>)',
          900:   'rgb(var(--color-content-primary) / <alpha-value>)',
          950:   'rgb(var(--color-content-primary) / <alpha-value>)',
          white: '#FFFFFF',
          gray:  '#D4D4D4',
          black: '#181718',
        },
        outline: {
          0:   'rgb(var(--color-bg-base) / <alpha-value>)',
          50:  'rgb(var(--color-bg-surface) / <alpha-value>)',
          100: 'rgb(var(--color-border-divider) / <alpha-value>)',
          200: 'rgb(var(--color-border-divider) / <alpha-value>)',
          300: 'rgb(var(--color-border-input) / <alpha-value>)',
          400: 'rgb(var(--color-content-tertiary) / <alpha-value>)',
          500: 'rgb(var(--color-content-secondary) / <alpha-value>)',
          600: 'rgb(var(--color-content-secondary) / <alpha-value>)',
          700: 'rgb(var(--color-content-primary) / <alpha-value>)',
          800: 'rgb(var(--color-content-primary) / <alpha-value>)',
          900: 'rgb(var(--color-content-primary) / <alpha-value>)',
          950: 'rgb(var(--color-content-primary) / <alpha-value>)',
        },
        background: {
          0:       'rgb(var(--color-bg-base) / <alpha-value>)',
          50:      'rgb(var(--color-bg-surface) / <alpha-value>)',
          100:     'rgb(var(--color-bg-raised) / <alpha-value>)',
          200:     'rgb(var(--color-bg-overlay) / <alpha-value>)',
          300:     'rgb(var(--color-content-disabled) / <alpha-value>)',
          400:     'rgb(var(--color-content-tertiary) / <alpha-value>)',
          500:     'rgb(var(--color-content-secondary) / <alpha-value>)',
          600:     'rgb(var(--color-content-secondary) / <alpha-value>)',
          700:     'rgb(var(--color-content-primary) / <alpha-value>)',
          800:     'rgb(var(--color-content-primary) / <alpha-value>)',
          900:     'rgb(var(--color-content-primary) / <alpha-value>)',
          950:     'rgb(var(--color-content-primary) / <alpha-value>)',
          error:   'rgb(var(--color-error-soft) / <alpha-value>)',
          warning: 'rgb(var(--color-warning-soft) / <alpha-value>)',
          muted:   'rgb(var(--color-bg-muted) / <alpha-value>)',
          success: 'rgb(var(--color-success-soft) / <alpha-value>)',
          info:    'rgb(var(--color-info-soft) / <alpha-value>)',
          light:   '#FBFBFB',
          dark:    '#121212',
        },
        indicator: {
          primary: 'rgb(var(--color-content-primary) / <alpha-value>)',
          info:    'rgb(var(--color-info) / <alpha-value>)',
          error:   'rgb(var(--color-error) / <alpha-value>)',
        },
      },

      // ─── Typography ────────────────────────────────────────────────────
      // 2 families only: display (headings) + body (everything else)
      fontFamily: {
        heading: undefined,
        body:    undefined,
        mono:    undefined,
        display: ['PlusJakartaSans-Bold'],
        ui:      ['PlusJakartaSans-SemiBold'],
        'body-regular': ['Inter-Regular'],
        'body-medium':  ['Inter-Medium'],
        // Legacy aliases
        jakarta:      ['var(--font-plus-jakarta-sans)'],
        roboto:       ['var(--font-roboto)'],
        code:         ['var(--font-source-code-pro)'],
        inter:        ['var(--font-inter)'],
        'space-mono': ['var(--font-space-mono)'],
      },

      fontWeight: {
        extrablack: '950',
      },

      fontSize: {
        '2xs': '10px',
        // Premium type scale
        'display-2xl': ['48px', { lineHeight: '52px', letterSpacing: -2 }],
        'display-xl':  ['36px', { lineHeight: '40px', letterSpacing: -1.5 }],
        'display-lg':  ['28px', { lineHeight: '34px', letterSpacing: -1 }],
        'display-md':  ['22px', { lineHeight: '28px', letterSpacing: -0.5 }],
        'ui-lg':       ['17px', { lineHeight: '24px', letterSpacing: 0.1 }],
        'ui-md':       ['15px', { lineHeight: '22px', letterSpacing: 0.1 }],
        'ui-sm':       ['13px', { lineHeight: '18px', letterSpacing: 0.2 }],
        'ui-xs':       ['11px', { lineHeight: '16px', letterSpacing: 0.4 }],
        'body-lg':     ['16px', { lineHeight: '26px' }],
        'body-md':     ['14px', { lineHeight: '22px' }],
        'body-sm':     ['12px', { lineHeight: '18px' }],
      },

      // ─── Border radius ────────────────────────────────────────────────
      borderRadius: {
        '2xl': 20,
        '3xl': 28,
        '4xl': 36,
      },

      // ─── Shadows ──────────────────────────────────────────────────────
      boxShadow: {
        'card':    '0px 2px 8px rgba(0, 0, 0, 0.08)',
        'card-lg': '0px 4px 12px rgba(0, 0, 0, 0.12)',
        'float':   '0px 8px 24px rgba(0, 0, 0, 0.16)',
        // Legacy
        'hard-1': '-2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-2': '0px 3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-3': '2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-4': '0px -3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-5': '0px 2px 10px 0px rgba(38, 38, 38, 0.10)',
        'soft-1': '0px 0px 10px rgba(38, 38, 38, 0.1)',
        'soft-2': '0px 0px 20px rgba(38, 38, 38, 0.2)',
        'soft-3': '0px 0px 30px rgba(38, 38, 38, 0.1)',
        'soft-4': '0px 0px 40px rgba(38, 38, 38, 0.1)',
      },
    },
  },
};
