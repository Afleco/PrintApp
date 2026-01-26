// styles/theme.ts

const palette = {
  deepBlue: '#003B73',
  brightBlue: '#00AEEF',
  orangeAccent: '#F7941D',
  white: '#FFFFFF',
  lightGray: '#F0F2F5',
  mediumGray: '#E0E0E0', // Nuevo: gris medio para bordes/separadores
  darkGray: '#666666',
  
  black: '#121212',
  darkCard: '#1E1E1E',
  darkBorder: '#333333', // Nuevo: borde oscuro
  lightText: '#E0E0E0',
};

export type ThemeType = typeof lightTheme;

export const lightTheme = {
  dark: false,
  colors: {
    background: palette.lightGray,
    backgroundSecondary: palette.mediumGray, // <-- AÑADIDO (usado para bordes en alertas)
    cardBackground: palette.white,
    primary: palette.deepBlue,
    secondary: palette.brightBlue,
    accent: palette.orangeAccent,
    textPrimary: palette.deepBlue,
    textSecondary: palette.darkGray,
    textLight: palette.white,
    inputBorder: palette.brightBlue,
    inputBackground: palette.white,
    error: '#D32F2F',
    icon: palette.deepBlue,
  },
  spacing: { xs: 4, s: 8, m: 16, l: 24, xl: 32, xxl: 48 },
  borderRadius: { s: 4, m: 8, l: 12, round: 50 },
};

export const darkTheme = {
  dark: true,
  colors: {
    background: palette.black,
    backgroundSecondary: palette.darkBorder, // <-- AÑADIDO
    cardBackground: palette.darkCard,
    primary: palette.brightBlue,
    secondary: palette.deepBlue,
    accent: palette.orangeAccent,
    textPrimary: palette.lightText,
    textSecondary: '#A0A0A0',
    textLight: palette.black,
    inputBorder: palette.deepBlue,
    inputBackground: palette.darkCard,
    error: '#EF5350',
    icon: palette.brightBlue,
  },
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
};