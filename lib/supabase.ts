import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabasePublishKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

// Creamos un adaptador de almacenamiento personalizado
const ExpoStorage = {
  getItem: (key: string) => {
    // Si estamos en web Y en el servidor (no hay window), devolvemos null
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return Promise.resolve(null);
    }
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return Promise.resolve();
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return Promise.resolve();
    }
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabasePublishKey, {
  auth: {
    storage: ExpoStorage, // Usamos nuestro adaptador seguro
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  }
});