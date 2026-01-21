import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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
import { theme } from '../../styles/theme';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!email || !password || !name || !phone) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    setLoading(true);

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setLoading(false);
      Alert.alert('Error de registro', authError.message);
      return;
    }

    // Si el registro de Auth salió bien, authData.user tendrá el ID
    if (authData?.user) {
      // Insertar datos en la tabla pública 'Usuarios'
      const { error: dbError } = await supabase
        .from('Usuarios') 
        .insert({
          nombre: name,
          telefono: phone,
          email: email,
          auth_id: authData.user.id, // Vinculamos con el ID de autenticación
          // Nota: No enviamos 'id' (es autoincremental) ni 'rol' (asumimos que tiene un valor por defecto (Cliente) en la BD)
        });

      setLoading(false);

      if (dbError) {
        console.error(dbError);
        Alert.alert('Error al guardar perfil', 'El usuario se creó pero hubo un error guardando los datos.');
      } else {
        Alert.alert(
          '¡Registro Exitoso!',
          'Tu cuenta ha sido creada correctamente.',
          [
            { 
              text: 'OK', 
              onPress: () => {
                // TODO: Revisar - Si Supabase tiene activada la confirmación por email, puede que no inicie sesión automáticamente.
                // Si no requiere confirmación, el AuthProvider detectará la sesión y redirigirá.
                if (!authData.session) {
                    router.replace('/signin'); // Si requiere confirmar email
                }
                // Si hay sesión, el AuthProvider en _layout hará el trabajo.
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
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        
        <View style={styles.logoContainer}>
            <Image 
                source={require('../../assets/images/printappicon.png')} 
                style={styles.logoImage}
                contentFit="contain" // Nota: en expo-image es 'contentFit', no 'resizeMode'
                transition={1000} // efecto suave de fundido si carga lento
            />
        </View>

        <Text style={styles.headerText}>Crear Cuenta</Text>
        <Text style={styles.subHeaderText}>Únete a PrintApp para imprimir fácil</Text>

        <View style={styles.formContainer}>
          
          {/* Campo: Nombre */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              placeholderTextColor={theme.colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Campo: Teléfono */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu número de móvil"
              placeholderTextColor={theme.colors.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Campo: Email */}
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

          {/* Campo: Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Crea una contraseña segura"
              placeholderTextColor={theme.colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Botón Registrarse */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.textLight} />
            ) : (
              <Text style={styles.registerButtonText}>Registrarme</Text>
            )}
          </TouchableOpacity>

          {/* Volver al Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
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
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xxl,
  },
  logoContainer: {
    alignSelf: 'center',
    marginBottom: theme.spacing.l,
    width: 100, // Un poco más pequeño que en login para dar espacio al formulario
    height: 100,
    backgroundColor: theme.colors.background,
    borderRadius: 25,
    shadowColor: theme.colors.primary,
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
    ...theme.textVariants.header,
    textAlign: 'center',
    color: theme.colors.primary,
  },
  subHeaderText: {
    ...theme.textVariants.subHeader,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  formContainer: {
    width: '100%',
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
  registerButton: {
    backgroundColor: theme.colors.accent, 
    borderRadius: theme.borderRadius.m,
    paddingVertical: theme.spacing.m,
    alignItems: 'center',
    marginTop: theme.spacing.m,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  registerButtonText: {
    ...theme.textVariants.button,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
});