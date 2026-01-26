import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAlert } from '../../providers/AlertProvider';
import { useTheme } from '../../providers/ThemeProvider';

export default function AssignedOrdersScreen() {
  const { theme } = useTheme();
  const { showAlert } = useAlert();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  async function fetchMyOrders() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: userData } = await supabase
        .from('Usuarios')
        .select('id')
        .eq('auth_id', user.id)
        .single();
    
    if (!userData) {
        showAlert("Error", "No se encontró tu perfil de usuario.");
        setLoading(false);
        return;
    }

    const { data, error } = await supabase
      .from('Pedidos')
      .select('*, cliente:Usuarios!id_cliente(nombre)')
      .eq('id_admin', userData.id)
      .eq('estado', 'Procesando');

    if (error) {
        console.error(error);
        showAlert('Error', 'Error al cargar pedidos asignados');
    } else {
        setOrders(data || []);
    }
    
    setLoading(false);
  }

  async function handleCompleteOrder(orderId: number) {
    
    showAlert(
        "Completar Pedido",
        "¿Confirmas que este pedido ha sido impreso y entregado?",
        [
            { text: "Cancelar", style: "cancel" },
            { 
                text: "Sí, Completar", 
                onPress: async () => {
                    const { error } = await supabase
                      .from('Pedidos')
                      .update({ estado: 'Terminado' })
                      .eq('id', orderId);

                    if (!error) {
                        fetchMyOrders(); 
                    } else {
                        showAlert("Error", error.message);
                    }
                }
            }
        ]
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
      <Text style={[styles.clientName, { color: theme.colors.textPrimary }]}>
        Cliente: {item.cliente?.nombre || 'Desconocido'} (ID: {item.id_cliente})
      </Text>
      
      <View style={styles.detailsRow}>
          <Text style={{color: theme.colors.textSecondary}}>Copias: {item.n_copias}</Text>
          <Text style={{color: theme.colors.textSecondary}}>•</Text>
          <Text style={{color: theme.colors.textSecondary}}>Color: {item.a_color ? 'Sí' : 'No'}</Text>
      </View>

      <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
        Fecha: {new Date(item.created_at).toLocaleDateString()}
      </Text>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={() => handleCompleteOrder(item.id)}
      >
        <Ionicons name="checkmark-circle" size={24} color="white" style={{marginRight: 8}}/>
        <Text style={styles.buttonText}>Marcar Completado</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
         <TouchableOpacity onPress={() => router.back()} style={{padding: 8}}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
         </TouchableOpacity>
         <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Mis Pedidos Asignados</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchMyOrders} />}
        ListEmptyComponent={!loading ? (
            <Text style={{textAlign:'center', marginTop: 20, color: theme.colors.textSecondary}}>
                No tienes pedidos en curso.
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
  clientName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  detailsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  date: { fontSize: 12, marginBottom: 12 },
  button: { flexDirection: 'row', padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
});