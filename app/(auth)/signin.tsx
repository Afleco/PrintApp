import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { theme } from '../../styles/theme';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
      if (!email || !password) {
        Alert.alert('Error', 'Por favor ingresa tu email y contraseña.');
        return;
      }
  
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
  
      setLoading(false);
  
      if (error) {
        Alert.alert('Error de inicio de sesión', error.message);
      }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        
       
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/printappicon.png')} 
            style={styles.logoImage}
            contentFit="contain" // Nota: en expo-image es 'contentFit', no 'resizeMode'
            transition={1000} // efecto suave de fundido si carga lento
            />
        </View>
        

        <Text style={styles.headerText}>Iniciar sesión</Text>
        <Text style={styles.subHeaderText}>Solicita y revisa tus pedidos de impresión</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@correo.com"
            placeholderTextColor={theme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor={theme.colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.textLight} />
          ) : (
            <Text style={styles.loginButtonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta? </Text>
          {/* Agregamos el onPress para navegar */}
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={[styles.footerText, { color: theme.colors.accent, fontWeight: 'bold' }]}>
            Regístrate aquí
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxl, 
  },

  logoContainer: {
    alignSelf: 'center',
    marginBottom: theme.spacing.l,
    width: 150,  
    height: 150,
    backgroundColor: theme.colors.background, // Fondo blanco para que la sombra se vea bien
    borderRadius: 35, // Bordes muy redondeados
    
    // Sombra para iOS
    shadowColor: theme.colors.primary, 
    shadowOffset: {
      width: 0,
      height: 8, // Sombra desplazada hacia abajo
    },
    shadowOpacity: 0.25, // Opacidad de la sombra
    shadowRadius: 12, // Difuminado de la sombra
    
    // Elevación para Android
    elevation: 15, 
  },
  
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35, // Siempre debe coincidir con el del contenedor
    overflow: 'hidden', 
  },
 
  headerText: {
    ...theme.textVariants.header,
    textAlign: 'center',
    color: theme.colors.primary,
    marginTop: theme.spacing.s, 
  },
  subHeaderText: {
    ...theme.textVariants.subHeader,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
  },
  inputGroup: {
    marginBottom: theme.spacing.m,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.s,
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.m,
    paddingVertical: theme.spacing.m,
    alignItems: 'center',
    marginTop: theme.spacing.m,
    shadowColor: theme.colors.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginButtonText: {
    ...theme.textVariants.button,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
});