import { Stack } from "expo-router";

import AuthProvider from "../providers/AuthProvider";

import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import SplashScreenComponent from '../components/SplashScreen';

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
      <SplashScreenComponent 
        onFinish={() => setAnimationFinished(true)} 
      />
    );
  }
  
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/signin" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}