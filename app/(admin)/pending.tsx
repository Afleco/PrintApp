import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAlert } from '../../providers/AlertProvider';
import { useTheme } from '../../providers/ThemeProvider';

export default function PendingOrdersScreen() {
  const { theme } = useTheme();
  const { showAlert } = useAlert(); 
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  async function fetchPendingOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from('Pedidos')
      .select('*, cliente:Usuarios!id_cliente(nombre)') 
      .eq('estado', 'Esperando');

    if (error) {
      console.error(error);
      showAlert('Error', 'No se pudieron cargar los pedidos'); 
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  }

  async function handleAssignOrder(orderId: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: userData } = await supabase
        .from('Usuarios')
        .select('id')
        .eq('auth_id', user.id)
        .single();
    
    if (!userData) {
        showAlert("Error", "Usuario no encontrado."); 
        return;
    }

    const { error } = await supabase
      .from('Pedidos')
      .update({ 
          id_admin: userData.id,
          estado: 'Procesando' 
      })
      .eq('id', orderId);

    if (error) {
      showAlert('Error', error.message); 
    } else {
      showAlert('¡Asignado!', 'El pedido está ahora en "Pedidos Asignados"');
      fetchPendingOrders();
    }
  }

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.clientName, { color: theme.colors.textPrimary }]}>
           Cliente: {item.cliente?.nombre || 'Desconocido'} (ID: {item.id_cliente})
        </Text>
        <View style={styles.badge}>
            <Text style={styles.badgeText}>Esperando</Text>
        </View>
      </View>
      
      <View style={styles.detailsRow}>
          <Text style={{color: theme.colors.textSecondary}}>Copias: {item.n_copias}</Text>
          <Text style={{color: theme.colors.textSecondary}}>•</Text>
          <Text style={{color: theme.colors.textSecondary}}>Color: {item.a_color ? 'Sí' : 'No'}</Text>
      </View>

      <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
        Fecha: {new Date(item.created_at).toLocaleDateString()}
      </Text>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.colors.accent }]}
        onPress={() => handleAssignOrder(item.id)}
      >
        <Ionicons name="person-add" size={20} color="white" style={{marginRight: 8}}/>
        <Text style={styles.buttonText}>Asignarme este pedido</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
         <TouchableOpacity onPress={() => router.back()} style={{padding: 8}}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
         </TouchableOpacity>
         <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Pedidos en Espera</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPendingOrders} />}
        ListEmptyComponent={!loading ? (
            <Text style={{textAlign: 'center', marginTop: 20, color: theme.colors.textSecondary}}>
                No hay pedidos en espera.
            </Text>
        ) : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 48 },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 16 },
  card: { padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  clientName: { fontSize: 16, fontWeight: 'bold' },
  detailsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  date: { fontSize: 12, marginBottom: 12 },
  badge: { backgroundColor: '#F7941D', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  button: { flexDirection: 'row', padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
});