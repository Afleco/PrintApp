import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { supabase } from '../../lib/supabase';
import { useAlert } from '../../providers/AlertProvider';
import { useTheme } from '../../providers/ThemeProvider';

export default function MyOrdersScreen() {
  const { theme } = useTheme();
  const { showAlert } = useAlert();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: userData } = await supabase
        .from('Usuarios')
        .select('id')
        .eq('auth_id', user.id)
        .single();

    if (!userData) {
        setLoading(false);
        return;
    }

    const { data, error } = await supabase
      .from('Pedidos')
      .select('*')
      .eq('id_cliente', userData.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  }

  // --- FUNCIÓN PARA ABRIR DOCUMENTO ---
  const handleOpenDocument = async (url: string) => {
    if (!url) return;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
        Linking.openURL(url);
    } else {
        showAlert('Error', 'No se puede abrir el archivo.');
    }
  };

  const handleDeleteOrder = async (orderId: number, fileUrl: string, estado: string) => {
    if (estado !== 'Esperando') {
        showAlert('No permitido', 'Solo puedes eliminar pedidos que aún no han sido procesados.');
        return;
    }

    showAlert(
      "Eliminar Pedido", 
      "¿Estás seguro? Esta acción no se puede deshacer.", 
      [
        { text: "Cancelar", style: 'cancel' },
        { 
          text: "Eliminar", 
          style: 'destructive',
          onPress: async () => {
            try {
              if (fileUrl) {
                const path = fileUrl.split('/documentos/')[1];
                if (path) {
                  const { error: storageError } = await supabase.storage
                    .from('documentos')
                    .remove([path]);
                  
                  if (storageError) console.error("Error borrando archivo:", storageError);
                }
              }

              const { error: dbError } = await supabase
                .from('Pedidos')
                .delete()
                .eq('id', orderId);

              if (dbError) throw dbError;

              fetchOrders();

            } catch (error: any) {
              showAlert('Error', 'No se pudo eliminar el pedido: ' + error.message);
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Esperando': return theme.colors.accent;
      case 'Procesando': return theme.colors.primary;
      case 'Terminado': return '#4CAF50';
      default: return theme.colors.textSecondary;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
      
      {/* HEADER: ID + ESTADO + BORRAR */}
      <View style={styles.cardHeader}>
         <View style={{flexDirection:'row', alignItems:'center', gap: 8}}>
            <Text style={[styles.orderId, { color: theme.colors.textSecondary }]}>#{item.id}</Text>
            <View style={[styles.badge, { backgroundColor: getStatusColor(item.estado) }]}>
                <Text style={styles.badgeText}>{item.estado}</Text>
            </View>
         </View>
         
         {item.estado === 'Esperando' && (
            <TouchableOpacity onPress={() => handleDeleteOrder(item.id, item.archivo_url, item.estado)}>
                <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
            </TouchableOpacity>
         )}
      </View>

      <Text style={[styles.desc, { color: theme.colors.textPrimary }]}>
        {item.descripcion}
      </Text>

      <View style={styles.divider} />

      <View style={styles.details}>
         <View style={styles.detailItem}>
            <Ionicons name="copy-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
               {item.n_copias} {item.n_copias === 1 ? 'copia' : 'copias'}
            </Text>
         </View>
         <View style={styles.detailItem}>
            <Ionicons name="color-palette-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
               {item.a_color ? 'Color' : 'B/N'}
            </Text>
         </View>
      </View>

      {/* FOOTER: VER DOCUMENTO + FECHA */}
      <View style={styles.footerRow}>
          {item.archivo_url ? (
            <TouchableOpacity 
                style={[styles.fileButton, { backgroundColor: theme.colors.backgroundSecondary }]}
                onPress={() => handleOpenDocument(item.archivo_url)}
            >
                <Ionicons name="eye-outline" size={16} color={theme.colors.textPrimary} />
                <Text style={{ marginLeft: 6, color: theme.colors.textPrimary, fontSize: 12, fontWeight: '600' }}>
                    Ver Documento
                </Text>
            </TouchableOpacity>
          ) : <View />} 

          <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
             {new Date(item.created_at).toLocaleDateString()}
          </Text>
      </View>

    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
         <TouchableOpacity onPress={() => router.back()} style={{padding: 8}}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
         </TouchableOpacity>
         <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Mis Pedidos</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOrders} />}
        ListEmptyComponent={!loading ? (
            <View style={{alignItems: 'center', marginTop: 40}}>
                <Ionicons name="folder-open-outline" size={48} color={theme.colors.textSecondary} />
                <Text style={{color: theme.colors.textSecondary, marginTop: 10}}>No has realizado ningún pedido.</Text>
            </View>
        ) : null}
      />

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: theme.colors.accent }]}
        onPress={() => router.push('/create-order')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 48 },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 16 },
  card: { padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  orderId: { fontWeight: 'bold', fontSize: 14 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  desc: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 12 },
  details: { flexDirection: 'row', gap: 16, marginBottom: 12 }, // Se ajusta un poco el margen
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 14 },
  
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  date: { fontSize: 12 },
  fileButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
  }
});