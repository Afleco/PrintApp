import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import Dashboard from '../components/Dashboard';
import { supabase } from '../lib/supabase';

import { useTheme } from '../providers/ThemeProvider';

type UserProfile = {
  nombre: string;
  rol: string;
};

export default function IndexScreen() {
  // Obtenemos el tema actual
  const { theme } = useTheme();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return; 

      let attempts = 0;
      let profileData = null;

      while (attempts < 5 && !profileData) {
        const { data, error } = await supabase
          .from('Usuarios')
          .select('nombre, rol')
          .eq('auth_id', user.id)
          .maybeSingle(); 

        if (error) {
          console.error('Error fetching profile:', error);
          break; 
        }

        if (data) {
          profileData = data; 
        } else {
          console.log(`Perfil no encontrado, intento ${attempts + 1}...`);
          await new Promise(resolve => setTimeout(resolve, 500));
          attempts++;
        }
      }

      if (profileData) {
        setProfile(profileData);
      } else {
        console.warn('No se pudo cargar el perfil después de varios intentos.');
      }

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert("Error", error.message);
  };

  if (loading) {
    return (
      // colores dinámicos para el fondo y el texto de carga
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 10, color: theme.colors.textSecondary }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <Dashboard 
      userProfile={profile} 
      onSignOut={handleSignOut} 
    />
  );
}