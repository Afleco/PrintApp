import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAlert } from '../../providers/AlertProvider';
import { useTheme } from '../../providers/ThemeProvider';

export default function SignUpScreen() {
  const { theme } = useTheme();
  const { showAlert } = useAlert(); 
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!email || !password || !name || !phone) {
      showAlert('Error', 'Por favor completa todos los campos.');
      return;
    }

    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setLoading(false);
      showAlert('Error de registro', authError.message);
      return;
    }

    if (authData?.user) {
      const { error: dbError } = await supabase
        .from('Usuarios') 
        .insert({
          nombre: name,
          telefono: phone,
          email: email,
          auth_id: authData.user.id,
        });

      setLoading(false);

      if (dbError) {
        console.error(dbError);
        showAlert('Error al guardar perfil', 'El usuario se creó pero hubo un error guardando los datos.');
      } else {
        
        showAlert(
          '¡Registro Exitoso!',
          'Tu cuenta ha sido creada correctamente.',
          [
            { 
              text: 'OK', 
              onPress: () => {
                if (!authData.session) {
                    router.replace('/signin');
                }
              } 
            }
          ]
        );
      }
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
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

        <Text style={[styles.headerText, { color: theme.colors.primary }]}>
            Crear Cuenta
        </Text>
        <Text style={[styles.subHeaderText, { color: theme.colors.textSecondary }]}>
            Únete a PrintApp para imprimir fácil
        </Text>

        <View style={styles.formContainer}>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
                Nombre Completo
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
              placeholder="Tu nombre"
              placeholderTextColor={theme.colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
                Teléfono
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
              placeholder="Tu número de móvil"
              placeholderTextColor={theme.colors.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

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
              placeholderTextColor={theme.colors.textSecondary}
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
              placeholder="Crea una contraseña segura"
              placeholderTextColor={theme.colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[
                styles.registerButton, 
                { 
                    backgroundColor: theme.colors.accent,
                    shadowColor: theme.colors.accent 
                }
            ]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.textLight} />
            ) : (
              <Text style={[styles.registerButtonText, { color: theme.colors.textLight }]}>
                Registrarme
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
                ¿Ya tienes cuenta?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.footerText, { color: theme.colors.primary, fontWeight: 'bold' }]}>
                Inicia sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: 48,
  },
  logoContainer: {
    alignSelf: 'center',
    marginBottom: 24,
    width: 100, 
    height: 100,
    borderRadius: 25,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 15, 
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
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
  registerButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
  },
});