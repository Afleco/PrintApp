import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import SplashScreenComponent from '../components/SplashScreen';
import { AlertProvider } from "../providers/AlertProvider";
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
         
         <SplashScreenComponent onFinish={() => setAnimationFinished(true)} />
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider>
      <AlertProvider> 
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)/signin" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}