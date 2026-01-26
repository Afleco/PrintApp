import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import SplashScreenComponent from '../components/SplashScreen';
import { AlertProvider } from "../providers/AlertProvider"; // <--- IMPORTAR
import AuthProvider from "../providers/AuthProvider";
import { ThemeProvider } from "../providers/ThemeProvider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 100)); 
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!appReady || !animationFinished) {
    return (
      <ThemeProvider>
         {/* El splash screen no necesita alertas, pero sí tema */}
         <SplashScreenComponent onFinish={() => setAnimationFinished(true)} />
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider>
      <AlertProvider> 
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="signin" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}