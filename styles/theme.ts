const palette = {
  deepBlue: '#003B73',   
  brightBlue: '#00AEEF', 
  orangeAccent: '#F7941D', 
  white: '#FFFFFF',
  lightGray: '#F0F2F5',  // Para fondos suaves
  darkGray: '#666666',   // Para textos secundarios o placeholders
  errorRed: '#D32F2F',
};

export const theme = {
  colors: {
    background: palette.white,
    backgroundSecondary: palette.lightGray,
    primary: palette.deepBlue,
    secondary: palette.brightBlue,
    accent: palette.orangeAccent,
    textPrimary: palette.deepBlue,
    textSecondary: palette.darkGray,
    textLight: palette.white,
    inputBorder: palette.brightBlue,
    inputBackground: palette.white,
    error: palette.errorRed,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 12,
    round: 50,
  },
  textVariants: {
    header: {
      fontSize: 28,
      fontWeight: 'bold' as 'bold',
      color: palette.deepBlue,
      marginBottom: 8,
    },
    subHeader: {
      fontSize: 16,
      color: palette.darkGray,
      marginBottom: 24,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as '600',
      color: palette.white,
    },
  },
};