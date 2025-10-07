import { createTheme } from '@mui/material/styles';

// Tipografía
export const FONT_FAMILY = "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif" as const;

// Colores principales (teal)
export const COLOR_PRIMARY = "#0b4650" as const;        // --color-primary
export const COLOR_PRIMARY_DARK = "#073138" as const;   // --color-primary-dark
export const COLOR_PRIMARY_LIGHT = "#547d84" as const;  // --color-primary-light

// Secundario (naranja deportivo)
export const COLOR_SECONDARY = "#c45400" as const;         // --color-secondary
export const COLOR_SECONDARY_DARK = "#a84f00" as const;    // --color-secondary-dark
export const COLOR_SECONDARY_LIGHT = "#f8ae7c" as const;   // --color-secondary-light

// Complementarios / backgrounds
export const COLOR_PRIMARY_BACKGROUND = "#dae3e4" as const;   // fondo suave primario
export const COLOR_SECONDARY_BACKGROUND = "#fdeade" as const; // fondo suave secundario

// Texto y superficies
export const COLOR_WHITE = "#ffffff" as const;          // --color-white
export const COLOR_SURFACE = "#f7f9fb" as const;        // --color-surface
export const COLOR_TEXT_DARK = "#1f2a33" as const;      // --color-text-dark
export const COLOR_TEXT_MUTED = "#607380" as const;     // --color-text-muted
export const COLOR_TEXT_GRAY = "#e3e8ee" as const;      // usado como divider/border

// Estados
export const COLOR_ERROR = "#e53935" as const;          // --color-error
export const COLOR_FINISH_ACTION = "#e53935" as const;  // mismo valor

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

  SECONDARY_INTERMEDIATE: COLOR_SECONDARY_BACKGROUND,
  SECONDARY_BACKGROUND: COLOR_PRIMARY_BACKGROUND,

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
    divider: COLORS.TEXT_GRAY, // aquí ahora es un color de borde neutro #e3e8ee
  },
  typography: {
    fontFamily: FONT_FAMILY,
  },
});
