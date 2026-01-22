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
// hook del proveedor
import { useTheme } from '../../providers/ThemeProvider';

export default function SignInScreen() {
  // Obtenemos el tema actual
  const { theme } = useTheme();
  
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
      // arrays de estilos para inyectar el color dinámico
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.formContainer}>
        
        <View style={[
            styles.logoContainer, 
            { 
              backgroundColor: theme.colors.background, 
              shadowColor: theme.colors.primary 
            }
          ]}>
          <Image 
            source={require('../../assets/images/printappicon.png')} 
            style={styles.logoImage}
            contentFit="contain" 
            transition={1000} 
            />
        </View>
        
        {/* Textos con color dinámico */}
        <Text style={[styles.headerText, { color: theme.colors.primary }]}>
          Iniciar sesión
        </Text>
        <Text style={[styles.subHeaderText, { color: theme.colors.textSecondary }]}>
          Solicita y revisa tus pedidos de impresión
        </Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
            Email
          </Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: theme.colors.inputBackground,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.textPrimary 
              }
            ]}
            placeholder="ejemplo@correo.com"
            placeholderTextColor={theme.colors.textSecondary} // Prop dinámico
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
            Contraseña
          </Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: theme.colors.inputBackground,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.textPrimary 
              }
            ]}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor={theme.colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.secondary }]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.textLight} />
          ) : (
            <Text style={[styles.loginButtonText, { color: theme.colors.textLight }]}>
              Entrar
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            ¿No tienes cuenta?{' '}
          </Text>
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
    // backgroundColor: se maneja arriba
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32, 
    paddingTop: 48, 
  },
  logoContainer: {
    alignSelf: 'center',
    marginBottom: 24,
    width: 150,  
    height: 150,
    borderRadius: 35,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 15, 
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    overflow: 'hidden', 
  },
  headerText: {
    fontSize: 28, 
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8, 
  },
  subHeaderText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8, 
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  loginButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 14,
  },
});