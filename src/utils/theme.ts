/**
 * Centralized theme configuration for the GoalsApp.
 * This file defines color palettes, semantic colors, and spacing/typography tokens
 * to ensure consistent styling across the entire application.
 */

/**
 * Base color palette - Raw color values organized by hue.
 * These can be used directly or mapped to semantic names below.
 */
export const Colors = {
  // Neutrals (grays)
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Blue (primary)
  blue50: '#EFF6FF',
  blue100: '#DBEAFE',
  blue200: '#BFDBFE',
  blue300: '#93C5FD',
  blue400: '#60A5FA',
  blue500: '#3B82F6',
  blue600: '#2563EB',
  blue700: '#1D4ED8',
  blue800: '#1E40AF',
  blue900: '#1E3A8A',

  // Green (success)
  green50: '#F0FDF4',
  green100: '#DCFCE7',
  green500: '#22C55E',
  green600: '#16A34A',
  green700: '#15803D',

  // Red (error/danger)
  red50: '#FEF2F2',
  red100: '#FEE2E2',
  red500: '#EF4444',
  red600: '#DC2626',
  red700: '#B91C1C',

  // Yellow (warning)
  yellow50: '#FEFCE8',
  yellow100: '#FEF9C3',
  yellow500: '#EAB308',
  yellow600: '#CA8A04',

  // Purple (accent)
  purple50: '#FAF5FF',
  purple100: '#F3E8FF',
  purple500: '#A855F7',
  purple600: '#9333EA',
  purple700: '#7E22CE',

  // Mint/Teal (primary brand color)
  mint50: '#F0F9F8',
  mint100: '#E0F3F1',
  mint200: '#C5E7E3',
  mint300: '#A3D7D2',
  mint400: '#8ABEB9', // Base brand color
  mint500: '#6FA9A4',
  mint600: '#5A8D89',
  mint700: '#477270',
  mint800: '#355856',
  mint900: '#2A4644',
};

/**
 * Semantic color mapping for light theme.
 * Use these in components instead of raw Colors to support future theming.
 */
export const LightTheme = {
  // Backgrounds
  background: Colors.white,
  backgroundSecondary: Colors.mint50,
  backgroundTertiary: Colors.mint100,
  backgroundPale: '#EFF7F6', // Pale mint/seafoam for login screen

  // Text
  textPrimary: '#333333',
  textSecondary: Colors.gray700,
  textTertiary: '#93A3A0',
  textDisabled: Colors.gray400,
  textInverse: Colors.white,

  // Borders
  border: Colors.gray300,
  borderLight: Colors.gray200,
  borderFocus: Colors.mint400,

  // Interactive elements - Using Mint as primary
  primary: Colors.mint400,
  primaryHover: Colors.mint500,
  primaryLight: Colors.mint100,
  primaryBorder: Colors.mint200,
  primaryDisabled: '#C5D9D6',

  // Status colors
  success: Colors.green600,
  successLight: Colors.green50,
  successBorder: Colors.green100,

  error: Colors.red600,
  errorLight: Colors.red50,
  errorBorder: Colors.red100,

  warning: Colors.yellow600,
  warningLight: Colors.yellow50,
  warningBorder: Colors.yellow100,

  info: Colors.blue600,
  infoLight: Colors.blue50,
  infoBorder: Colors.blue200,

  // Input fields
  inputBackground: Colors.white,
  inputBorder: Colors.gray300,
  inputPlaceholder: '#93A3A0',
  inputText: '#333333',
  inputFocus: Colors.mint400,

  // Shadows & overlays
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

/**
 * Semantic color mapping for dark theme.
 * Toggle between light and dark by swapping the exported theme object.
 */
export const DarkTheme = {
  // Backgrounds
  background: Colors.gray900,
  backgroundSecondary: Colors.gray800,
  backgroundTertiary: Colors.gray700,

  // Text
  textPrimary: Colors.gray50,
  textSecondary: Colors.gray300,
  textTertiary: Colors.gray400,
  textDisabled: Colors.gray500,
  textInverse: Colors.gray900,

  // Borders
  border: Colors.gray600,
  borderLight: Colors.gray700,
  borderFocus: Colors.blue400,

  // Interactive elements
  primary: Colors.blue500,
  primaryHover: Colors.blue400,
  primaryLight: Colors.blue900,
  primaryBorder: Colors.blue700,

  // Status colors
  success: Colors.green500,
  successLight: Colors.green700,
  successBorder: Colors.green700,

  error: Colors.red500,
  errorLight: Colors.red700,
  errorBorder: Colors.red700,

  warning: Colors.yellow500,
  warningLight: Colors.yellow600,
  warningBorder: Colors.yellow600,

  info: Colors.blue500,
  infoLight: Colors.blue800,
  infoBorder: Colors.blue700,

  // Input fields
  inputBackground: Colors.gray800,
  inputBorder: Colors.gray600,
  inputPlaceholder: Colors.gray500,
  inputText: Colors.gray50,
  inputFocus: Colors.blue400,

  // Shadows & overlays
  shadow: 'rgba(0, 0, 0, 0.4)',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

/**
 * Default theme export.
 * Change this to DarkTheme to switch the app to dark mode globally.
 */
export const Theme = LightTheme;

/**
 * Spacing scale for consistent margins, paddings, and gaps.
 * Based on 4px grid system.
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

/**
 * Typography scale for font sizes.
 */
export const FontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

/**
 * Font weights mapped to React Native's accepted values.
 */
export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

/**
 * Border radius values for consistent rounded corners.
 */
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24, // rounded-2xl in Tailwind
  full: 9999,
};

/**
 * Utility function to get shadow styles for both iOS and Android.
 * @param elevation - Shadow depth (1-5)
 */
export const getShadow = (elevation: 1 | 2 | 3 | 4 | 5 = 2) => {
  const shadows = {
    1: {
      shadowColor: Colors.black,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    2: {
      shadowColor: Colors.black,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    3: {
      shadowColor: Colors.black,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 3,
    },
    4: {
      shadowColor: Colors.black,
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 4,
    },
    5: {
      shadowColor: Colors.black,
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 5,
    },
  };
  return shadows[elevation];
};

export default {
  Colors,
  Theme,
  LightTheme,
  DarkTheme,
  Spacing,
  FontSize,
  FontWeight,
  BorderRadius,
  getShadow,
};
