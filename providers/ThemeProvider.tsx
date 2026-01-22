import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, ThemeType } from '../styles/theme';

// Definimos qué datos compartiremos
type ThemeContextData = {
  theme: ThemeType;
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextData>({
  theme: lightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Detectamos la preferencia del sistema
  const systemScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark');

  // Seleccionamos el tema actual basado en el estado
  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el tema fácil
export const useTheme = () => useContext(ThemeContext);