import { Alert, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";
import { theme } from "../styles/theme";

export default function Index() {
  
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert("Error", error.message);
    // El AuthProvider detectará el cambio y mandará al Login automáticamente
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <Text style={{ ...theme.textVariants.header, marginBottom: 20 }}>
        Bienvenido a PrintApp
      </Text>
      
      <Text style={{ marginBottom: 40, color: theme.colors.textSecondary }}>
        Estás dentro de la aplicación.
      </Text>

      <TouchableOpacity
        onPress={handleSignOut}
        style={{
          backgroundColor: theme.colors.error, 
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: theme.borderRadius.m,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}