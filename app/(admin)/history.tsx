import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../providers/ThemeProvider';

export default function HistoryScreen() {
  const { theme } = useTheme();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    setLoading(true);
    const { data, error } = await supabase
      .from('Pedidos')
      .select(`
        *,
        cliente:Usuarios!id_cliente(nombre),
        admin:Usuarios!id_admin(nombre)
      `)
      .eq('estado', 'Terminado')
      .order('created_at', { ascending: false });

    if (!error) setOrders(data || []);
    setLoading(false);
  }

  const handleOpenDocument = (url: string) => {
    if (url) Linking.openURL(url);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
      <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>ID Pedido:</Text>
          <Text style={[styles.value, { color: theme.colors.textPrimary }]}>#{item.id}</Text>
      </View>
      
      <View style={styles.divider} />

      <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Cliente:</Text>
          <Text style={[styles.value, { color: theme.colors.textPrimary }]}>{item.cliente?.nombre || 'N/A'} (ID: {item.id_cliente})</Text>
      </View>
      
      <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Gestionado por:</Text>
          <Text style={[styles.value, { color: theme.colors.primary, fontWeight: 'bold' }]}>
            {item.admin?.nombre || 'Sin asignar'} (ID: {item.id_admin})
          </Text>
      </View>

      <View style={styles.row}>
         <Text style={{fontSize: 12, color: theme.colors.textSecondary}}>
            {item.n_copias} copias - {item.a_color ? 'Color' : 'B/N'}
         </Text>
      </View>

      {/* Botón para ver archivo en historial */}
      {item.archivo_url && (
          <TouchableOpacity 
            style={[styles.miniButton, { backgroundColor: theme.colors.backgroundSecondary }]}
            onPress={() => handleOpenDocument(item.archivo_url)}
          >
             <Ionicons name="eye-outline" size={16} color={theme.colors.textPrimary} />
             <Text style={{fontSize: 12, color: theme.colors.textPrimary, marginLeft: 4}}>Ver Archivo</Text>
          </TouchableOpacity>
      )}

      <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
         Fecha: {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
         <TouchableOpacity onPress={() => router.back()} style={{padding: 8}}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
         </TouchableOpacity>
         <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Historial de Pedidos</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchHistory} />}
        ListEmptyComponent={!loading ? <Text style={{textAlign:'center', color:theme.colors.textSecondary}}>Sin historial.</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 48 },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 16 },
  card: { padding: 16, borderRadius: 12, marginBottom: 12, elevation: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  date: { fontSize: 12, marginTop: 8, fontStyle: 'italic', alignSelf: 'flex-end' },
  miniButton: { flexDirection: 'row', alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, marginTop: 8, alignItems: 'center' }
});