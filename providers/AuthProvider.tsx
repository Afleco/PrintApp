import { Session } from "@supabase/supabase-js";
import { router, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { supabase } from "../lib/supabase";

type AuthData = {
  loading: boolean;
  session: Session | null;
  user: any | null; // acceso directo al usuario
};

const AuthContext = createContext<AuthData>({
  loading: true,
  session: null,
  user: null,
});


interface Props {
  children: React.ReactNode;
}

export default function AuthProvider(props: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const segments = useSegments(); // Para saber en qué pantalla estamos

  useEffect(() => {
    // Carga inicial de la sesión
    async function fetchSession() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          
          if (error.message.includes("Refresh Token")) {
             console.log("Token caducado, cerrando sesión...");
             setSession(null);
          } else {
             console.error("Error al obtener sesión:", error.message);
          }
        } else {
          setSession(data.session);
        }
      } catch (e) {
        console.error("Error inesperado en Auth:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();

    // Escuchar cambios de estado (Login, Logout, Auto-Refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Evento Auth: ${event}`); // para depurar

      if (event === 'TOKEN_REFRESHED') {
        // Si se refrescó el token, actualizamos la sesión
        setSession(session);
        return; 
      }

      if (event === 'SIGNED_OUT') {
        setSession(null);
        // La navegación se maneja en el useEffect de abajo
      } else {
        setSession(session);
      }
      
      setLoading(false);
    });

    // Auto-refresh manual si la app vuelve de segundo plano
    const appStateListener = AppState.addEventListener('change', (state) => {
        if (state === 'active') {
            supabase.auth.startAutoRefresh();
        } else {
            supabase.auth.stopAutoRefresh();
        }
    });

    return () => {
      authListener?.subscription.unsubscribe();
      appStateListener.remove();
    };
  }, []);

  // Lógica de Protección de Rutas (Navegación centralizada)
  // Este useEffect vigila si cambia la sesión o si el usuario se mueve
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)'; // ¿Está en login/signup?

    if (session && inAuthGroup) {
      // Si tiene sesión y está en pantallas de auth -> Mandar al Home
      router.replace('/');
    } else if (!session && !inAuthGroup) {
      // Si NO tiene sesión y está dentro de la app -> Mandar a Login
      router.replace('/(auth)/signin'); 
    }
  }, [session, loading, segments]);

  return (
    <AuthContext.Provider value={{ loading, session, user: session?.user || null }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);