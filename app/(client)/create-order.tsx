import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator, Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text, TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { useAlert } from '../../providers/AlertProvider';
import { useTheme } from '../../providers/ThemeProvider';

export default function CreateOrderScreen() {
  const { theme } = useTheme();
  const { showAlert } = useAlert();

  const [description, setDescription] = useState('');
  const [copies, setCopies] = useState('1');
  const [isColor, setIsColor] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<any>(null);

  // Seleccionar documento
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', 
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setSelectedFile({
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
        size: file.size,
      });

    } catch (err) {
      console.error(err);
      showAlert('Error', 'No se pudo seleccionar el archivo.');
    }
  };

  // Usar Cámara
  const pickFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      showAlert('Permiso denegado', 'Necesitamos acceso a la cámara.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false, 
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const fileName = `foto_${Date.now()}.jpg`;
      
      setSelectedFile({
        uri: asset.uri,
        name: fileName,
        type: 'image/jpeg',
        size: 0, // En cámara no siempre tenemos el tamaño directo, no es crítico
      });
    }
  };

  // Subir archivo y crear pedido
 const handleSubmit = async () => {
    if (!description) {
      showAlert('Faltan datos', 'Por favor añade una descripción.');
      return;
    }
    if (!selectedFile) {
      showAlert('Sin archivo', 'Debes adjuntar un documento o foto.');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No hay sesión activa');

      const { data: userData } = await supabase
        .from('Usuarios')
        .select('id')
        .eq('auth_id', user.id)
        .single();
        
      if (!userData) throw new Error('Usuario no encontrado.');

      // --- PARA MÓVIL: ARRAYBUFFER ---
      // Hay que obtenemor el archivo binario puro usando ArrayBuffer en lugar de Blob
      const response = await fetch(selectedFile.uri);
      const fileData = await response.arrayBuffer();
      

      const fileExt = selectedFile.name.split('.').pop();
      const cleanFileName = selectedFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const filePath = `${userData.id}/${Date.now()}_${cleanFileName}`;

      // Aseguramos el Content-Type correcto
      // Si el selector no nos dio el tipo, intentamos adivinarlo o usamos uno genérico
      const fileType = selectedFile.type || 'application/octet-stream';

      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('documentos') 
        .upload(filePath, fileData, { // Subimos el ArrayBuffer
           contentType: fileType,
           upsert: false
        });

      if (storageError) throw new Error('Error subiendo archivo: ' + storageError.message);

      const { data: urlData } = supabase.storage
        .from('documentos')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('Pedidos')
        .insert({
          id_cliente: userData.id,
          descripcion: description,
          n_copias: parseInt(copies) || 1,
          a_color: isColor,
          estado: 'Esperando',
          archivo_url: urlData.publicUrl,
        });

      if (dbError) throw new Error('Error creando pedido: ' + dbError.message);

      setLoading(false);
      showAlert('¡Pedido Enviado!', 'Tu solicitud se ha creado correctamente.', [
        { text: 'Ir a Mis Pedidos', onPress: () => router.replace('/my-orders') }
      ]);

    } catch (error: any) {
      setLoading(false);
      console.error("Error detallado:", error);
      showAlert('Error', error.message || 'Ocurrió un error inesperado');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
         <TouchableOpacity onPress={() => router.back()} style={{padding: 8}}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
         </TouchableOpacity>
         <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Nuevo Pedido</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>1. Adjuntar Documento</Text>
          
          <View style={styles.attachButtons}>
            <TouchableOpacity style={[styles.attachBtn, { borderColor: theme.colors.primary, backgroundColor: theme.colors.inputBackground }]} onPress={pickDocument}>
               <Ionicons name="document-text-outline" size={28} color={theme.colors.primary} />
               <Text style={[styles.attachText, { color: theme.colors.primary }]}>Subir PDF/Doc</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.attachBtn, { borderColor: theme.colors.accent, backgroundColor: theme.colors.inputBackground }]} onPress={pickFromCamera}>
               <Ionicons name="camera-outline" size={28} color={theme.colors.accent} />
               <Text style={[styles.attachText, { color: theme.colors.accent }]}>Escanear</Text>
            </TouchableOpacity>
          </View>

          {selectedFile && (
            <View style={[styles.filePreview, { backgroundColor: theme.colors.backgroundSecondary }]}>
               {selectedFile.type?.includes('image') ? (
                  <Image source={{ uri: selectedFile.uri }} style={styles.previewImage} />
               ) : (
                  <Ionicons name="document" size={32} color={theme.colors.primary} />
               )}
               
               <View style={{flex: 1, marginLeft: 12}}>
                  <Text style={[styles.fileName, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                    {selectedFile.name}
                  </Text>
                  {/* size puede ser 0 o undefined en cámara, protegemos la visualización */}
                  {selectedFile.size > 0 && (
                      <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </Text>
                  )}
               </View>

               <TouchableOpacity onPress={() => setSelectedFile(null)} style={{padding: 8}}>
                 <Ionicons name="close-circle" size={24} color={theme.colors.error} />
               </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>2. Detalles de Impresión</Text>

          <Text style={[styles.subLabel, { color: theme.colors.textSecondary }]}>Descripción</Text>
          <TextInput 
            style={[styles.input, { 
              backgroundColor: theme.colors.inputBackground, 
              color: theme.colors.textPrimary, 
              borderColor: theme.colors.inputBorder 
            }]}
            placeholder="Ej: Imprimir a doble cara..."
            placeholderTextColor={theme.colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <View style={styles.rowOptions}>
            <View style={{flex: 1, marginRight: 16}}>
               <Text style={[styles.subLabel, { color: theme.colors.textSecondary }]}>Nº Copias</Text>
               <TextInput 
                  style={[styles.input, { 
                    backgroundColor: theme.colors.inputBackground, 
                    color: theme.colors.textPrimary,
                    borderColor: theme.colors.inputBorder,
                    textAlign: 'center'
                  }]}
                  keyboardType="numeric"
                  value={copies}
                  onChangeText={setCopies}
               />
            </View>

            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
               <Text style={[styles.subLabel, { color: theme.colors.textSecondary, marginBottom: 8 }]}>
                 Tipo de tinta
               </Text>
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <Text style={{ color: !isColor ? theme.colors.primary : theme.colors.textSecondary, fontWeight: 'bold', marginRight: 8 }}>B/N</Text>
                 <Switch 
                   value={isColor} 
                   onValueChange={setIsColor}
                   trackColor={{ false: '#767577', true: theme.colors.accent }}
                   thumbColor={'white'}
                 />
                 <Text style={{ color: isColor ? theme.colors.accent : theme.colors.textSecondary, fontWeight: 'bold', marginLeft: 8 }}>Color</Text>
               </View>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, { backgroundColor: theme.colors.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="white" />
          ) : (
             <Text style={styles.submitText}>Confirmar Pedido</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 48 },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 16 },
  scrollContent: { padding: 20 },
  card: { padding: 20, borderRadius: 12, marginBottom: 20, elevation: 2 },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  subLabel: { fontSize: 14, marginBottom: 6 },
  attachButtons: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  attachBtn: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' },
  attachText: { marginTop: 8, fontWeight: '600' },
  filePreview: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 8, marginTop: 10 },
  previewImage: { width: 40, height: 40, borderRadius: 4 },
  fileName: { fontSize: 14, fontWeight: '500' },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16, minHeight: 48 },
  rowOptions: { flexDirection: 'row', justifyContent: 'space-between' },
  submitBtn: { padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, elevation: 4 },
  submitText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});