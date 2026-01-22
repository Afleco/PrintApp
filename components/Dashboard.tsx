import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../styles/theme';

// Definimos qué datos necesita este componente para funcionar
interface DashboardProps {
  userProfile: {
    nombre: string;
    rol: string;
  } | null;
  onSignOut: () => void;
}

export default function Dashboard({ userProfile, onSignOut }: DashboardProps) {
  
  // Función auxiliar para navegar
  const navigateTo = (screen: string) => {
    Alert.alert("Navegación", `Ir a pantalla: ${screen}`);
    // router.push(screen)
  };

  const isClient = userProfile?.rol === 'Cliente';
  const isAdmin = userProfile?.rol === 'Administrador';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hola,</Text>
          <Text style={styles.userName}>{userProfile?.nombre || 'Usuario'}</Text>
          <Text style={styles.roleBadge}>{userProfile?.rol}</Text>
        </View>
        <TouchableOpacity onPress={onSignOut} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      {/* INFORMACIÓN */}
      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={30} color={theme.colors.primary} style={{marginBottom: 10}}/>
        <Text style={styles.infoTitle}>Bienvenido a PrintApp</Text>
        <Text style={styles.infoText}>
          {isAdmin 
            ? 'Panel de gestión: Revisa y procesa los pedidos entrantes.' 
            : 'Sube tus documentos y recógelos cuando estén listos.'}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Panel de Control</Text>

      <View style={styles.actionsContainer}>
        
        {/* --- OPCIONES DE ADMINISTRADOR --- */}
        {isAdmin && (
          <>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigateTo('/admin/orders')}
            >
              <Ionicons name="clipboard" size={32} color="white" />
              <Text style={styles.actionText}>Pedidos Asignados</Text>
              <Text style={styles.actionSubtext}>Gestionar cola de impresión</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.colors.secondary }]}
              onPress={() => navigateTo('/admin/history')}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  contentContainer: {
    padding: theme.spacing.l,
    paddingTop: theme.spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xl,
  },
  welcomeText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  roleBadge: {
    fontSize: 12,
    color: theme.colors.primary,
    backgroundColor: 'rgba(0, 59, 115, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    fontWeight: '600',
  },
  logoutButton: {
    padding: theme.spacing.s,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.round,
    elevation: 2,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    marginBottom: theme.spacing.xl,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
  },
  infoText: {
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.m,
  },
  actionsContainer: {
    gap: theme.spacing.m,
  },
  actionCard: {
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    justifyContent: 'center',
    elevation: 4,
    minHeight: 120,
  },
  actionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: theme.spacing.s,
  },
  actionTextLarge: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: theme.spacing.s,
  },
  actionSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
});