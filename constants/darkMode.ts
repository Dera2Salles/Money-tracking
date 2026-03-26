/**
 * Dark mode colors — consolidated into the design token system.
 * These hex values are kept for components that need inline styles
 * (e.g. StatusBar backgroundColor, charts, react-native-gifted-charts).
 *
 * For className-based styling, use the semantic tokens:
 *   bg-bg-base, bg-bg-surface, bg-bg-raised, text-content-primary, etc.
 */

export const DARK_COLORS = {
  background: '#121216',
  cardBg: '#1A1A20',
  cardBorder: '#2A2A34',
  textMuted: '#A0A0B2',
  chipBg: '#2A2A34',
  inputBg: '#1A1A20',
  switchOff: '#2A2A34',
  switchThumb: '#F0F0F5',
};

export const LIGHT_COLORS = {
  background: '#F8F8FA',
  cardBg: '#FFFFFF',
  cardBorder: '#F0F0F4',
  textMuted: '#6B6B78',
  chipBg: '#F3F3F7',
  inputBg: '#FFFFFF',
  switchOff: '#E4E4EA',
  switchThumb: '#FFFFFF',
};

// Semantic colors (same in both modes — used for inline styles in charts/gamification)
export const SEMANTIC_COLORS = {
  error: '#EF4444',
  errorLight: '#FEF2F2',
  errorLightDark: '#2D1F1F',
  success: '#22C55E',
  successLight: '#F0FDF4',
  successLightDark: '#1C2B21',
  warning: '#F59E0B',
  expense: '#EF4444',
  expenseLight: '#FEF2F2',
  expenseLightDark: '#2D1F1F',
  income: '#22C55E',
  incomeLight: '#F0FDF4',
  incomeLightDark: '#1C2B21',
  xpYellow: '#EAB308',
  xpYellowLight: '#FEFCE8',
  xpYellowLightDark: '#2D2A1F',
  badgePurple: '#A855F7',
  badgePurpleLight: '#FAF5FF',
  badgePurpleLightDark: '#261F2D',
  freezeBlue: '#3B82F6',
  freezeBlueLight: '#EFF6FF',
  freezeBlueLightDark: '#1A2832',
  xpBonus: '#7C3AED',
};

export function getDarkModeColors(isDark: boolean) {
  return isDark ? DARK_COLORS : LIGHT_COLORS;
}
