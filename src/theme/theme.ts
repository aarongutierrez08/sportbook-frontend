import { createTheme } from '@mui/material/styles';

// Tipografía
export const FONT_FAMILY = "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif" as const;

// Colores principales
export const COLOR_PRIMARY = "#389148" as const;        // --color-primary
export const COLOR_PRIMARY_DARK = "#2A6B35" as const;   // --color-primary-dark
export const COLOR_PRIMARY_LIGHT = "#4CAF50" as const;  // --color-primary-light

export const COLOR_SECONDARY = "#E98E26" as const;         // --color-secondary
export const COLOR_SECONDARY_DARK = "#C67620" as const;    // --color-secondary-dark
export const COLOR_SECONDARY_LIGHT = "#FFE0B2" as const;   // --color-secondary-light

// Complementarios
export const COLOR_SECONDARY_INTERMEDIATE = "#F5F0FF" as const; // --color-secondary-intermediate
export const COLOR_SECONDARY_BACKGROUND = "#F8FFF9" as const;   // --color-primary-background

// Texto y superficies
export const COLOR_WHITE = "#ffffff" as const;          // --color-white
export const COLOR_SURFACE = "#f8fafc" as const;        // --color-surface
export const COLOR_TEXT_DARK = "#2D3748" as const;      // --color-text-dark
export const COLOR_TEXT_MUTED = "#718096" as const;     // --color-text-muted
export const COLOR_TEXT_GRAY = "#4A5568" as const;      // --color-text-gray

// Estados
export const COLOR_ERROR = "#E53E3E" as const;          // --color-error
export const COLOR_FINISH_ACTION = "#E53E3E" as const;  // --color-finish-action (mismo valor)

// Sombras
export const SHADOW_DEFAULT = "rgba(0, 0, 0, 0.1)" as const; // --shadow-default

// Grouped export (opcional)
export const COLORS = {
  PRIMARY: COLOR_PRIMARY,
  PRIMARY_DARK: COLOR_PRIMARY_DARK,
  PRIMARY_LIGHT: COLOR_PRIMARY_LIGHT,

  SECONDARY: COLOR_SECONDARY,
  SECONDARY_DARK: COLOR_SECONDARY_DARK,
  SECONDARY_LIGHT: COLOR_SECONDARY_LIGHT,

  SECONDARY_INTERMEDIATE: COLOR_SECONDARY_INTERMEDIATE,
  SECONDARY_BACKGROUND: COLOR_SECONDARY_BACKGROUND,

  WHITE: COLOR_WHITE,
  SURFACE: COLOR_SURFACE,
  TEXT_DARK: COLOR_TEXT_DARK,
  TEXT_MUTED: COLOR_TEXT_MUTED,
  TEXT_GRAY: COLOR_TEXT_GRAY,

  ERROR: COLOR_ERROR,
  FINISH_ACTION: COLOR_FINISH_ACTION,

  SHADOW_DEFAULT: SHADOW_DEFAULT,
} as const;

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: COLORS.PRIMARY,
      dark: COLORS.PRIMARY_DARK,
      light: COLORS.PRIMARY_LIGHT,
      contrastText: COLORS.WHITE,
    },
    secondary: {
      main: COLORS.SECONDARY,
      dark: COLORS.SECONDARY_DARK,
      light: COLORS.SECONDARY_LIGHT,
      contrastText: COLORS.WHITE,
    },
    error: { main: COLORS.ERROR },
    text: { primary: COLORS.TEXT_DARK, secondary: COLORS.TEXT_MUTED },
    background: { default: COLORS.SECONDARY_BACKGROUND, paper: COLORS.SURFACE },
    divider: COLORS.TEXT_GRAY,
  },
  typography: {
    fontFamily: FONT_FAMILY,
  },
});
