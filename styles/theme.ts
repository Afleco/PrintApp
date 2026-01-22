// paleta base 
const palette = {
  deepBlue: '#003B73',   // Azul oscuro
  brightBlue: '#00AEEF', // Azul claro/cian
  orangeAccent: '#F7941D', // Naranja
  white: '#FFFFFF',
  lightGray: '#F0F2F5',
  darkGray: '#666666',
  
  // Colores específicos para modo oscuro
  black: '#121212',       
  darkCard: '#1E1E1E',    
  lightText: '#E0E0E0',   
};


export type ThemeType = typeof lightTheme;

// Tema CLARO
export const lightTheme = {
  dark: false,
  colors: {
    background: palette.lightGray,
    cardBackground: palette.white,
    primary: palette.deepBlue,
    secondary: palette.brightBlue,
    accent: palette.orangeAccent,
    textPrimary: palette.deepBlue, // Texto azul oscuro sobre fondo claro
    textSecondary: palette.darkGray,
    textLight: palette.white,      // Texto blanco sobre botones oscuros
    inputBorder: palette.brightBlue,
    inputBackground: palette.white,
    error: '#D32F2F',
    icon: palette.deepBlue,
  },
  spacing: { xs: 4, s: 8, m: 16, l: 24, xl: 32, xxl: 48 },
  borderRadius: { s: 4, m: 8, l: 12, round: 50 },
};

// Tema OSCURO (La versión invertida)
export const darkTheme = {
  dark: true,
  colors: {
    background: palette.black,     // Fondo oscuro
    cardBackground: palette.darkCard, // Tarjetas oscuras
    primary: palette.brightBlue,   // azul claro como primario para que resalte sobre negro
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