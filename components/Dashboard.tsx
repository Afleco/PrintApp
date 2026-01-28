import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';

interface DashboardProps {
  userProfile: {
    nombre: string;
    rol: string;
  } | null;
  onSignOut: () => void;
}

export default function Dashboard({ userProfile, onSignOut }: DashboardProps) {
  const { theme, toggleTheme, isDarkMode } = useTheme();

  const navigateTo = (screen: string) => {
    // @ts-ignore
    router.push(screen);
  };
  
  const userRole = userProfile?.rol || '';
  const isClient = userRole === 'Cliente';
  const isAdmin = userRole === 'Administrador';

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeText, { color: theme.colors.textSecondary }]}>Hola,</Text>
          <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>
            {userProfile?.nombre || 'Usuario'}
          </Text>
          <Text style={[styles.roleBadge, { color: theme.colors.primary, backgroundColor: isDarkMode ? 'rgba(0, 174, 239, 0.2)' : 'rgba(0, 59, 115, 0.1)' }]}>
            {userRole || 'Invitado'}
          </Text>
        </View>

        <View style={styles.headerButtons}>
            <TouchableOpacity 
              onPress={toggleTheme} 
              style={[styles.iconButton, { backgroundColor: theme.colors.cardBackground }]}
            >
              <Ionicons 
                name={isDarkMode ? "sunny" : "moon"} 
                size={22} 
                color={theme.colors.accent} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onSignOut} 
              style={[styles.iconButton, { backgroundColor: theme.colors.cardBackground }]}
            >
              <Ionicons name="log-out-outline" size={22} color={theme.colors.error} />
            </TouchableOpacity>
        </View>
      </View>

      {/* INFO CARD */}
      <View style={[styles.infoCard, { backgroundColor: theme.colors.cardBackground }]}>
        <Ionicons name="information-circle" size={30} color={theme.colors.primary} style={{marginBottom: 10}}/>
        <Text style={[styles.infoTitle, { color: theme.colors.textPrimary }]}>
          Bienvenido a PrintApp
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          {isAdmin 
            ? 'Panel de gestión: Revisa y procesa los pedidos entrantes.' 
            : 'Sube tus documentos y recógelos cuando estén listos.'}
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
        Panel de Control
      </Text>

      {/* ACCIONES */}
      <View style={styles.actionsContainer}>
        
        {/* --- OPCIONES DE ADMINISTRADOR --- */}
        {isAdmin && (
          <>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.colors.accent }]}
              onPress={() => navigateTo('/(admin)/pending')}
            >
              <Ionicons name="time" size={32} color="white" />
              <Text style={styles.actionText}>Pedidos en Espera</Text>
              <Text style={styles.actionSubtext}>Asignar nuevos pedidos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigateTo('/(admin)/assigned')}
            >
              <Ionicons name="clipboard" size={32} color="white" />
              <Text style={styles.actionText}>Pedidos Asignados</Text>
              <Text style={styles.actionSubtext}>Gestionar cola de impresión</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.colors.secondary }]}
              onPress={() => navigateTo('/(admin)/history')}
            >
              <Ionicons name="archive" size={32} color="white" />
              <Text style={styles.actionText}>Historial Global</Text>
            </TouchableOpacity>
          </>
        )}

        {/* --- OPCIONES DE CLIENTE --- */}
        {(isClient || !isAdmin) && (
          <>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.colors.accent }]}
              onPress={() => navigateTo('/create-order')}
            >
              <Ionicons name="add-circle" size={40} color="white" />
              <Text style={styles.actionTextLarge}>Realizar Pedido</Text>
              <Text style={styles.actionSubtext}>Documentos PDF, JPG...</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigateTo('/my-orders')}
            >
              <Ionicons name="list" size={32} color="white" />
              <Text style={styles.actionText}>Tus Pedidos</Text>
              <Text style={styles.actionSubtext}>Ver estado de impresiones</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* --- FOOTER COPYRIGHT --- */}
      <View style={styles.copyright}>
        <Ionicons name="logo-github" size={16} color={theme.colors.textSecondary} />
        <Text style={[styles.copyrightText, { color: theme.colors.textSecondary }]}>
            © {new Date().getFullYear()} Afleco
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 24, paddingTop: 48, paddingBottom: 40 }, // paddingBottom extra para el footer
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  headerButtons: { flexDirection: 'row', gap: 12 },
  welcomeText: { fontSize: 16 },
  userName: { fontSize: 24, fontWeight: 'bold' },
  roleBadge: {
    fontSize: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
    fontWeight: '600',
    overflow: 'hidden',
  },
  iconButton: {
    padding: 10,
    borderRadius: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  infoCard: {
    padding: 24,
    borderRadius: 12,
    marginBottom: 32,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  infoText: { lineHeight: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  actionsContainer: { gap: 16 },
  actionCard: {
    padding: 24,
    borderRadius: 12,
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    minHeight: 120,
  },
  actionText: { fontSize: 18, fontWeight: 'bold', color: 'white', marginTop: 8 },
  actionTextLarge: { fontSize: 22, fontWeight: 'bold', color: 'white', marginTop: 8 },
  actionSubtext: { fontSize: 14, color: 'rgba(255, 255, 255, 0.9)', marginTop: 4 },
  
  copyright: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    opacity: 0.6,
  },
  copyrightText: {
    fontSize: 12,
    marginLeft: 6
  }
});