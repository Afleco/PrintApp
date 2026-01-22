import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import Dashboard from '../components/Dashboard';
import { supabase } from '../lib/supabase';
import { theme } from '../styles/theme';

type UserProfile = {
  nombre: string;
  rol: string;
};

export default function IndexScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return; 

      // LÓGICA DE REINTENTO (FIX para el error PGRST116)
      // Intentamos leer el perfil hasta 5 veces, esperando 1 segundo entre intentos.
      // Esto da tiempo a que el registro termine de insertar los datos.
      let attempts = 0;
      let profileData = null;

      while (attempts < 5 && !profileData) {
        const { data, error } = await supabase
          .from('Usuarios')
          .select('nombre, rol')
          .eq('auth_id', user.id)
          .maybeSingle(); // Usamos maybeSingle en lugar de single para evitar el error si no hay datos aún

        if (error) {
          console.error('Error fetching profile:', error);
          break; // Si es un error real de BD, salimos
        }

        if (data) {
          profileData = data; // ¡Lo encontramos!
        } else {
          // Si no hay datos todavía, esperamos 500ms y probamos otra vez
          console.log(`Perfil no encontrado, intento ${attempts + 1}...`);
          await new Promise(resolve => setTimeout(resolve, 500));
          attempts++;
        }
      }

      if (profileData) {
        setProfile(profileData);
      } else {
        // Si después de los intentos sigue sin haber datos, usamos valores por defecto
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